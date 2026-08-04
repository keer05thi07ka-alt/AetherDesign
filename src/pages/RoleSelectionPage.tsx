import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Palette,
  Megaphone,
  UploadCloud,
  Users,
  BarChart3,
  CheckCircle2,
  Wand2,
  Sliders,
  FolderKanban,
  MessageSquare,
  ArrowRight,
  Sparkles,
} from 'lucide-react';


export const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const handleSelectBusiness = () => {
    navigate('/login/business');
  };

  const handleSelectCreator = () => {
    navigate('/login/creator');
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-lavender-bg py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="max-w-5xl w-full mx-auto text-center space-y-10">
        
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <span className="inline-flex items-center space-x-2 bg-white border border-[#E9D5FF] text-[#8B5CF6] text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Select Your Tailored Environment</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2D1B69] tracking-tight">
            Choose Your Workspace
          </h1>
          <p className="text-sm text-[#6B7280] max-w-xl mx-auto leading-relaxed">
            AetherDesign AI supports two dedicated role-based portals designed specifically for brand leaders and visual creators.
          </p>
        </motion.div>

        {/* Dual Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
          
          {/* Business Workspace Card */}
          <motion.div
            whileHover={{ y: -6 }}
            className="bg-white rounded-[24px] p-8 border border-[#E9D5FF] shadow-lavender-md hover:shadow-lavender-lg transition-all flex flex-col justify-between group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F3F0FF] rounded-bl-full -z-0 pointer-events-none group-hover:scale-110 transition-transform" />

            <div className="relative z-10 space-y-6">
              
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] to-[#A78BFA] text-white flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Briefcase className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#8B5CF6] uppercase tracking-wider bg-[#F3F0FF] px-2.5 py-1 rounded-md">
                  For Teams & Brand Managers
                </span>
                <h3 className="text-2xl font-bold text-[#2D1B69] mt-2">
                  Business Workspace
                </h3>
                <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">
                  Oversee multi-channel creative campaigns, maintain brand guidelines, manage creator talent, and approve marketing assets.
                </p>
              </div>

              {/* Feature Checklist */}
              <ul className="space-y-3 pt-2 text-xs text-[#2D1B69] font-medium border-t border-[#F3F0FF]">
                <li className="flex items-center space-x-2.5">
                  <Megaphone className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                  <span>Manage end-to-end campaigns</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <UploadCloud className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                  <span>Upload & lock brand assets & guidelines</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Users className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                  <span>Assign in-house creators & agency talent</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <BarChart3 className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                  <span>Monitor real-time campaign analytics</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                  <span>Review & approve design submissions</span>
                </li>
              </ul>

            </div>

            <button
              onClick={handleSelectBusiness}
              className="mt-8 w-full py-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold rounded-2xl shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center space-x-2 group-hover:scale-[1.02]"
            >
              <span>Enter Business Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Creator Workspace Card */}
          <motion.div
            whileHover={{ y: -6 }}
            className="bg-white rounded-[24px] p-8 border border-[#E9D5FF] shadow-lavender-md hover:shadow-lavender-lg transition-all flex flex-col justify-between group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F3F0FF] rounded-bl-full -z-0 pointer-events-none group-hover:scale-110 transition-transform" />

            <div className="relative z-10 space-y-6">
              
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] to-[#C4B5FD] text-white flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Palette className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#8B5CF6] uppercase tracking-wider bg-[#F3F0FF] px-2.5 py-1 rounded-md">
                  For Designers & Content Creators
                </span>
                <h3 className="text-2xl font-bold text-[#2D1B69] mt-2">
                  Creator Workspace
                </h3>
                <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">
                  Generate AI visual assets, fine-tune designs with Canva-style canvas tools, manage template libraries, and collaborate with clients.
                </p>
              </div>

              {/* Feature Checklist */}
              <ul className="space-y-3 pt-2 text-xs text-[#2D1B69] font-medium border-t border-[#F3F0FF]">
                <li className="flex items-center space-x-2.5">
                  <Wand2 className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                  <span>Generate high-res AI visual content</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Sliders className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                  <span>Customize assets in Canva-style canvas</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <FolderKanban className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                  <span>Manage asset vault & template projects</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <MessageSquare className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                  <span>Collaborate directly with client brands</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Sparkles className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                  <span>Export 4K ready graphics & vector files</span>
                </li>
              </ul>

            </div>

            <button
              onClick={handleSelectCreator}
              className="mt-8 w-full py-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold rounded-2xl shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center space-x-2 group-hover:scale-[1.02]"
            >
              <span>Enter Creator Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

        </div>

      </div>
    </div>
  );
};
