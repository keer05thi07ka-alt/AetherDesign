import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FolderKanban,
  Megaphone,
  Clock,
  Download,
  Plus,
  UploadCloud,
  UserPlus,
  Wand2,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockActivities } from '../../data/mockData';

export const BusinessDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { campaigns, approvals, generatedAssets, brandKit } = useApp();

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'pending').length;
  const activeCampaignsCount = campaigns.filter((c) => c.status === 'Active' || c.status === 'Under Review').length;

  const stats = [
    { title: 'Total Projects', value: campaigns.length.toString(), change: '0 vs last month', icon: FolderKanban, color: '#8B5CF6' },
    { title: 'Active Campaigns', value: activeCampaignsCount.toString(), change: '0 vs last month', icon: Megaphone, color: '#9333EA' },
    { title: 'Pending Reviews', value: pendingApprovalsCount.toString(), change: '0 vs last month', icon: Clock, color: '#F59E0B' },
    { title: 'Asset Downloads', value: generatedAssets.length.toString(), change: '0 vs last month', icon: Download, color: '#10B981' },
  ];

  return (
    <div className="space-y-8 text-left">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#8B5CF6] via-[#9333EA] to-[#7C3AED] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-purple-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Business Governance Mode</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back to Business Workspace!
          </h1>
          <p className="text-xs text-purple-100 max-w-xl leading-relaxed">
            Your current Brand Kit <span className="underline font-bold">{brandKit.name}</span> is active across all campaigns. You have {pendingApprovalsCount} pending creator designs awaiting approval.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0 relative z-10">
          <button
            onClick={() => navigate('/business/campaigns/create')}
            className="flex items-center space-x-2 bg-white text-[#8B5CF6] hover:bg-purple-50 font-bold px-5 py-3 rounded-2xl text-xs shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Campaign</span>
          </button>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((st, i) => {
          const Icon = st.icon;
          return (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl p-5 border border-[#E9D5FF] shadow-lavender-sm hover:shadow-lavender-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#6B7280]">{st.title}</span>
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md"
                  style={{ backgroundColor: st.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4">
                <div className="text-2xl font-extrabold text-[#2D1B69]">{st.value}</div>
                <div className="flex items-center space-x-1.5 mt-1 text-[11px] font-semibold text-[#8B5CF6]">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{st.change} vs last month</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions Grid */}
      <div className="bg-white rounded-3xl p-6 border border-[#E9D5FF] shadow-lavender-sm">
        <h3 className="font-bold text-sm text-[#2D1B69] mb-4">Quick Governance Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <button
            onClick={() => navigate('/business/campaigns/create')}
            className="p-4 rounded-2xl bg-[#F8F7FF] border border-[#E9D5FF] hover:bg-[#F3F0FF] hover:border-[#8B5CF6] transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#8B5CF6] text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform">
              <Megaphone className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-[#2D1B69]">Create Campaign</p>
            <p className="text-[10px] text-[#6B7280] mt-0.5">3-step AI launch wizard</p>
          </button>

          <button
            onClick={() => navigate('/business/brand-kit')}
            className="p-4 rounded-2xl bg-[#F8F7FF] border border-[#E9D5FF] hover:bg-[#F3F0FF] hover:border-[#8B5CF6] transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#9333EA] text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform">
              <UploadCloud className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-[#2D1B69]">Upload Brand Kit</p>
            <p className="text-[10px] text-[#6B7280] mt-0.5">Colors, logo & fonts</p>
          </button>

          <button
            onClick={() => navigate('/business/approvals')}
            className="p-4 rounded-2xl bg-[#F8F7FF] border border-[#E9D5FF] hover:bg-[#F3F0FF] hover:border-[#8B5CF6] transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F59E0B] text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform">
              <UserPlus className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-[#2D1B69]">Review Submissions</p>
            <p className="text-[10px] text-[#6B7280] mt-0.5">{pendingApprovalsCount} pending review</p>
          </button>

          <button
            onClick={() => navigate('/creator/generator')}
            className="p-4 rounded-2xl bg-[#F8F7FF] border border-[#E9D5FF] hover:bg-[#F3F0FF] hover:border-[#8B5CF6] transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#10B981] text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform">
              <Wand2 className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-[#2D1B69]">AI Quick Generator</p>
            <p className="text-[10px] text-[#6B7280] mt-0.5">Prompt visual assets</p>
          </button>

        </div>
      </div>

      {/* Main Split Grid: Recent Campaigns & Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Recent Campaigns */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#E9D5FF] shadow-lavender-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-sm text-[#2D1B69]">Active Brand Campaigns</h3>
                <p className="text-xs text-[#6B7280]">Live multi-channel creative projects</p>
              </div>
              <Link to="/business/campaigns" className="text-xs text-[#8B5CF6] font-bold hover:underline flex items-center gap-1">
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {campaigns.length === 0 ? (
              <div className="p-8 text-center bg-[#F8F7FF] rounded-2xl border border-[#E9D5FF] space-y-2">
                <p className="text-xs font-bold text-[#2D1B69]">No Active Campaigns</p>
                <p className="text-[11px] text-[#6B7280]">Launch your first marketing campaign to begin generating visual assets.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {campaigns.slice(0, 3).map((camp) => (
                  <div key={camp.id} className="p-4 rounded-2xl bg-[#F8F7FF] border border-[#E9D5FF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-xs text-[#2D1B69]">{camp.name}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E9D5FF] text-[#2D1B69]">
                          {camp.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6B7280]">{camp.platform} • {camp.assetsCount} assets</p>
                      
                      <div className="flex items-center space-x-2 text-[10px] text-[#6B7280] pt-1">
                        <img src={camp.assignedCreator.avatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                        <span>{camp.assignedCreator.name} ({camp.assignedCreator.role})</span>
                      </div>
                    </div>

                    <div className="sm:w-36 space-y-1.5 shrink-0">
                      <div className="flex justify-between text-[11px] font-semibold text-[#2D1B69]">
                        <span>Progress</span>
                        <span>{camp.progress}%</span>
                      </div>
                      <div className="w-full bg-[#E9D5FF] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#8B5CF6] h-full rounded-full" style={{ width: `${camp.progress}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-[#F3F0FF]">
            <Link
              to="/business/campaigns/create"
              className="w-full py-2.5 bg-[#F3F0FF] hover:bg-[#8B5CF6] hover:text-white text-[#8B5CF6] font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Launch New Campaign</span>
            </Link>
          </div>
        </div>

        {/* Right 5 Cols: Activity Timeline */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#E9D5FF] shadow-lavender-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-sm text-[#2D1B69]">Activity Timeline</h3>
            <span className="text-[11px] text-[#8B5CF6] font-semibold">Real-time</span>
          </div>

          {mockActivities.length === 0 ? (
            <div className="p-8 text-center bg-[#F8F7FF] rounded-2xl border border-[#E9D5FF] space-y-1">
              <p className="text-xs font-bold text-[#2D1B69]">No Recent Activity</p>
              <p className="text-[11px] text-[#6B7280]">Campaign and approval updates will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {mockActivities.map((act) => (
                <div key={act.id} className="flex items-start space-x-3 text-xs">
                  <div className="w-7 h-7 rounded-xl bg-[#F3F0FF] text-[#8B5CF6] flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p className="text-[#2D1B69] font-medium leading-relaxed">
                      <span className="font-bold text-[#8B5CF6]">{act.user}</span> {act.action} <span className="font-bold">{act.target}</span>.
                    </p>
                    <p className="text-[10px] text-gray-400">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-[#F3F0FF] to-[#EDE9FE] border border-[#E9D5FF] text-left space-y-2">
            <div className="flex items-center space-x-2 text-[#8B5CF6] font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>Brand Kit Compliant</span>
            </div>
            <p className="text-[11px] text-[#6B7280] leading-snug">
              Active Brand Kit guidelines applied automatically to all generated assets.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
