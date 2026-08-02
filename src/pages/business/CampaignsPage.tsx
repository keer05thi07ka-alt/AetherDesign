import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CampaignsPage: React.FC = () => {
  const navigate = useNavigate();
  const { campaigns } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'In Progress' | 'Under Review' | 'Active' | 'Completed'>('All');

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 text-left">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2D1B69]">Marketing Campaigns</h1>
          <p className="text-xs text-[#6B7280]">
            Manage brand projects, track deliverables, and trigger multi-format AI generations.
          </p>
        </div>

        <button
          onClick={() => navigate('/business/campaigns/create')}
          className="flex items-center space-x-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-lg shadow-purple-500/25 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Campaign</span>
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white rounded-3xl p-4 border border-[#E9D5FF] shadow-lavender-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8B5CF6] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search campaigns or industry..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs font-medium text-[#2D1B69] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', 'In Progress', 'Under Review', 'Active', 'Completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterStatus === tab
                  ? 'bg-[#8B5CF6] text-white shadow-sm'
                  : 'bg-[#F8F7FF] text-[#6B7280] hover:text-[#2D1B69]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

      </div>

      {/* Campaigns Grid */}
      {filteredCampaigns.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-[#E9D5FF] text-center space-y-4 max-w-md mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-[#F3F0FF] text-[#8B5CF6] flex items-center justify-center mx-auto border border-[#E9D5FF]">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-[#2D1B69]">No Campaigns Found</h3>
          <p className="text-xs text-[#6B7280]">
            You have no active marketing campaigns. Create your first campaign to generate multi-format AI assets and collaborate with creators.
          </p>
          <button
            onClick={() => navigate('/business/campaigns/create')}
            className="inline-flex items-center space-x-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-lg shadow-purple-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Campaign</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCampaigns.map((camp) => (
            <motion.div
              key={camp.id}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl p-6 border border-[#E9D5FF] shadow-lavender-sm hover:shadow-lavender-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B5CF6] bg-[#F3F0FF] px-2.5 py-1 rounded-md">
                      {camp.industry}
                    </span>
                    <h3 className="text-lg font-bold text-[#2D1B69] mt-2">{camp.name}</h3>
                    <p className="text-xs text-[#6B7280] line-clamp-2 mt-1">{camp.description}</p>
                  </div>
                  
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F3F0FF] text-[#8B5CF6] shrink-0 border border-[#E9D5FF]">
                    {camp.status}
                  </span>
                </div>

                {/* Campaign Meta info */}
                <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-[#F8F7FF] border border-[#E9D5FF] text-xs">
                  <div>
                    <span className="text-[10px] text-[#6B7280] block">Target Audience</span>
                    <span className="font-semibold text-[#2D1B69] truncate block">{camp.audience}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6B7280] block">Platforms</span>
                    <span className="font-semibold text-[#2D1B69] truncate block">{camp.platform}</span>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-[#2D1B69]">
                    <span>Campaign Deliverables ({camp.assetsCount} assets)</span>
                    <span>{camp.progress}%</span>
                  </div>
                  <div className="w-full bg-[#E9D5FF] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#8B5CF6] h-full rounded-full transition-all" style={{ width: `${camp.progress}%` }} />
                  </div>
                </div>

              </div>

              {/* Creator & Deadline Footer */}
              <div className="flex items-center justify-between pt-4 mt-6 border-t border-[#F3F0FF]">
                <div className="flex items-center space-x-2 text-xs">
                  <img src={camp.assignedCreator.avatar} alt="" className="w-7 h-7 rounded-full object-cover border border-[#C4B5FD]" />
                  <div>
                    <p className="font-bold text-[#2D1B69] text-[11px]">{camp.assignedCreator.name}</p>
                    <p className="text-[10px] text-[#6B7280]">{camp.assignedCreator.role}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 text-xs text-[#6B7280]">
                  <Calendar className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  <span>Due {camp.deadline}</span>
                </div>
              </div>

            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
};
