import React, { useState } from 'react';
import type { GeneratedAsset } from '../../types';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Download, Edit3, Trash2, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AssetPreviewModal } from '../../components/common/AssetPreviewModal';
import { CaptionsModal } from '../../components/common/CaptionsModal';
import toast from 'react-hot-toast';

export const AssetLibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const { generatedAssets, deleteAsset } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [preview, setPreview] = useState<GeneratedAsset | null>(null);
  const [captionsResponse, setCaptionsResponse] = useState<string | null>(null);

  const handleCreateCaptions = async (asset: GeneratedAsset) => {
    const promise = fetch('https://api.agents.snsihub.ai/webhook-test/f6f15dd3-e291-4e50-a677-83b775bf4145', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageUrl: asset.imageUrl,
        prompt: asset.prompt,
      }),
    }).then(async (res) => {
      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }
      const text = await res.text();
      setCaptionsResponse(text);
      return text;
    });

    toast.promise(promise, {
      loading: 'Triggering captions creation...',
      success: 'Webhook sent! Caption generation started.',
      error: (err) => `Failed: ${err.message || err}`,
    });
  };

  const categories = ['All', 'Poster', 'Banner', 'Social Media', 'Presentation', 'Logo'];

  const filteredAssets = generatedAssets.filter((a) => {
    const matchesCat = selectedCategory === 'All' || a.category === selectedCategory;
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || a.prompt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#2D1B69]">Asset Vault Library</h1>
        <p className="text-xs text-[#6B7280]">
          Central storage repository for all generated, edited, and approved digital marketing collateral.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 border border-[#E9D5FF] shadow-lavender-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#8B5CF6] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search assets by title or prompt..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs font-medium text-[#2D1B69] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#8B5CF6] text-white shadow-sm'
                  : 'bg-[#F8F7FF] text-[#6B7280] hover:text-[#2D1B69]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Asset Cards Grid */}
      {filteredAssets.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-[#E9D5FF] text-center space-y-4 max-w-md mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-[#F3F0FF] text-[#8B5CF6] flex items-center justify-center mx-auto border border-[#E9D5FF]">
            <Download className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-[#2D1B69]">No Generated Assets</h3>
          <p className="text-xs text-[#6B7280]">
            Your asset vault is empty. Use the AI Generator to produce high-resolution marketing visual collateral.
          </p>
          <button
            onClick={() => navigate('/creator/generator')}
            className="inline-flex items-center space-x-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-lg shadow-purple-500/25 transition-all"
          >
            <span>Open AI Generator</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((asset) => (
            <motion.div
              key={asset.id}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl border border-[#E9D5FF] shadow-lavender-sm hover:shadow-lavender-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                
                {/* Image Preview */}
                <div className="relative aspect-video bg-[#F3F0FF] overflow-hidden">
                  <img
                    src={asset.imageUrl}
                    alt={asset.title}
                    onClick={() => setPreview(asset)}
                    className="w-full h-full object-cover cursor-pointer transition-transform hover:scale-[1.03]"
                  />
                  <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded-md">
                    {asset.dimensions}
                  </span>
                </div>

                {/* Asset Meta */}
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B5CF6] bg-[#F3F0FF] px-2 py-0.5 rounded">
                      {asset.category}
                    </span>
                    <span className="text-[10px] text-[#6B7280]">{asset.createdAt}</span>
                  </div>

                  <h3 className="font-bold text-sm text-[#2D1B69]">{asset.title}</h3>
                  <p className="text-xs text-[#6B7280] line-clamp-2 italic">"{asset.prompt}"</p>
                </div>

              </div>

              {/* Bottom Actions Bar */}
              <div className="p-3 bg-[#F8F7FF] border-t border-[#F3F0FF] flex items-center justify-between gap-2">
                <button
                  onClick={() => navigate('/creator/editor')}
                  className="flex-1 py-2 bg-white text-[#8B5CF6] border border-[#E9D5FF] font-bold text-xs rounded-xl hover:bg-[#8B5CF6] hover:text-white transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Canvas</span>
                </button>

                <button
                  onClick={() => setPreview(asset)}
                  className="p-2 bg-white border border-[#E9D5FF] text-[#2D1B69] hover:bg-[#F3F0FF] rounded-xl transition-colors"
                  title="Preview and download"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleCreateCaptions(asset)}
                  className="p-2 bg-white border border-[#E9D5FF] text-[#8B5CF6] hover:bg-[#F3F0FF] rounded-xl transition-colors"
                  title="Create Captions"
                >
                  <Sparkles className="w-4 h-4" />
                </button>

                <button
                  onClick={() => deleteAsset(asset.id)}
                  className="p-2 bg-white border border-[#E9D5FF] text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title="Delete Asset"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </motion.div>
          ))}
        </div>
      )}

    <AssetPreviewModal asset={preview} onClose={() => setPreview(null)} />
    <CaptionsModal isOpen={!!captionsResponse} onClose={() => setCaptionsResponse(null)} rawResponse={captionsResponse || ''} />
    </div>
  );
};
