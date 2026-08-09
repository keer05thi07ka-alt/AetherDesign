/**
 * Brand Kit Engine.
 *
 * Logos go to Supabase Storage directly from the browser — Workbench has no
 * multipart support and its parameter field cannot carry binary payloads.
 *
 * Guidelines documents are parsed to text in the browser and only the text is
 * sent onward, so the user can see exactly what will be indexed before saving.
 */

import * as api from '../lib/apiClient';
import { supabase } from '../lib/supabaseClient';
import type { BrandTokens } from '../types/api';

export interface BrandKitDetail {
  id: string;
  name: string;
  tokens: BrandTokens;
  guidelines_text: string | null;
  created_at: string;
}

export async function fetchBrandKitDetail(): Promise<BrandKitDetail | null> {
  const rows = await api.list('brand_kit_detail' as never);
  return (rows[0] as unknown as BrandKitDetail) ?? null;
}

export async function saveBrandKit(input: {
  id?: string;
  name: string;
  tokens: BrandTokens;
  guidelines_text: string;
}): Promise<{ id: string; name: string }> {
  const op = input.id ? 'update' : 'create';
  const result = await api.write(
    'brand_kits' as never,
    op,
    {
      name: input.name,
      tokens: input.tokens,
      guidelines_text: input.guidelines_text,
    } as never,
    input.id,
  );
  return result as unknown as { id: string; name: string };
}

/** Upload a logo and return its public URL. */
export async function uploadLogo(file: File, orgId: string): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'png';
  const path = `${orgId}/logo-${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from('brand-assets')
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) throw new Error(`Logo upload failed: ${error.message}`);

  const { data } = supabase.storage.from('brand-assets').getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Extract plain text from an uploaded guidelines document.
 *
 * .txt and .md are read directly. PDF and DOCX need a parser, which is
 * loaded on demand so the main bundle stays small.
 */
export async function extractGuidelinesText(file: File): Promise<string> {
  const name = file.name.toLowerCase();

  if (name.endsWith('.txt') || name.endsWith('.md')) {
    return (await file.text()).trim();
  }

  if (name.endsWith('.docx')) {
    const mammoth = await import('mammoth');
    const buffer = await file.arrayBuffer();
    const { value } = await mammoth.extractRawText({ arrayBuffer: buffer });
    return value.trim();
  }

  if (name.endsWith('.pdf')) {
    const pdfjs = await import('pdfjs-dist');
    pdfjs.GlobalWorkerOptions.workerSrc =
      new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

    const buffer = await file.arrayBuffer();
    const doc = await pdfjs.getDocument({ data: buffer }).promise;

    const pages: string[] = [];
    for (let i = 1; i <= doc.numPages; i += 1) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      pages.push(
        content.items
          .map((item) => ('str' in item ? item.str : ''))
          .join(' ')
      );
    }
    return pages.join('\n\n').replace(/\s+\n/g, '\n').trim();
  }

  throw new Error('Unsupported file type. Upload a .txt, .md, .pdf or .docx file.');
}

/** Re-embed the guidelines. Called after every save so retrieval stays current. */
export async function reindexBrandKit(
  brandKitId: string,
  guidelinesText: string,
): Promise<{ chunks: number }> {
  const token = api.getToken();
  const base = import.meta.env.VITE_API_BASE_URL as string;

  const res = await fetch(`${base}/rag/ingest`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ brand_kit_id: brandKitId, guidelines_text: guidelinesText }),
  });

  const body = await res.json();
  const stored = body?.data?.items?.[0]?.json?.result;
  return { chunks: stored?.index != null ? stored.index + 1 : 0 };
}