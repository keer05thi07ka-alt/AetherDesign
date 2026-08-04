import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, Briefcase, Palette, ArrowRight } from 'lucide-react';
import type { WorkspaceRole } from '../types';

interface AccessDeniedPageProps {
  targetRole?: WorkspaceRole;
}

export const AccessDeniedPage: React.FC<AccessDeniedPageProps> = ({ targetRole = 'business' }) => {
  const navigate = useNavigate();

  const isBusiness = targetRole === 'business';
  const roleTitle = isBusiness ? 'Business Workspace' : 'Creator Workspace';
  const Icon = isBusiness ? Briefcase : Palette;
  const loginPath = isBusiness ? '/login/business' : '/login/creator';

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl border border-[#E9D5FF] shadow-2xl p-8 space-y-6 text-center"
      >
        
        {/* Icon Header */}
        <div className="w-16 h-16 rounded-3xl bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider bg-red-50 px-3 py-1 rounded-full border border-red-200">
            Permission Restricted
          </span>
          <h2 className="text-2xl font-extrabold text-[#2D1B69] tracking-tight">
            Access Denied
          </h2>
          <p className="text-xs text-[#6B7280] leading-relaxed max-w-sm mx-auto">
            You need to sign in with a <span className="font-bold text-[#2D1B69]">{roleTitle}</span> account to access these features. {isBusiness ? 'Business and Creator sessions are strictly independent.' : 'Creator tools require a Creator authentication session.'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#F8F7FF] border border-[#E9D5FF] text-xs text-[#2D1B69] space-y-1 text-left">
          <p className="font-bold flex items-center gap-1.5 text-[#8B5CF6]">
            <Icon className="w-4 h-4" />
            <span>{roleTitle} Protection</span>
          </p>
          <p className="text-[11px] text-[#6B7280]">
            • Strict role-based workspace boundaries<br />
            • Independent authentication & active sessions<br />
            • Unified brand governance
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => navigate(loginPath)}
          className="w-full py-3.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold rounded-2xl shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center space-x-2"
        >
          <span>Sign In to {roleTitle}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </motion.div>
    </div>
  );
};
