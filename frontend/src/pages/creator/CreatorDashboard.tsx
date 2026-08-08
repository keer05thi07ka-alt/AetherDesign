import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Wand2, Grid, FolderKanban, Edit3, Flame } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockTemplates } from '../../data/mockData';

export const CreatorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, campaigns, generatedAssets, can } = useApp();

  return (
    <div className="space-y-8 text-left">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#8B5CF6] via-[#9333EA] to-[#7C3AED] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-purple-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <span className="inline-flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Creator Studio Workspace</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user.name}! 🎨
          </h1>
          <p className="text-xs text-purple-100 max-w-xl leading-relaxed">
            Ready to turn concepts into high-converting visual collateral? You have {campaigns.length} assigned client campaigns waiting for your creative touch.
          </p>
        </div>

        <button
          onClick={() => navigate('/creator/generator')}
          className="flex items-center space-x-2 bg-white text-[#8B5CF6] hover:bg-purple-50 font-bold px-6 py-3 rounded-2xl text-xs shadow-lg transition-all shrink-0 relative z-10"
        >
          <Wand2 className="w-4 h-4" />
          <span>Quick AI Generator</span>
        </button>
      </div>

      {/* Quick Creator Navigation Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <button
          onClick={() => navigate('/creator/generator')}
          className="p-4 rounded-3xl bg-white border border-[#E9D5FF] shadow-lavender-sm hover:shadow-lavender-md transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#8B5CF6] text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform">
            <Wand2 className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-xs text-[#2D1B69]">AI Generator</h4>
          <p className="text-[10px] text-[#6B7280] mt-0.5">Prompt & 3D render</p>
        </button>

        <button
          onClick={() => navigate('/creator/templates')}
          className="p-4 rounded-3xl bg-white border border-[#E9D5FF] shadow-lavender-sm hover:shadow-lavender-md transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#9333EA] text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform">
            <Grid className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-xs text-[#2D1B69]">Template Library</h4>
          <p className="text-[10px] text-[#6B7280] mt-0.5">Explore 10k+ layouts</p>
        </button>

        <button
          onClick={() => navigate('/creator/editor')}
          className="p-4 rounded-3xl bg-white border border-[#E9D5FF] shadow-lavender-sm hover:shadow-lavender-md transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#F59E0B] text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform">
            <Edit3 className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-xs text-[#2D1B69]">Canva Canvas</h4>
          <p className="text-[10px] text-[#6B7280] mt-0.5">Full graphic editor</p>
        </button>

        <button
          onClick={() => navigate('/creator/assets')}
          className="p-4 rounded-3xl bg-white border border-[#E9D5FF] shadow-lavender-sm hover:shadow-lavender-md transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#10B981] text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform">
            <FolderKanban className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-xs text-[#2D1B69]">Asset Vault</h4>
          <p className="text-[10px] text-[#6B7280] mt-0.5">Stored deliverables</p>
        </button>

      </div>

      {/* Main Grid: Assigned Campaigns & Recent Assets */}
      <div className={`grid grid-cols-1 gap-6 ${can.campaigns ? 'lg:grid-cols-12' : ''}`}>
        
        {/* Assigned Client Campaigns — team plans only */}
        {can.campaigns && (
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#E9D5FF] shadow-lavender-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#2D1B69]">Assigned Client Campaigns</h3>
              <p className="text-xs text-[#6B7280]">Projects requesting asset customization</p>
            </div>
            <span className="text-xs bg-[#F3F0FF] text-[#8B5CF6] font-bold px-2.5 py-0.5 rounded-full">
              {campaigns.length} Active
            </span>
          </div>

          {campaigns.length === 0 ? (
            <div className="p-8 text-center bg-[#F8F7FF] rounded-2xl border border-[#E9D5FF] space-y-1">
              <p className="text-xs font-bold text-[#2D1B69]">No Assigned Campaigns</p>
              <p className="text-[11px] text-[#6B7280]">Assigned brand campaigns requesting visual assets will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {campaigns.slice(0, 3).map((camp) => (
                <div key={camp.id} className="p-4 rounded-2xl bg-[#F8F7FF] border border-[#E9D5FF] flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-xs text-[#2D1B69]">{camp.name}</h4>
                    <p className="text-[11px] text-[#6B7280]">{camp.platform} • Due {camp.deadline}</p>
                  </div>
                  <button
                    onClick={() => navigate('/creator/generator')}
                    className="px-3.5 py-2 bg-[#8B5CF6] text-white font-bold text-xs rounded-xl hover:bg-[#7C3AED] shadow-sm flex items-center gap-1 shrink-0"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Generate</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        )}

        {/* Recent Generated AI Assets */}
        <div className={`bg-white p-6 rounded-3xl border border-[#E9D5FF] shadow-lavender-sm space-y-4 ${can.campaigns ? 'lg:col-span-5' : ''}`}>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#2D1B69]">Recent Generated Assets</h3>
            <Link to="/creator/assets" className="text-xs text-[#8B5CF6] font-bold hover:underline">
              View All
            </Link>
          </div>

          {generatedAssets.length === 0 ? (
            <div className="p-8 text-center bg-[#F8F7FF] rounded-2xl border border-[#E9D5FF] space-y-1">
              <p className="text-xs font-bold text-[#2D1B69]">No Renders Yet</p>
              <p className="text-[11px] text-[#6B7280]">Generated visual assets will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {generatedAssets.slice(0, 4).map((asset) => (
                <div key={asset.id} className="relative rounded-2xl overflow-hidden border border-[#E9D5FF] aspect-square group">
                  <img src={asset.imageUrl} alt={asset.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B69]/80 via-transparent to-transparent p-2 flex flex-col justify-end text-white">
                    <span className="text-[9px] font-bold truncate">{asset.title}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Trending Templates Carousel / Section */}
      <div className="bg-white p-6 rounded-3xl border border-[#E9D5FF] shadow-lavender-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-[#8B5CF6]" />
            <h3 className="font-bold text-sm text-[#2D1B69]">AI Design Templates</h3>
          </div>
          <Link to="/creator/templates" className="text-xs text-[#8B5CF6] font-bold hover:underline">
            Explore All Templates
          </Link>
        </div>

        {mockTemplates.filter((t) => t.isTrending).length === 0 ? (
          <div className="p-8 text-center bg-[#F8F7FF] rounded-2xl border border-[#E9D5FF] space-y-1">
            <p className="text-xs font-bold text-[#2D1B69]">No Templates Created</p>
            <p className="text-[11px] text-[#6B7280]">Custom responsive design templates will be listed here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockTemplates.filter((t) => t.isTrending).slice(0, 4).map((tpl) => (
              <div key={tpl.id} className="rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] overflow-hidden group">
                <div className="relative aspect-video overflow-hidden">
                  <img src={tpl.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-3">
                  <p className="font-bold text-xs text-[#2D1B69] truncate">{tpl.title}</p>
                  <div className="flex items-center justify-between text-[10px] text-[#6B7280] mt-1">
                    <span>{tpl.category}</span>
                    <span className="text-[#8B5CF6] font-bold">{tpl.downloads} downloads</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
