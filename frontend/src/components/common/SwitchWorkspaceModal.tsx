import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, X, Briefcase, Palette } from 'lucide-react';
import type { WorkspaceRole } from '../../types';

interface SwitchWorkspaceModalProps {
  isOpen: boolean;
  targetRole: WorkspaceRole;
  onClose: () => void;
  onConfirm: () => void;
}

export const SwitchWorkspaceModal: React.FC<SwitchWorkspaceModalProps> = ({
  isOpen,
  targetRole,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const roleName = targetRole === 'business' ? 'Business' : 'Creator';
  const Icon = targetRole === 'business' ? Briefcase : Palette;

  return (
    <div className="fixed inset-0 z-50 bg-[#2D1B69]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl border border-[#E9D5FF] shadow-2xl max-w-md w-full p-6 sm:p-8 text-center space-y-6 relative overflow-hidden"
      >
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#2D1B69] p-1 rounded-xl"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-[#F3F0FF] text-[#8B5CF6] flex items-center justify-center mx-auto shadow-md">
          <Icon className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F3F0FF] text-[#8B5CF6] px-3 py-1 rounded-full border border-[#E9D5FF]">
            Workspace Security Boundary
          </span>
          <h3 className="text-xl font-bold text-[#2D1B69]">
            Authentication Required
          </h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            You need to sign in with a <span className="font-bold text-[#2D1B69]">{roleName} account</span> to continue. Business and Creator workspaces operate under separate security sessions.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs font-bold text-[#2D1B69] hover:bg-[#F3F0FF] transition-all"
          >
            Cancel
          </button>
          
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold rounded-2xl shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center space-x-1.5"
          >
            <span>Proceed to {roleName} Login</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </motion.div>
    </div>
  );
};
