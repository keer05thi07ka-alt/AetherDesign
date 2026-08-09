import React, { useEffect } from 'react';
import { X, Download, Maximize2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { GeneratedAsset } from '../../types';

interface Props {
  asset: GeneratedAsset | null;
  onClose: () => void;
}

export const AssetPreviewModal: React.FC<Props> = ({ asset, onClose }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = asset ? 'hidden' : '';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [asset, onClose]);

  if (!asset) return null;

  const download = async () => {
    if (!asset.imageUrl) {
      toast.error('This asset has no file yet');
      return;
    }
    try {
      const res = await fetch(asset.imageUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = asset.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase() + '.jpg';
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Downloaded');
    } catch {
      toast.error('Could not download this asset');
    }
  };

  const details: Array<[string, string]> = [
    ['Dimensions', asset.dimensions],
    ['Aspect', asset.aspectRatio],
    ['Category', asset.category],
    ['Created', asset.createdAt],
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#2D1B69] bg-opacity-80 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col lg:flex-row" onClick={(e) => e.stopPropagation()}>
        <div className="flex-1 bg-[#F8F7FF] flex items-center justify-center p-6 min-h-0">
          <img src={asset.imageUrl} alt={asset.title} className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-lg" />
        </div>
        <div className="w-full lg:w-80 p-6 space-y-4 overflow-y-auto shrink-0">
          <div className="flex items-start justify-between">
            <h3 className="text-sm font-bold text-[#2D1B69] pr-4">{asset.title}</h3>
            <button onClick={onClose} className="text-[#6B7280] hover:text-[#2D1B69] shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
          {asset.prompt ? (
            <div>
              <p className="text-[11px] font-semibold text-[#6B7280] mb-1">Prompt</p>
              <p className="text-[11px] text-[#4B5563] leading-relaxed italic">{asset.prompt}</p>
            </div>
          ) : null}
          <dl className="space-y-2 pt-2 border-t border-[#F3F0FF]">
            {details.map((row) => (row[1] ? (
              <div key={row[0]} className="flex justify-between">
                <dt className="text-[11px] text-[#6B7280]">{row[0]}</dt>
                <dd className="text-[11px] font-semibold text-[#2D1B69]">{row[1]}</dd>
              </div>
            ) : null))}
          </dl>
          <div className="flex items-center space-x-2 pt-2">
            <button onClick={download} className="flex-1 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5">
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <a href={asset.imageUrl} target="_blank" rel="noreferrer" title="Open in a new tab" className="px-4 py-2.5 border border-[#E9D5FF] text-[#8B5CF6] rounded-xl hover:bg-[#F8F7FF]">
              <Maximize2 className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
