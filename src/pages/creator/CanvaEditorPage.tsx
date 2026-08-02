import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Download,
  Share2,
  ArrowLeft,
  Grid,
  Upload,
  Type,
  Smile,
  Square,
  Image as ImageIcon,
  Wand2,
  Layers,
  Sliders,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Eye,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CanvaEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const { brandKit } = useApp();

  const [activeLeftTab, setActiveLeftTab] = useState<'templates' | 'uploads' | 'text' | 'icons' | 'shapes' | 'images' | 'aitools'>('templates');
  const [zoomLevel, setZoomLevel] = useState(100);
  
  // Inspector Controls State
  const [selectedFont, setSelectedFont] = useState('Poppins');
  const [fontSize, setFontSize] = useState(36);
  const [activeColor, setActiveColor] = useState(brandKit.primaryColor);
  const [opacity, setOpacity] = useState(100);
  const [letterSpacing, setLetterSpacing] = useState(2);
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('center');
  const [activeEffect, setActiveEffect] = useState<'none' | 'glow' | 'shadow' | 'glass'>('glow');

  interface NavTabItem {
    id: 'templates' | 'uploads' | 'text' | 'icons' | 'shapes' | 'images' | 'aitools';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    highlight?: boolean;
  }

  const leftNavTabs: NavTabItem[] = [
    { id: 'templates', label: 'Templates', icon: Grid },
    { id: 'uploads', label: 'Uploads', icon: Upload },
    { id: 'text', label: 'Text', icon: Type },
    { id: 'icons', label: 'Icons', icon: Smile },
    { id: 'shapes', label: 'Shapes', icon: Square },
    { id: 'images', label: 'Images', icon: ImageIcon },
    { id: 'aitools', label: 'AI Tools', icon: Wand2, highlight: true },
  ];

  return (
    <div className="h-screen w-screen bg-[#F8F7FF] flex flex-col overflow-hidden text-left selection:bg-[#C4B5FD] selection:text-[#2D1B69]">
      
      {/* TOP TOOLBAR */}
      <header className="h-16 bg-white border-b border-[#E9D5FF] px-4 flex items-center justify-between z-30 shrink-0 shadow-sm">
        
        {/* Left: Back & Title */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/creator/dashboard')}
            className="p-2 rounded-xl text-[#2D1B69] hover:bg-[#F3F0FF] transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5 text-[#8B5CF6]" />
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[#8B5CF6] text-white flex items-center justify-center font-bold text-xs shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-xs text-[#2D1B69]">Summer AI Launch Campaign Graphic</h2>
              <p className="text-[10px] text-[#6B7280]">1920 x 1080 px • Auto-saved to Cloud</p>
            </div>
          </div>
        </div>

        {/* Center Toolbar: Undo, Redo, Zoom */}
        <div className="flex items-center space-x-2 bg-[#F8F7FF] border border-[#E9D5FF] p-1 rounded-2xl">
          <button
            onClick={() => alert('Undo action')}
            className="p-2 rounded-xl text-[#2D1B69] hover:bg-white transition-colors"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => alert('Redo action')}
            className="p-2 rounded-xl text-[#2D1B69] hover:bg-white transition-colors"
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-[#E9D5FF] mx-1" />

          <button
            onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
            className="p-2 rounded-xl text-[#2D1B69] hover:bg-white transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono font-bold text-[#8B5CF6] px-2">
            {zoomLevel}%
          </span>

          <button
            onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
            className="p-2 rounded-xl text-[#2D1B69] hover:bg-white transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Right Actions: Export & Share */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => alert('Copying collaboration share link...')}
            className="flex items-center space-x-1.5 px-4 py-2 bg-[#F3F0FF] text-[#8B5CF6] font-bold text-xs rounded-xl hover:bg-purple-100 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>

          <button
            onClick={() => alert('Exporting 4K High-Res PDF/PNG Bundle...')}
            className="flex items-center space-x-2 px-5 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-xs rounded-xl shadow-md shadow-purple-500/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>

      </header>

      {/* MAIN EDITOR WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT TOOLBAR STRIP */}
        <aside className="w-20 bg-white border-r border-[#E9D5FF] flex flex-col items-center py-4 space-y-3 z-20 shrink-0">
          {leftNavTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeLeftTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveLeftTab(tab.id as any)}
                className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center space-y-1 transition-all group ${
                  isActive
                    ? 'bg-[#8B5CF6] text-white shadow-md shadow-purple-500/20'
                    : 'text-[#6B7280] hover:bg-[#F3F0FF] hover:text-[#8B5CF6]'
                }`}
              >
                <Icon className={`w-5 h-5 ${tab.highlight && !isActive ? 'text-[#8B5CF6]' : ''}`} />
                <span className="text-[10px] font-semibold">{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* LEFT PANEL TOOL DRAWER */}
        <div className="w-72 bg-white border-r border-[#E9D5FF] p-4 z-10 overflow-y-auto shrink-0 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F3F0FF]">
            <h3 className="font-bold text-xs text-[#2D1B69] uppercase tracking-wider capitalize">
              {activeLeftTab} Panel
            </h3>
            <span className="text-[10px] text-[#8B5CF6] font-semibold bg-[#F3F0FF] px-2 py-0.5 rounded">
              Aether Library
            </span>
          </div>

          {activeLeftTab === 'templates' && (
            <div className="space-y-3">
              <p className="text-xs text-[#6B7280]">Select a template layout to apply to canvas:</p>
              <div className="grid grid-cols-2 gap-2.5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-square rounded-xl bg-[#F8F7FF] border border-[#E9D5FF] hover:border-[#8B5CF6] p-1 cursor-pointer overflow-hidden group">
                    <img
                      src={`https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80`}
                      alt=""
                      className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeLeftTab === 'text' && (
            <div className="space-y-3">
              <button className="w-full py-3 bg-[#8B5CF6] text-white font-bold text-xs rounded-2xl shadow-sm">
                + Add Heading
              </button>
              <button className="w-full py-2.5 bg-[#F3F0FF] text-[#2D1B69] font-bold text-xs rounded-xl border border-[#E9D5FF]">
                + Add Subheading
              </button>
              <button className="w-full py-2 bg-[#F8F7FF] text-[#6B7280] font-semibold text-xs rounded-xl border border-[#E9D5FF]">
                + Add Body Text
              </button>
            </div>
          )}

          {activeLeftTab === 'aitools' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-[#F3F0FF] to-[#EDE9FE] border border-[#E9D5FF] text-xs space-y-2">
                <div className="flex items-center space-x-1.5 text-[#8B5CF6] font-bold">
                  <Wand2 className="w-4 h-4" />
                  <span>AI Prompt Enhancer</span>
                </div>
                <p className="text-[11px] text-[#6B7280]">Enhance lighting, remove background, or auto-generate vector shapes.</p>
              </div>

              <button className="w-full py-2.5 bg-white text-[#8B5CF6] border border-[#E9D5FF] font-bold text-xs rounded-xl hover:bg-[#8B5CF6] hover:text-white transition-colors">
                Magic Background Remover
              </button>
              <button className="w-full py-2.5 bg-white text-[#8B5CF6] border border-[#E9D5FF] font-bold text-xs rounded-xl hover:bg-[#8B5CF6] hover:text-white transition-colors">
                Auto Color Palette Harmonizer
              </button>
            </div>
          )}

          {activeLeftTab !== 'templates' && activeLeftTab !== 'text' && activeLeftTab !== 'aitools' && (
            <div className="text-center py-12 text-xs text-[#6B7280]">
              <Grid className="w-8 h-8 text-[#C4B5FD] mx-auto mb-2" />
              <span>Explore assets in the left drawer</span>
            </div>
          )}
        </div>

        {/* CENTER INTERACTIVE CANVAS VIEWPORT */}
        <main className="flex-1 bg-[#F3F0FF] p-6 flex items-center justify-center overflow-auto relative">
          
          {/* Canvas Viewport Frame */}
          <motion.div
            style={{ scale: zoomLevel / 100 }}
            className="w-[800px] h-[450px] bg-white rounded-3xl shadow-2xl border border-[#E9D5FF] relative overflow-hidden flex flex-col justify-between p-8 text-left transition-transform duration-200"
          >
            {/* Background Graphic Element */}
            <div
              className="absolute -right-20 -top-20 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none"
              style={{ backgroundColor: activeColor }}
            />

            {/* Canvas Header Element */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={brandKit.logoUrl} alt="" className="w-10 h-10 rounded-xl object-cover border border-[#C4B5FD]" />
                <div>
                  <h4 className="font-bold text-xs text-[#2D1B69]">{brandKit.name}</h4>
                  <span className="text-[10px] text-[#6B7280]">Official AI Creative Launch</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full text-white" style={{ backgroundColor: activeColor }}>
                2026 EDITION
              </span>
            </div>

            {/* Center Canvas Main Editable Text Block */}
            <div className="relative z-10 my-auto text-center space-y-3 cursor-move border-2 border-dashed border-purple-400/40 p-4 rounded-2xl hover:border-[#8B5CF6] transition-colors">
              <motion.h1
                style={{
                  fontFamily: selectedFont,
                  fontSize: `${fontSize}px`,
                  color: activeColor,
                  opacity: opacity / 100,
                  letterSpacing: `${letterSpacing}px`,
                  textAlign: alignment,
                }}
                className={`font-extrabold leading-tight ${
                  activeEffect === 'glow'
                    ? 'drop-shadow-[0_0_20px_rgba(139,92,246,0.5)]'
                    : activeEffect === 'shadow'
                    ? 'drop-shadow-lg'
                    : ''
                }`}
              >
                Transforming Visuals with AI
              </motion.h1>
              <p className="text-sm text-[#6B7280] max-w-md mx-auto">
                Next-Gen Multi-Channel Asset Engine for Modern Brands & Visual Directors.
              </p>
            </div>

            {/* Canvas Footer Bar */}
            <div className="relative z-10 flex items-center justify-between text-xs text-[#6B7280] pt-4 border-t border-[#F3F0FF]">
              <span>Powered by AetherDesign AI Studio</span>
              <span className="font-mono text-[11px]">Compliance Check: Passed</span>
            </div>

          </motion.div>

        </main>

        {/* RIGHT INSPECTOR / PROPERTIES SIDEBAR */}
        <aside className="w-80 bg-white border-l border-[#E9D5FF] p-5 z-20 shrink-0 overflow-y-auto space-y-6">
          
          <div className="flex items-center justify-between pb-3 border-b border-[#F3F0FF]">
            <h3 className="font-bold text-xs text-[#2D1B69] uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#8B5CF6]" />
              Inspector & Styling
            </h3>
            <span className="text-[10px] text-[#8B5CF6] font-semibold bg-[#F3F0FF] px-2 py-0.5 rounded">
              Text Layer #1
            </span>
          </div>

          {/* Font Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#2D1B69]">Typography Family</label>
            <select
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs font-semibold text-[#2D1B69]"
            >
              <option value="Poppins">Poppins</option>
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Outfit">Outfit</option>
            </select>
          </div>

          {/* Font Size & Spacing Sliders */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold text-[#2D1B69] mb-1">
                <span>Font Size</span>
                <span>{fontSize}px</span>
              </div>
              <input
                type="range"
                min={18}
                max={72}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-[#8B5CF6]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-[#2D1B69] mb-1">
                <span>Letter Spacing</span>
                <span>{letterSpacing}px</span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                value={letterSpacing}
                onChange={(e) => setLetterSpacing(Number(e.target.value))}
                className="w-full accent-[#8B5CF6]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-[#2D1B69] mb-1">
                <span>Opacity</span>
                <span>{opacity}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full accent-[#8B5CF6]"
              />
            </div>
          </div>

          {/* Color Palette Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#2D1B69]">Element Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={activeColor}
                onChange={(e) => setActiveColor(e.target.value)}
                className="w-9 h-9 rounded-xl cursor-pointer border border-[#E9D5FF]"
              />
              <input
                type="text"
                value={activeColor}
                onChange={(e) => setActiveColor(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-[#E9D5FF] text-xs font-mono font-bold text-[#2D1B69]"
              />
            </div>
          </div>

          {/* Text Alignment */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#2D1B69]">Alignment</label>
            <div className="grid grid-cols-3 gap-2 bg-[#F8F7FF] p-1 rounded-xl border border-[#E9D5FF]">
              <button
                onClick={() => setAlignment('left')}
                className={`py-1.5 flex items-center justify-center rounded-lg ${alignment === 'left' ? 'bg-[#8B5CF6] text-white' : 'text-[#6B7280]'}`}
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setAlignment('center')}
                className={`py-1.5 flex items-center justify-center rounded-lg ${alignment === 'center' ? 'bg-[#8B5CF6] text-white' : 'text-[#6B7280]'}`}
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                onClick={() => setAlignment('right')}
                className={`py-1.5 flex items-center justify-center rounded-lg ${alignment === 'right' ? 'bg-[#8B5CF6] text-white' : 'text-[#6B7280]'}`}
              >
                <AlignRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Special Visual Effects */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#2D1B69]">Glow & Shadow Effects</label>
            <div className="grid grid-cols-2 gap-2">
              {['none', 'glow', 'shadow', 'glass'].map((eff) => (
                <button
                  key={eff}
                  onClick={() => setActiveEffect(eff as any)}
                  className={`py-2 rounded-xl text-xs font-bold capitalize border transition-all ${
                    activeEffect === eff
                      ? 'bg-[#8B5CF6] text-white border-[#8B5CF6] shadow-sm'
                      : 'bg-[#F8F7FF] text-[#6B7280] border-[#E9D5FF]'
                  }`}
                >
                  {eff}
                </button>
              ))}
            </div>
          </div>

          {/* Layers List View */}
          <div className="pt-4 border-t border-[#F3F0FF] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#2D1B69]">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#8B5CF6]" />
                Canvas Layers (3)
              </span>
            </div>
            
            <div className="space-y-1.5 text-xs">
              <div className="p-2.5 rounded-xl bg-[#F3F0FF] border border-[#8B5CF6] font-semibold text-[#2D1B69] flex justify-between items-center">
                <span>Text: Headline Title</span>
                <Eye className="w-3.5 h-3.5 text-[#8B5CF6]" />
              </div>
              <div className="p-2.5 rounded-xl bg-[#F8F7FF] border border-[#E9D5FF] text-[#6B7280] flex justify-between items-center">
                <span>Image: Brand Logo</span>
                <Eye className="w-3.5 h-3.5" />
              </div>
              <div className="p-2.5 rounded-xl bg-[#F8F7FF] border border-[#E9D5FF] text-[#6B7280] flex justify-between items-center">
                <span>Shape: Lavender Sphere</span>
                <Eye className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

        </aside>

      </div>

    </div>
  );
};
