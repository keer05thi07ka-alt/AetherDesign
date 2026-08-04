import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Wand2,
  Upload,
  Sparkles,
  Download,
  Share2,
  Heart,
  Copy,
  RefreshCw,
  Edit3,
  Palette,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AIGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const { generatedAssets, generateAsset, toggleFavoriteAsset, deleteAsset, brandKit } = useApp();

  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [audience, setAudience] = useState('Tech Innovators');
  const [style, setStyle] = useState('3D');
  const [useBrandColors, setUseBrandColors] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const platforms = ['Instagram', 'Facebook', 'LinkedIn', 'Website', 'Poster', 'Presentation'];
  const audiences = ['Tech Innovators', 'B2B Customers', 'High-End Consumers', 'Enterprise Leaders', 'Gen Z Audience'];
  const styles = ['Minimal', 'Luxury', 'Corporate', 'Modern', '3D', 'Illustration'];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPrompt = prompt || `Futuristic ${style} ${platform} promotional graphic matching ${brandKit.name} brand colors`;
    
    setIsGenerating(true);
    setTimeout(() => {
      generateAsset({
        prompt: finalPrompt,
        platform,
        audience,
        style,
      });
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#2D1B69]">AI Visual Asset Studio</h1>
        <p className="text-xs text-[#6B7280]">
          Describe your vision, pick distribution formats & artistic styles, and generate brand-aligned visual collateral.
        </p>
      </div>

      {/* Main Generator Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9D5FF] shadow-lavender-md space-y-6">
        <form onSubmit={handleGenerate} className="space-y-6">
          
          {/* Large Prompt Box */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#2D1B69] flex items-center gap-1.5">
                <Wand2 className="w-4 h-4 text-[#8B5CF6]" />
                Describe Your Visual Asset Prompt
              </label>
              <span className="text-[11px] text-[#8B5CF6] font-semibold">GPT-4 Vision Engine Active</span>
            </div>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Hyper-realistic glowing floating glass particles with soft lavender gradients, modern 3D interface elements, and deep purple typography..."
              className="w-full px-4 py-3.5 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs font-medium text-[#2D1B69] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] leading-relaxed"
            />
          </div>

          {/* Grid Selectors: Image Upload, Platform, Audience, Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Reference Image Upload Box */}
            <div className="p-3.5 rounded-2xl border border-dashed border-[#E9D5FF] bg-[#F8F7FF] flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#8B5CF6] transition-colors">
              <Upload className="w-5 h-5 text-[#8B5CF6] mb-1" />
              <span className="text-xs font-bold text-[#2D1B69]">Upload Reference</span>
              <span className="text-[10px] text-[#6B7280]">Style & composition match</span>
            </div>

            {/* Platform Selector */}
            <div>
              <label className="block text-xs font-bold text-[#2D1B69] mb-1.5">Target Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-3.5 py-3 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs font-semibold text-[#2D1B69] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
              >
                {platforms.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Audience Selector */}
            <div>
              <label className="block text-xs font-bold text-[#2D1B69] mb-1.5">Target Audience</label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full px-3.5 py-3 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs font-semibold text-[#2D1B69] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
              >
                {audiences.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            {/* Style Selector */}
            <div>
              <label className="block text-xs font-bold text-[#2D1B69] mb-1.5">Visual Art Style</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-3.5 py-3 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs font-semibold text-[#2D1B69] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
              >
                {styles.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Color Palette / Brand Kit Toggle */}
          <div className="p-4 rounded-2xl bg-[#F8F7FF] border border-[#E9D5FF] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#8B5CF6] text-white flex items-center justify-center shrink-0">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#2D1B69]">Active Brand Kit Palette: {brandKit.name}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-4 h-4 rounded-full border border-white" style={{ backgroundColor: brandKit.primaryColor }} />
                  <div className="w-4 h-4 rounded-full border border-white" style={{ backgroundColor: brandKit.secondaryColor }} />
                  <div className="w-4 h-4 rounded-full border border-white" style={{ backgroundColor: brandKit.accentColor }} />
                  <span className="text-[10px] text-[#6B7280]">Font: {brandKit.typography}</span>
                </div>
              </div>
            </div>

            <label className="flex items-center space-x-2 text-xs font-bold text-[#2D1B69] cursor-pointer">
              <input
                type="checkbox"
                checked={useBrandColors}
                onChange={(e) => setUseBrandColors(e.target.checked)}
                className="w-4 h-4 text-[#8B5CF6] rounded accent-[#8B5CF6]"
              />
              <span>Enforce Brand Palette</span>
            </label>
          </div>

          {/* Generate CTA Button */}
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-purple-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Rendering High-Res Asset...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Creative Assets</span>
              </>
            )}
          </button>

        </form>
      </div>

      {/* Generated Assets Gallery Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#2D1B69]">Generated Asset Gallery ({generatedAssets.length})</h2>
          <span className="text-xs text-[#8B5CF6] font-semibold">Instant 4K Export Ready</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {generatedAssets.map((asset) => (
            <motion.div
              key={asset.id}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl border border-[#E9D5FF] shadow-lavender-sm hover:shadow-lavender-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                
                {/* Preview Image */}
                <div className="relative aspect-video bg-[#F3F0FF] overflow-hidden group">
                  <img
                    src={asset.imageUrl}
                    alt={asset.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavoriteAsset(asset.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md rounded-xl shadow-md text-[#8B5CF6] hover:scale-110 transition-transform"
                  >
                    <Heart className={`w-4 h-4 ${asset.isFavorite ? 'fill-current' : ''}`} />
                  </button>

                  <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded-md">
                    {asset.dimensions}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B5CF6] bg-[#F3F0FF] px-2 py-0.5 rounded">
                      {asset.platform}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D1B69] bg-[#E9D5FF] px-2 py-0.5 rounded">
                      {asset.style}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[#2D1B69]">{asset.title}</h3>
                  <p className="text-xs text-[#6B7280] line-clamp-2 italic">"{asset.prompt}"</p>
                </div>

              </div>

              {/* Card Action Buttons Bar */}
              <div className="p-3 bg-[#F8F7FF] border-t border-[#F3F0FF] grid grid-cols-5 gap-1 text-xs">
                
                <button
                  onClick={() => navigate('/creator/editor')}
                  className="p-2 rounded-xl bg-white border border-[#E9D5FF] text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white transition-colors flex items-center justify-center"
                  title="Edit in Canva Editor"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => alert(`Downloading ${asset.title} in 4K resolution...`)}
                  className="p-2 rounded-xl bg-white border border-[#E9D5FF] text-[#2D1B69] hover:bg-[#F3F0FF] transition-colors flex items-center justify-center"
                  title="Download Asset"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => alert(`Share link copied for ${asset.title}`)}
                  className="p-2 rounded-xl bg-white border border-[#E9D5FF] text-[#2D1B69] hover:bg-[#F3F0FF] transition-colors flex items-center justify-center"
                  title="Share Asset"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => generateAsset({ prompt: asset.prompt, platform: asset.platform, audience: asset.audience, style: asset.style })}
                  className="p-2 rounded-xl bg-white border border-[#E9D5FF] text-[#2D1B69] hover:bg-[#F3F0FF] transition-colors flex items-center justify-center"
                  title="Duplicate / Regenerate"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => deleteAsset(asset.id)}
                  className="p-2 rounded-xl bg-white border border-[#E9D5FF] text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center"
                  title="Delete Asset"
                >
                  ✕
                </button>

              </div>

            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};
