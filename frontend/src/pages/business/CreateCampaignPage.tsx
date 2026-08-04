import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft, Upload, Sparkles, Wand2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CreateCampaignPage: React.FC = () => {
  const navigate = useNavigate();
  const { addCampaign, brandKit } = useApp();

  const [step, setStep] = useState(1);

  // Step 1 Form Data
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [audience, setAudience] = useState('');
  const [industry, setIndustry] = useState('Artificial Intelligence / SaaS');
  const [platform, setPlatform] = useState('Instagram & Web Banners');

  // Step 2 Form Data
  const [primaryColor, setPrimaryColor] = useState(brandKit.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(brandKit.secondaryColor);
  const [typography, setTypography] = useState(brandKit.typography);
  const [guidelines, setGuidelines] = useState(brandKit.guidelines);

  // Step 3 Form Data
  const creatorName = 'Elena Rostova';
  const creatorRole = 'Lead Visual Designer';
  const [deadline, setDeadline] = useState('Aug 30, 2026');

  const handleFinish = () => {
    if (!name) {
      alert('Please enter a campaign name');
      return;
    }
    addCampaign({
      name,
      description: description || 'Multi-platform visual campaign launch.',
      audience: audience || 'General Tech Audience',
      industry,
      platform,
      assignedCreator: {
        name: creatorName,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        role: creatorRole,
      },
      deadline,
      status: 'Active' as any,
    });
    navigate('/business/campaigns');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 text-left py-4">
      
      {/* Top Title */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-[#8B5CF6] uppercase tracking-wider bg-[#F3F0FF] px-3 py-1 rounded-full">
            Multi-Step Campaign Wizard
          </span>
          <h1 className="text-2xl font-extrabold text-[#2D1B69] mt-2">Create New Campaign</h1>
        </div>

        <button
          onClick={() => navigate('/business/campaigns')}
          className="text-xs font-semibold text-[#6B7280] hover:text-[#2D1B69]"
        >
          Cancel
        </button>
      </div>

      {/* Stepper Header Bar */}
      <div className="bg-white rounded-3xl p-4 border border-[#E9D5FF] shadow-lavender-sm flex items-center justify-between">
        
        {/* Step 1 Pill */}
        <div className="flex items-center space-x-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              step >= 1 ? 'bg-[#8B5CF6] text-white shadow-md' : 'bg-[#F3F0FF] text-[#6B7280]'
            }`}
          >
            {step > 1 ? <Check className="w-4 h-4" /> : '1'}
          </div>
          <div>
            <p className="text-xs font-bold text-[#2D1B69]">Campaign Details</p>
            <p className="text-[10px] text-[#6B7280]">Goals & Target Platform</p>
          </div>
        </div>

        <div className="flex-1 h-0.5 bg-[#E9D5FF] mx-4" />

        {/* Step 2 Pill */}
        <div className="flex items-center space-x-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              step >= 2 ? 'bg-[#8B5CF6] text-white shadow-md' : 'bg-[#F3F0FF] text-[#6B7280]'
            }`}
          >
            {step > 2 ? <Check className="w-4 h-4" /> : '2'}
          </div>
          <div>
            <p className="text-xs font-bold text-[#2D1B69]">Brand Kit & Assets</p>
            <p className="text-[10px] text-[#6B7280]">Colors & Guidelines</p>
          </div>
        </div>

        <div className="flex-1 h-0.5 bg-[#E9D5FF] mx-4" />

        {/* Step 3 Pill */}
        <div className="flex items-center space-x-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              step >= 3 ? 'bg-[#8B5CF6] text-white shadow-md' : 'bg-[#F3F0FF] text-[#6B7280]'
            }`}
          >
            '3'
          </div>
          <div>
            <p className="text-xs font-bold text-[#2D1B69]">Assign & Trigger</p>
            <p className="text-[10px] text-[#6B7280]">Creator & AI Assets</p>
          </div>
        </div>

      </div>

      {/* Step Content Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9D5FF] shadow-lavender-md min-h-[420px] flex flex-col justify-between">
        
        <AnimatePresence mode="wait">
          
          {/* STEP 1 */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-bold text-[#2D1B69] mb-4">Step 1: Campaign Overview</h3>

              <div>
                <label className="block text-xs font-bold text-[#2D1B69] mb-1">Campaign Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Q4 Global AI Product Launch 2026"
                  className="w-full px-4 py-3 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs font-medium text-[#2D1B69] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D1B69] mb-1">Campaign Objective / Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your campaign strategy and deliverables required..."
                  className="w-full px-4 py-3 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs font-medium text-[#2D1B69] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2D1B69] mb-1">Target Audience</label>
                  <input
                    type="text"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="e.g. Enterprise CMOs & Founders"
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs font-medium text-[#2D1B69] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2D1B69] mb-1">Industry Vertical</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs font-medium text-[#2D1B69] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                  >
                    <option>Artificial Intelligence / SaaS</option>
                    <option>E-commerce & Retail</option>
                    <option>Fintech & Enterprise</option>
                    <option>Healthcare & Biotech</option>
                    <option>Creative Agency</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D1B69] mb-1">Target Distribution Platforms</label>
                <input
                  type="text"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  placeholder="e.g. Instagram Story, LinkedIn Header, HD Posters"
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs font-medium text-[#2D1B69] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                />
              </div>
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-bold text-[#2D1B69] mb-4">Step 2: Brand Kit & Collateral</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Upload Logo Box */}
                <div className="p-4 rounded-2xl border-2 border-dashed border-[#E9D5FF] bg-[#F8F7FF] text-center flex flex-col items-center justify-center space-y-2">
                  <Upload className="w-6 h-6 text-[#8B5CF6]" />
                  <p className="text-xs font-bold text-[#2D1B69]">Upload Brand Logo</p>
                  <p className="text-[10px] text-[#6B7280]">PNG or SVG with transparent background</p>
                </div>

                {/* Upload Product Images */}
                <div className="p-4 rounded-2xl border-2 border-dashed border-[#E9D5FF] bg-[#F8F7FF] text-center flex flex-col items-center justify-center space-y-2">
                  <Upload className="w-6 h-6 text-[#8B5CF6]" />
                  <p className="text-xs font-bold text-[#2D1B69]">Upload Product Shots</p>
                  <p className="text-[10px] text-[#6B7280]">High-res imagery for AI reference</p>
                </div>

              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2D1B69] mb-1">Primary Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer border border-[#E9D5FF]"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-[#E9D5FF] text-xs font-mono text-[#2D1B69]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2D1B69] mb-1">Secondary Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer border border-[#E9D5FF]"
                    />
                    <input
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-[#E9D5FF] text-xs font-mono text-[#2D1B69]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D1B69] mb-1">Brand Typography</label>
                <input
                  type="text"
                  value={typography}
                  onChange={(e) => setTypography(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs font-medium text-[#2D1B69]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D1B69] mb-1">Brand Rules & Guidelines</label>
                <textarea
                  rows={2}
                  value={guidelines}
                  onChange={(e) => setGuidelines(e.target.value)}
                  className="w-full px-4 py-2 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs text-[#2D1B69]"
                />
              </div>
            </motion.div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-bold text-[#2D1B69] mb-4">Step 3: Assign Creator & AI Launch</h3>

              <div>
                <label className="block text-xs font-bold text-[#2D1B69] mb-1.5">Assign Lead Creator</label>
                <div className="p-4 rounded-2xl bg-[#F8F7FF] border border-[#E9D5FF] flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
                      alt=""
                      className="w-10 h-10 rounded-xl object-cover border border-[#C4B5FD]"
                    />
                    <div>
                      <p className="font-bold text-xs text-[#2D1B69]">{creatorName}</p>
                      <p className="text-[10px] text-[#6B7280]">{creatorRole}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-[#8B5CF6] text-white px-2.5 py-1 rounded-full font-bold">
                    Assigned
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D1B69] mb-1">Campaign Target Deadline</label>
                <input
                  type="text"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs font-medium text-[#2D1B69]"
                />
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#F3F0FF] to-[#EDE9FE] border border-[#E9D5FF] space-y-2">
                <div className="flex items-center space-x-2 text-[#8B5CF6] font-bold text-xs">
                  <Wand2 className="w-4 h-4" />
                  <span>AI Initial Batch Render Enabled</span>
                </div>
                <p className="text-xs text-[#6B7280]">
                  Upon clicking launch, AetherDesign AI will automatically render 8 initial visual creative assets matching {primaryColor} brand tokens for {creatorName} to review and customize.
                </p>
              </div>

            </motion.div>
          )}

        </AnimatePresence>

        {/* Wizard Footer Controls */}
        <div className="pt-6 border-t border-[#F3F0FF] flex items-center justify-between mt-6">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl border border-[#E9D5FF] text-xs font-bold text-[#2D1B69] hover:bg-[#F3F0FF] transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              onClick={() => {
                if (!name && step === 1) {
                  alert('Please enter a campaign name first.');
                  return;
                }
                setStep(step + 1);
              }}
              className="flex items-center space-x-2 px-6 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold rounded-2xl shadow-md transition-all"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center space-x-2 px-8 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-extrabold rounded-2xl shadow-xl shadow-purple-500/25 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Campaign & AI Renders</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
