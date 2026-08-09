import React, { useEffect, useRef, useState } from 'react';
import { Save, Upload, FileText, Loader2, Palette, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../../context/AppContext';
import * as bk from '../../services/brandKit.service';
import type { BrandTokens } from '../../types/api';

const FONTS = [
  'Inter', 'Poppins', 'Bitter', 'Playfair Display',
  'Source Sans 3', 'Space Grotesk', 'IBM Plex Mono',
];

export const BrandKitPage: React.FC = () => {
  const { can, user, refresh } = useApp();

  const [kitId, setKitId] = useState<string | undefined>();
  const [name, setName] = useState('');
  const [primary, setPrimary] = useState('#8B5CF6');
  const [secondary, setSecondary] = useState('#F5E6DC');
  const [accent, setAccent] = useState('#C9A227');
  const [font, setFont] = useState('Inter');
  const [tone, setTone] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [guidelines, setGuidelines] = useState('');
  const [sourceFile, setSourceFile] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const logoInput = useRef<HTMLInputElement>(null);
  const docInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void (async () => {
      try {
        const kit = await bk.fetchBrandKitDetail();
        if (kit) {
          const t = kit.tokens ?? {};
          setKitId(kit.id);
          setName(kit.name);
          setPrimary(t.colors?.primary ?? '#8B5CF6');
          setSecondary(t.colors?.secondary ?? '#F5E6DC');
          setAccent(t.colors?.accent ?? '#C9A227');
          setFont(t.fonts?.heading ?? 'Inter');
          setTone((t.tone ?? []).join(', '));
          setLogoUrl(t.logos?.light ?? '');
          setGuidelines(kit.guidelines_text ?? '');
        }
      } catch {
        toast.error('Could not load the brand kit.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo must be under 2MB');
      return;
    }
    setUploading(true);
    try {
      const url = await bk.uploadLogo(file, user.id);
      setLogoUrl(url);
      toast.success('Logo uploaded');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDoc = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setParsing(true);
    try {
      const text = await bk.extractGuidelinesText(file);
      if (text.length < 50) {
        toast.error('Very little text found. Is this a scanned document?');
      }
      setGuidelines(text);
      setSourceFile(file.name);
      toast.success(`Extracted ${text.length} characters from ${file.name}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not read that file');
    } finally {
      setParsing(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) { toast.error('Brand name is required'); return; }

    setSaving(true);
    try {
      const tokens: BrandTokens = {
        colors: { primary, secondary, accent },
        fonts: { heading: font, body: font },
        logos: logoUrl ? { light: logoUrl } : {},
        tone: tone.split(',').map((s) => s.trim()).filter(Boolean),
      };

      const saved = await bk.saveBrandKit({
        id: kitId, name, tokens, guidelines_text: guidelines,
      });
      setKitId(saved.id);

      // Guidelines drive retrieval, so the vectors must follow the text.
      if (guidelines.trim().length > 50) {
        toast.loading('Indexing guidelines…', { id: 'reindex' });
        await bk.reindexBrandKit(saved.id, guidelines);
        toast.success('Brand kit saved and indexed', { id: 'reindex' });
      } else {
        toast.success('Brand kit saved');
      }

      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (!can.brandKit) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-[#6B7280]">Brand kits are available on team plans.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center space-x-2 text-[#6B7280]">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Loading brand kit…</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2D1B69]">Brand Kit Engine</h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Define colours, typography, tone, and guidelines. Saved guidelines are
            indexed so generation can recall them.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold rounded-2xl shadow-lg shadow-purple-500/25 flex items-center space-x-2 disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving…' : 'Save Brand Kit'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#E9D5FF] space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#2D1B69] mb-1">Brand Organization Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs text-[#2D1B69] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2D1B69] mb-1">Official Brand Logo</label>
            <div className="flex items-center space-x-3 p-3 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF]">
              {logoUrl ? (
                <img src={logoUrl} alt="Brand logo" className="w-10 h-10 object-contain rounded-lg bg-white" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-[#E9D5FF] flex items-center justify-center">
                  <Palette className="w-4 h-4 text-[#8B5CF6]" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#2D1B69] truncate">
                  {logoUrl ? 'Logo uploaded' : 'No logo yet'}
                </p>
                <p className="text-[10px] text-[#6B7280]">SVG, PNG or JPG. Max 2MB.</p>
              </div>
              <input ref={logoInput} type="file" accept="image/*" onChange={handleLogo} className="hidden" />
              <button
                onClick={() => logoInput.current?.click()}
                disabled={uploading}
                className="px-3 py-2 text-[11px] font-bold text-[#8B5CF6] bg-[#F3F0FF] rounded-xl hover:bg-[#E9D5FF] disabled:opacity-60"
              >
                {uploading ? 'Uploading…' : 'Upload'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {([['Primary', primary, setPrimary],
               ['Secondary', secondary, setSecondary],
               ['Accent', accent, setAccent]] as const).map(([label, value, setter]) => (
              <div key={label}>
                <label className="block text-[11px] font-semibold text-[#2D1B69] mb-1">{label}</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    className="w-9 h-9 rounded-lg border border-[#E9D5FF] cursor-pointer"
                  />
                  <input
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-[#E9D5FF] bg-[#F8F7FF] text-[11px] font-mono text-[#2D1B69]"
                  />
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2D1B69] mb-1">Primary Typography</label>
            <select
              value={font}
              onChange={(e) => setFont(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs text-[#2D1B69]"
            >
              {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2D1B69] mb-1">Brand Tone &amp; Persona</label>
            <input
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              placeholder="clear, practical, warm"
              className="w-full px-4 py-2.5 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs text-[#2D1B69]"
            />
            <p className="text-[10px] text-[#6B7280] mt-1">Comma separated.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E9D5FF] space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#2D1B69]">Brand Guidelines &amp; Constraints</label>
            <input
              ref={docInput}
              type="file"
              accept=".txt,.md,.pdf,.docx"
              onChange={handleDoc}
              className="hidden"
            />
            <button
              onClick={() => docInput.current?.click()}
              disabled={parsing}
              className="px-3 py-2 text-[11px] font-bold text-[#8B5CF6] bg-[#F3F0FF] rounded-xl hover:bg-[#E9D5FF] flex items-center space-x-1.5 disabled:opacity-60"
            >
              {parsing
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Upload className="w-3.5 h-3.5" />}
              <span>{parsing ? 'Reading…' : 'Upload document'}</span>
            </button>
          </div>

          {sourceFile && (
            <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-[#F8F7FF] border border-[#E9D5FF]">
              <FileText className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span className="text-[11px] text-[#2D1B69] truncate">{sourceFile}</span>
              <Check className="w-3.5 h-3.5 text-green-600 ml-auto" />
            </div>
          )}

          <textarea
            value={guidelines}
            onChange={(e) => setGuidelines(e.target.value)}
            rows={16}
            placeholder="Upload a document, or write your guidelines here. Be specific — these rules are what generation recalls."
            className="w-full px-4 py-3 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs text-[#2D1B69] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] resize-none"
          />

          <div className="flex items-center justify-between text-[10px] text-[#6B7280]">
            <span>{guidelines.length} characters</span>
            <span>{guidelines.length > 50 ? 'Will be indexed on save' : 'Too short to index'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};