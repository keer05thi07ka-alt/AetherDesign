import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Palette, Wand2, Download, Heart, CheckCircle, Zap } from 'lucide-react';

export const AnimatedDashboardIllustration: React.FC = () => {
  const [generationStep, setGenerationStep] = useState(0);

  const prompts = [
    'Creating hyper-realistic 3D floating glass particles with #8B5CF6 glow...',
    'Applying Nexus Brand Kit color palette & Poppins typography...',
    'Optimizing for Instagram 1080x1080 & Linkedin High-Res Banner...',
    'AI Generation Complete! 4 High-Res Assets Ready for Approval.',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setGenerationStep((prev) => (prev + 1) % prompts.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      
      {/* Outer Glow Backdrop */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#8B5CF6] via-[#C4B5FD] to-[#A78BFA] rounded-[28px] blur-xl opacity-40 animate-pulse pointer-events-none" />

      {/* Main Glassmorphic Dashboard Window */}
      <div className="relative bg-white/90 backdrop-blur-xl border border-[#E9D5FF] rounded-[24px] shadow-2xl p-5 sm:p-6 text-left overflow-hidden">
        
        {/* Window Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F3F0FF]">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-purple-400" />
            <div className="w-3 h-3 rounded-full bg-purple-300" />
            <div className="w-3 h-3 rounded-full bg-purple-200" />
            <span className="text-xs font-semibold text-[#2D1B69] ml-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
              Aether AI Studio v2.6
            </span>
          </div>

          <span className="bg-[#F3F0FF] text-[#8B5CF6] text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Zap className="w-3 h-3 fill-current" />
            Live Render Engine
          </span>
        </div>

        {/* Live Prompt Progress Bar */}
        <div className="my-4 bg-[#F8F7FF] border border-[#E9D5FF] rounded-2xl p-3.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-[#2D1B69] flex items-center gap-1.5">
              <Wand2 className="w-4 h-4 text-[#8B5CF6] animate-spin" style={{ animationDuration: '4s' }} />
              AI Prompt Pipeline
            </span>
            <span className="text-[#8B5CF6] font-bold text-[11px]">
              {generationStep === 3 ? '100%' : `${(generationStep + 1) * 25}%`}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={generationStep}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-xs text-[#6B7280] font-mono truncate"
            >
              {prompts[generationStep]}
            </motion.p>
          </AnimatePresence>

          <div className="w-full bg-[#E9D5FF] h-1.5 rounded-full mt-2.5 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-[#8B5CF6] to-[#C4B5FD] h-full rounded-full"
              animate={{ width: `${(generationStep + 1) * 25}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Main Workspace Interactive Card View */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
          
          {/* Main Visual Render Frame */}
          <div className="relative group rounded-2xl overflow-hidden border border-[#E9D5FF] bg-gradient-to-br from-[#F3F0FF] to-[#EDE9FE] aspect-square flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
              alt="AI Render"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B69]/80 via-transparent to-transparent p-3 flex flex-col justify-end text-white">
              <span className="text-[10px] font-bold bg-[#8B5CF6] px-2 py-0.5 rounded-full w-fit mb-1">
                Generated Asset #01
              </span>
              <p className="text-xs font-medium truncate">Futuristic Glass Particle Poster</p>
            </div>

            {/* Quick Floating Badge */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="absolute top-2 right-2 bg-white/90 backdrop-blur-md p-1.5 rounded-xl shadow-md border border-[#E9D5FF]"
            >
              <Heart className="w-4 h-4 text-[#8B5CF6] fill-current" />
            </motion.div>
          </div>

          {/* Controls & Palette Column */}
          <div className="flex flex-col justify-between space-y-3">
            
            {/* Brand Colors Pill */}
            <div className="p-3 bg-[#F8F7FF] rounded-2xl border border-[#E9D5FF]">
              <div className="flex items-center justify-between text-xs font-semibold text-[#2D1B69] mb-2">
                <span className="flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  Active Brand Palette
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-[#8B5CF6] shadow-sm border border-white" title="#8B5CF6" />
                <div className="w-6 h-6 rounded-full bg-[#C4B5FD] shadow-sm border border-white" title="#C4B5FD" />
                <div className="w-6 h-6 rounded-full bg-[#A78BFA] shadow-sm border border-white" title="#A78BFA" />
                <div className="w-6 h-6 rounded-full bg-[#2D1B69] shadow-sm border border-white" title="#2D1B69" />
                <span className="text-[10px] font-mono text-[#6B7280] ml-1">+ Brand Kit</span>
              </div>
            </div>

            {/* Platform Badges */}
            <div className="p-3 bg-[#F8F7FF] rounded-2xl border border-[#E9D5FF]">
              <span className="text-[11px] font-semibold text-[#2D1B69] block mb-1.5">Auto-Format Exports</span>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] bg-white border border-[#E9D5FF] text-[#2D1B69] font-medium px-2 py-1 rounded-lg">
                  Instagram (1:1)
                </span>
                <span className="text-[10px] bg-white border border-[#E9D5FF] text-[#2D1B69] font-medium px-2 py-1 rounded-lg">
                  LinkedIn Header
                </span>
                <span className="text-[10px] bg-white border border-[#E9D5FF] text-[#2D1B69] font-medium px-2 py-1 rounded-lg">
                  HD Poster
                </span>
              </div>
            </div>

            {/* Action Trigger */}
            <button className="w-full bg-[#8B5CF6] text-white py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center space-x-2 shadow-md shadow-purple-500/20 hover:bg-[#7C3AED] transition-colors">
              <Download className="w-3.5 h-3.5" />
              <span>Export Asset Bundle</span>
            </button>

          </div>

        </div>

        {/* Bottom Live Metrics */}
        <div className="pt-3 border-t border-[#F3F0FF] flex items-center justify-between text-xs text-[#6B7280]">
          <span className="flex items-center gap-1 font-medium text-[#2D1B69]">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            Brand Compliance: 100%
          </span>
          <span className="font-mono text-[11px] text-[#8B5CF6]">Latency: 1.2s</span>
        </div>

      </div>

      {/* Floating Widget 1: Creator Assignment Card */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        className="absolute -bottom-6 -left-6 bg-white border border-[#E9D5FF] rounded-2xl p-3 shadow-xl flex items-center space-x-3 hidden sm:flex"
      >
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
          alt="Creator"
          className="w-9 h-9 rounded-xl object-cover border border-[#C4B5FD]"
        />
        <div>
          <p className="text-xs font-bold text-[#2D1B69]">Elena Rostova</p>
          <p className="text-[10px] text-[#8B5CF6] font-medium">Assigned Creator • Ready for Approval</p>
        </div>
      </motion.div>

      {/* Floating Widget 2: Speed Badge */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
        className="absolute -top-4 -right-4 bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] text-white rounded-2xl px-4 py-2 shadow-lg flex items-center space-x-2 text-xs font-bold hidden sm:flex"
      >
        <Sparkles className="w-4 h-4 fill-current" />
        <span>4K AI Resolution Ready</span>
      </motion.div>

    </div>
  );
};
