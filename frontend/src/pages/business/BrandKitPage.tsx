import React, { useState } from 'react';
import { Save, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BrandKitPage: React.FC = () => {
  const { brandKit, updateBrandKit } = useApp();

  const [name, setName] = useState(brandKit.name);
  const [primaryColor, setPrimaryColor] = useState(brandKit.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(brandKit.secondaryColor);
  const [accentColor, setAccentColor] = useState(brandKit.accentColor);
  const [typography, setTypography] = useState(brandKit.typography);
  const [tone, setTone] = useState(brandKit.tone);
  const logoUrl = brandKit.logoUrl;
  const [guidelines, setGuidelines] = useState(brandKit.guidelines);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBrandKit({
      name,
      primaryColor,
      secondaryColor,
      accentColor,
      typography,
      tone,
      logoUrl,
      guidelines,
    });
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2D1B69]">Brand Kit Engine</h1>
          <p className="text-xs text-[#6B7280]">
            Define exact color palettes, typography, tone of voice, and guidelines to lock brand governance across AI outputs.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center space-x-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-6 py-2.5 rounded-2xl text-xs font-bold shadow-lg shadow-purple-500/25 transition-all shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Save Brand Kit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Editor Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E9D5FF] shadow-lavender-sm space-y-6">
          <form onSubmit={handleSave} className="space-y-5">
            
            {/* Brand Name */}
            <div>
              <label className="block text-xs font-bold text-[#2D1B69] mb-1.5">Brand Organization Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs font-semibold text-[#2D1B69] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
              />
            </div>

            {/* Logo Upload Box */}
            <div>
              <label className="block text-xs font-bold text-[#2D1B69] mb-1.5">Official Brand Logo</label>
              <div className="p-4 rounded-2xl bg-[#F8F7FF] border border-[#E9D5FF] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={logoUrl} alt="Logo" className="w-12 h-12 rounded-xl object-cover border border-[#C4B5FD]" />
                  <div>
                    <p className="text-xs font-bold text-[#2D1B69]">Nexus_Vector_Logo.svg</p>
                    <p className="text-[10px] text-[#6B7280]">Primary vector asset locked</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Simulating logo file upload window...')}
                  className="px-4 py-2 bg-white text-[#8B5CF6] font-bold text-xs rounded-xl border border-[#E9D5FF] hover:bg-[#F3F0FF]"
                >
                  Upload New
                </button>
              </div>
            </div>

            {/* Colors Picker Grid */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#2D1B69]">Brand Colors</label>
              <div className="grid grid-cols-3 gap-4">
                
                <div>
                  <span className="text-[10px] text-[#6B7280] font-semibold block mb-1">Primary Color</span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={primaryColor || '#8B5CF6'}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-9 h-9 rounded-xl cursor-pointer border border-[#E9D5FF]"
                    />
                    <span className="text-xs font-mono font-semibold text-[#2D1B69]">{primaryColor || 'Not Set'}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-[#6B7280] font-semibold block mb-1">Secondary Color</span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={secondaryColor || '#C4B5FD'}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-9 h-9 rounded-xl cursor-pointer border border-[#E9D5FF]"
                    />
                    <span className="text-xs font-mono font-semibold text-[#2D1B69]">{secondaryColor || 'Not Set'}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-[#6B7280] font-semibold block mb-1">Accent Color</span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={accentColor || '#A78BFA'}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-9 h-9 rounded-xl cursor-pointer border border-[#E9D5FF]"
                    />
                    <span className="text-xs font-mono font-semibold text-[#2D1B69]">{accentColor || 'Not Set'}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Typography */}
            <div>
              <label className="block text-xs font-bold text-[#2D1B69] mb-1.5">Primary Typography</label>
              <select
                value={typography}
                onChange={(e) => setTypography(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs font-semibold text-[#2D1B69] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
              >
                <option value="Poppins">Poppins (Default)</option>
                <option value="Inter">Inter Sans</option>
                <option value="Roboto">Roboto Professional</option>
                <option value="Outfit">Outfit Modern Display</option>
                <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
              </select>
            </div>

            {/* Tone of Voice */}
            <div>
              <label className="block text-xs font-bold text-[#2D1B69] mb-1.5">Brand Tone & Persona</label>
              <input
                type="text"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs font-semibold text-[#2D1B69] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
              />
            </div>

            {/* Brand Guidelines */}
            <div>
              <label className="block text-xs font-bold text-[#2D1B69] mb-1.5">Brand Guidelines & Constraints</label>
              <textarea
                rows={3}
                value={guidelines}
                onChange={(e) => setGuidelines(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs font-medium text-[#2D1B69] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
              />
            </div>

          </form>
        </div>

        {/* Right 5 Cols: Live Preview Card */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#2D1B69] flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#8B5CF6]" />
              Live Brand Preview Card
            </span>
            <span className="text-[10px] text-[#8B5CF6] font-semibold bg-[#F3F0FF] px-2.5 py-0.5 rounded-full">
              Real-time Render
            </span>
          </div>

          {/* Dynamic Live Preview Card */}
          <div
            className="rounded-3xl p-6 shadow-xl border border-[#E9D5FF] space-y-6 transition-all duration-300 relative overflow-hidden"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            
            {/* Header with Brand Logo */}
            <div className="flex items-center justify-between pb-4 border-b border-[#F3F0FF]">
              <div className="flex items-center space-x-3">
                <img src={logoUrl} alt="" className="w-9 h-9 rounded-xl object-cover border" style={{ borderColor: primaryColor }} />
                <div>
                  <h4 className="font-bold text-sm" style={{ color: '#2D1B69', fontFamily: typography }}>
                    {name}
                  </h4>
                  <span className="text-[10px] text-[#6B7280] block font-mono">{typography} Font</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: primaryColor }}>
                Verified
              </span>
            </div>

            {/* Visual Sample Card inside preview */}
            <div
              className="p-5 rounded-2xl text-white space-y-3 shadow-md"
              style={{
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)`,
                fontFamily: typography,
              }}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                AI Generated Visual Concept
              </span>
              <h3 className="text-lg font-extrabold leading-snug">
                Building the Future of Enterprise AI Intelligence.
              </h3>
              <p className="text-xs opacity-90 leading-relaxed">
                Tone: {tone}
              </p>
              <button
                className="px-4 py-2 bg-white font-bold text-xs rounded-xl shadow-md"
                style={{ color: primaryColor }}
              >
                Sample Brand CTA
              </button>
            </div>

            {/* Color Swatches Grid */}
            <div>
              <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider block mb-2">
                Active Palette Breakdown
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-xl border border-[#E9D5FF] text-center" style={{ backgroundColor: primaryColor }}>
                  <span className="text-[10px] font-mono font-bold text-white shadow-sm">{primaryColor}</span>
                </div>
                <div className="p-2.5 rounded-xl border border-[#E9D5FF] text-center" style={{ backgroundColor: secondaryColor }}>
                  <span className="text-[10px] font-mono font-bold text-[#2D1B69]">{secondaryColor}</span>
                </div>
                <div className="p-2.5 rounded-xl border border-[#E9D5FF] text-center" style={{ backgroundColor: accentColor }}>
                  <span className="text-[10px] font-mono font-bold text-white">{accentColor}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#F8F7FF] rounded-2xl border border-[#E9D5FF] text-[11px] text-[#6B7280]">
              <span className="font-bold text-[#2D1B69]">Guidelines: </span>
              {guidelines}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
