import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Star, Edit3 } from 'lucide-react';
import { mockTemplates } from '../../data/mockData';

export const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Social Media', 'Banner', 'Poster', 'Logo', 'Presentation', 'Business', 'Marketing'];

  const filteredTemplates = mockTemplates.filter((tpl) => {
    const matchesCategory = activeCategory === 'All' || tpl.category === activeCategory;
    const matchesSearch = tpl.title.toLowerCase().includes(searchTerm.toLowerCase()) || tpl.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#2D1B69]">Template Library</h1>
        <p className="text-xs text-[#6B7280]">
          Thousands of responsive, brand-adaptable templates for social stories, ads, web banners, and executive keynotes.
        </p>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="bg-white rounded-3xl p-4 border border-[#E9D5FF] shadow-lavender-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#8B5CF6] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search templates or tags..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs font-medium text-[#2D1B69] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-[#8B5CF6] text-white shadow-sm'
                  : 'bg-[#F8F7FF] text-[#6B7280] hover:text-[#2D1B69]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Responsive Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredTemplates.map((tpl) => (
          <motion.div
            key={tpl.id}
            whileHover={{ y: -6 }}
            className="bg-white rounded-3xl border border-[#E9D5FF] shadow-lavender-sm hover:shadow-lavender-md transition-all overflow-hidden flex flex-col justify-between group relative"
          >
            <div>
              
              {/* Image Preview Container with Hover Overlay */}
              <div className="relative aspect-video bg-[#F3F0FF] overflow-hidden">
                <img
                  src={tpl.imageUrl}
                  alt={tpl.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {tpl.isTrending && (
                  <span className="absolute top-3 left-3 bg-[#8B5CF6] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md">
                    Trending
                  </span>
                )}

                {/* Hover Action Overlay */}
                <div className="absolute inset-0 bg-[#2D1B69]/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                  <button
                    onClick={() => navigate('/creator/editor')}
                    className="px-4 py-2.5 bg-white text-[#8B5CF6] font-bold text-xs rounded-xl shadow-xl hover:bg-purple-50 flex items-center space-x-1.5 transition-transform hover:scale-105"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Use Template</span>
                  </button>
                </div>

              </div>

              {/* Template Info */}
              <div className="p-4 space-y-2">
                <span className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-wider bg-[#F3F0FF] px-2 py-0.5 rounded">
                  {tpl.category}
                </span>
                <h3 className="font-bold text-xs text-[#2D1B69] line-clamp-1">{tpl.title}</h3>

                <div className="flex items-center justify-between text-[11px] text-[#6B7280]">
                  <span className="flex items-center gap-1 text-amber-500 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-current" /> {tpl.rating}
                  </span>
                  <span>{tpl.downloads} downloads</span>
                </div>
              </div>

            </div>

            {/* Bottom Button */}
            <div className="p-3 bg-[#F8F7FF] border-t border-[#F3F0FF]">
              <button
                onClick={() => navigate('/creator/editor')}
                className="w-full py-2 bg-white text-[#8B5CF6] border border-[#E9D5FF] font-bold text-xs rounded-xl hover:bg-[#8B5CF6] hover:text-white transition-colors"
              >
                Use Template
              </button>
            </div>

          </motion.div>
        ))}
      </div>

    </div>
  );
};
