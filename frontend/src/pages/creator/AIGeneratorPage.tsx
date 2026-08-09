import React, { useEffect, useState } from 'react';
import { Sparkles, Loader2, Palette, Check, AlertCircle, Download, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../../context/AppContext';
import * as gen from '../../services/generate.service';
import * as api from '../../lib/apiClient';
import type { Understanding, Source } from '../../services/generate.service';

interface Preset {
  key: string;
  label: string;
  width: number;
  height: number;
  aspect: string;
}

const AUDIENCES = [
  'Small business owners', 'Design professionals', 'Students',
  'Parents', 'Tech innovators', 'General consumers',
];

const STYLES = [
  'editorial photography', 'flat illustration', 'minimal product shot',
  '3D render', 'hand-drawn', 'documentary photography',
];

export const AIGeneratorPage: React.FC = () => {
  const { can, brandKit, user, refresh } = useApp();

  const [presets, setPresets] = useState<Preset[]>([]);
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState('instagram_square');
  const [audience, setAudience] = useState(AUDIENCES[0]);
  const [style, setStyle] = useState(STYLES[0]);
  const [enforcePalette, setEnforcePalette] = useState(true);

  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState('');
  const [understanding, setUnderstanding] = useState<Understanding | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [confident, setConfident] = useState(false);
  const [topSim, setTopSim] = useState<number | null>(null);
  const [imageB64, setImageB64] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const rows = await api.list('platform_presets' as never);
        setPresets(rows as unknown as Preset[]);
      } catch {
        // Non-fatal — fall back to a single sensible default.
        setPresets([{ key: 'instagram_square', label: 'Instagram Post', width: 1080, height: 1080, aspect: '1:1' }]);
      }
    })();
  }, []);

  const active = presets.find((p) => p.key === platform);

  const brandTokens = can.brandKit ? {
    colors: {
      primary: brandKit.primaryColor,
      secondary: brandKit.secondaryColor,
      accent: brandKit.accentColor,
    },
    fonts: { heading: brandKit.typography },
    tone: brandKit.tone.split(',').map((s) => s.trim()).filter(Boolean),
  } : undefined;

  const handleGenerate = async () => {
    if (prompt.trim().length < 8) {
      toast.error('Describe what you want in a little more detail');
      return;
    }

    setBusy(true);
    setSaved(false);
    setImageB64('');
    setUnderstanding(null);
    setStage(can.brandKit ? 'Reading your brand guidelines…' : 'Interpreting your request…');

    try {
      const result = await gen.generate({
        prompt, platform, audience, style,
        enforcePalette: can.brandKit && enforcePalette,
        brandTokens,
      });

      setUnderstanding(result.understanding);
      setSources(result.sources ?? []);
      setConfident(result.confident);
      setTopSim(result.top_similarity);
      setImageB64(result.image);
      setStage('');
      toast.success('Asset generated');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Generation failed');
      setStage('');
    } finally {
      setBusy(false);
    }
  };

  const handleSave = async () => {
    if (!imageB64) return;
    setBusy(true);
    try {
      const url = await gen.uploadGeneratedImage(imageB64, user.id);
      await gen.saveGeneratedAsset({
        title: understanding?.intent?.slice(0, 80) || prompt.slice(0, 80),
        description: understanding?.image_prompt ?? prompt,
        category: platform,
        width: active?.width ?? 1024,
        height: active?.height ?? 1024,
        storagePath: url,
      });
      setSaved(true);
      toast.success('Saved to your asset library');
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not save');
    } finally {
      setBusy(false);
    }
  };

  const download = () => {
    const a = document.createElement('a');
    a.href = `data:image/jpeg;base64,${imageB64}`;
    a.download = `${prompt.slice(0, 40).replace(/\s+/g, '-')}.jpg`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#2D1B69]">AI Visual Asset Studio</h1>
        <p className="text-xs text-[#6B7280] mt-1">
          {can.brandKit
            ? 'Generation is grounded in your brand guidelines.'
            : 'Describe what you want and pick a format.'}
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-[#E9D5FF] space-y-5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[#2D1B69] flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
            <span>Describe your asset</span>
          </label>
          <span className="text-[11px] text-[#8B5CF6] font-semibold">FLUX.1 · Cloudflare Workers AI</span>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          placeholder="e.g. summer sale announcement for our new canvas tote bag"
          className="w-full px-4 py-3 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs text-[#2D1B69] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] resize-none"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-[#2D1B69] mb-1">Target Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs text-[#2D1B69]"
            >
              {presets.map((p) => (
                <option key={p.key} value={p.key}>{p.label} · {p.aspect}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#2D1B69] mb-1">Target Audience</label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs text-[#2D1B69]"
            >
              {AUDIENCES.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#2D1B69] mb-1">Visual Art Style</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs text-[#2D1B69]"
            >
              {STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {can.brandKit && (
          <div className="p-4 rounded-2xl bg-[#F8F7FF] border border-[#E9D5FF] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#8B5CF6] text-white flex items-center justify-center shrink-0">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#2D1B69]">Brand Kit: {brandKit.name}</p>
                <div className="flex items-center space-x-2 mt-1">
                  {[brandKit.primaryColor, brandKit.secondaryColor, brandKit.accentColor].map((c) => (
                    <span key={c} className="w-4 h-4 rounded-full border border-white shadow-sm" style={{ background: c }} />
                  ))}
                  <span className="text-[10px] text-[#6B7280] ml-1">Font: {brandKit.typography}</span>
                </div>
              </div>
            </div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={enforcePalette}
                onChange={(e) => setEnforcePalette(e.target.checked)}
                className="w-4 h-4 accent-[#8B5CF6]"
              />
              <span className="text-xs font-semibold text-[#2D1B69]">Enforce Brand Palette</span>
            </label>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={busy}
          className="w-full py-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-sm font-bold rounded-2xl shadow-lg shadow-purple-500/25 flex items-center justify-center space-x-2 disabled:opacity-60"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>{busy ? (stage || 'Generating…') : 'Generate Creative Asset'}</span>
        </button>
      </div>

      {understanding && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E9D5FF] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#2D1B69]">AI Understanding</h3>
              {can.brandKit && (
                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                  confident ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {confident ? `Grounded · ${topSim}` : 'No strong guideline match'}
                </span>
              )}
            </div>

            <dl className="space-y-2.5">
              {([
                ['Intent', understanding.intent],
                ['Subject', understanding.subject],
                ['Composition', understanding.composition],
                ['Mood', understanding.mood],
              ] as const).map(([label, value]) => value ? (
                <div key={label} className="grid grid-cols-3 gap-2">
                  <dt className="text-[11px] font-semibold text-[#6B7280]">{label}</dt>
                  <dd className="col-span-2 text-[11px] text-[#2D1B69] leading-relaxed">{value}</dd>
                </div>
              ) : null)}

              {understanding.palette?.length ? (
                <div className="grid grid-cols-3 gap-2 items-center">
                  <dt className="text-[11px] font-semibold text-[#6B7280]">Palette</dt>
                  <dd className="col-span-2 flex items-center space-x-1.5">
                    {understanding.palette.map((c) => (
                      <span key={c} className="flex items-center space-x-1">
                        <span className="w-4 h-4 rounded border border-[#E9D5FF]" style={{ background: c }} />
                        <span className="text-[10px] font-mono text-[#6B7280]">{c}</span>
                      </span>
                    ))}
                  </dd>
                </div>
              ) : null}

              {understanding.avoid?.length ? (
                <div className="grid grid-cols-3 gap-2">
                  <dt className="text-[11px] font-semibold text-[#6B7280]">Avoid</dt>
                  <dd className="col-span-2 flex flex-wrap gap-1">
                    {understanding.avoid.map((a) => (
                      <span key={a} className="text-[10px] px-2 py-0.5 rounded-lg bg-red-50 text-red-700">{a}</span>
                    ))}
                  </dd>
                </div>
              ) : null}
            </dl>

            {sources.length > 0 && (
              <div className="pt-3 border-t border-[#F3F0FF]">
                <p className="text-[11px] font-semibold text-[#6B7280] mb-2">
                  Retrieved from your guidelines
                </p>
                <ul className="space-y-1.5">
                  {sources.map((s, i) => (
                    <li key={i} className="text-[10px] text-[#4B5563] leading-relaxed flex items-start">
                      <span className="text-[#8B5CF6] font-mono mr-1.5 shrink-0">{s.similarity}</span>
                      <span>{s.content.slice(0, 130)}…</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {can.brandKit && !confident && (
              <div className="flex items-start space-x-2 p-3 rounded-xl bg-amber-50 text-amber-800">
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <p className="text-[10px] leading-relaxed">
                  Nothing in your guidelines closely matched this request, so generation
                  used your palette and tone but no specific rules.
                </p>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E9D5FF] space-y-4">
            <h3 className="text-sm font-bold text-[#2D1B69]">Result</h3>
            {imageB64 ? (
              <>
                <img
                  src={`data:image/jpeg;base64,${imageB64}`}
                  alt={understanding.subject ?? 'Generated asset'}
                  className="w-full rounded-2xl border border-[#E9D5FF]"
                />
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={busy || saved}
                    className="flex-1 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 disabled:opacity-60"
                  >
                    {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                    <span>{saved ? 'Saved to library' : 'Save to library'}</span>
                  </button>
                  <button
                    onClick={download}
                    className="px-4 py-2.5 border border-[#E9D5FF] text-[#8B5CF6] text-xs font-bold rounded-xl hover:bg-[#F8F7FF]"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            ) : (
              <p className="text-xs text-[#6B7280]">No image returned.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};