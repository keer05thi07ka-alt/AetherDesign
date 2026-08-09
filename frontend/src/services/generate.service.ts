/**
 * Image generation.
 *
 * One backend call returns both the AI Understanding and the image. The
 * image comes back as base64 because the Workbench parameter field cannot
 * carry a payload that size to Postgres — so the browser uploads it to
 * Supabase Storage and then creates the asset row.
 */

import * as api from '../lib/apiClient';
import { supabase } from '../lib/supabaseClient';
import type { BrandTokens } from '../types/api';

export interface Understanding {
  intent?: string;
  subject?: string;
  composition?: string;
  palette?: string[];
  mood?: string;
  avoid?: string[];
  image_prompt?: string;
  negative_prompt?: string;
}

export interface Source {
  content: string;
  similarity: number;
}

export interface GenerationResult {
  ok: boolean;
  error: string | null;
  understanding: Understanding;
  sources: Source[];
  confident: boolean;
  top_similarity: number | null;
  image_prompt: string;
  platform: string;
  prompt: string;
  image: string;
  gen_width?: number;
  gen_height?: number;
}

export interface GenerateInput {
  prompt: string;
  platform: string;
  audience?: string;
  style?: string;
  enforcePalette?: boolean;
  brandTokens?: BrandTokens;
}

export async function generate(input: GenerateInput): Promise<GenerationResult> {
  const token = api.getToken();
  const base = import.meta.env.VITE_API_BASE_URL as string;

  const res = await fetch(`${base}/generate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: input.prompt,
      platform: input.platform,
      audience: input.audience ?? '',
      style: input.style ?? '',
      enforce_palette: input.enforcePalette ?? false,
      brand_tokens: input.brandTokens ?? {},
    }),
  });

  if (!res.ok) {
    throw new Error(`Generation failed (${res.status}). Please try again.`);
  }

  const body = (await res.json()) as GenerationResult;
  if (!body.ok && body.error) throw new Error(body.error);
  return body;
}

/** Convert a base64 string to a Blob without a huge intermediate string. */
function base64ToBlob(b64: string, mime = 'image/jpeg'): Blob {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

/** Upload a generated image and return its public URL. */
export async function uploadGeneratedImage(
  base64: string,
  orgId: string,
): Promise<string> {
  const blob = base64ToBlob(base64);
  const path = `${orgId}/generated/${Date.now()}.jpg`;

  const { error } = await supabase.storage
    .from('brand-assets')
    .upload(path, blob, { contentType: 'image/jpeg', upsert: false });

  if (error) throw new Error(`Could not save the image: ${error.message}`);

  const { data } = supabase.storage.from('brand-assets').getPublicUrl(path);
  return data.publicUrl;
}

/** Persist the asset after upload. */
export async function saveGeneratedAsset(input: {
  title: string;
  description: string;
  category: string;
  width: number;
  height: number;
  storagePath: string;
  campaignId?: string;
}): Promise<{ id: string }> {
  const result = await api.write('assets' as never, 'create', {
    title: input.title,
    description: input.description,
    category: input.category,
    width: input.width,
    height: input.height,
    storage_path: input.storagePath,
    campaign_id: input.campaignId ?? null,
    status: 'draft',
  } as never);
  return result as unknown as { id: string };
}

/** Generate, upload, and persist in one call. */
export async function generateAndSave(
  input: GenerateInput & { orgId: string; width: number; height: number },
): Promise<{ result: GenerationResult; url: string; assetId: string }> {
  const result = await generate(input);
  if (!result.image) throw new Error(result.error ?? 'No image was returned.');

  const url = await uploadGeneratedImage(result.image, input.orgId);

  const asset = await saveGeneratedAsset({
    title: result.understanding.intent?.slice(0, 80) || input.prompt.slice(0, 80),
    description: result.image_prompt,
    category: input.platform,
    width: input.width,
    height: input.height,
    storagePath: url,
  });

  return { result, url, assetId: asset.id };
}
/**
 * Resize a generated image to exact platform dimensions.
 *
 * FLUX caps near 1 megapixel, so it generates at the correct aspect ratio
 * but not the exact size. Because the aspect already matches, this is a
 * pure scale — nothing is cropped or stretched.
 *
 * imageSmoothingQuality 'high' uses the browser's best resampling, which
 * matters for the ~1.9x upscale that story and hero formats require.
 */
export async function resizeToExact(
  base64: string,
  targetWidth: number,
  targetHeight: number,
): Promise<Blob> {
  const img = new Image();
  img.src = `data:image/jpeg;base64,${base64}`;
  await img.decode();

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is unavailable in this browser.');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Could not encode the image.'))),
      'image/jpeg',
      0.92,
    );
  });
}

/** Upload at exact platform dimensions and return the public URL. */
export async function uploadAtExactSize(
  base64: string,
  orgId: string,
  targetWidth: number,
  targetHeight: number,
): Promise<string> {
  const blob = await resizeToExact(base64, targetWidth, targetHeight);
  const path = `${orgId}/generated/${Date.now()}-${targetWidth}x${targetHeight}.jpg`;

  const { error } = await supabase.storage
    .from('brand-assets')
    .upload(path, blob, { contentType: 'image/jpeg', upsert: false });

  if (error) throw new Error(`Could not save the image: ${error.message}`);

  const { data } = supabase.storage.from('brand-assets').getPublicUrl(path);
  return data.publicUrl;
}