import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { WorkspaceRole } from '../../types';

interface ProtectedRouteProps {
  /**
   * Which surface this route belongs to.
   *
   * 'creator' routes (generation, templates, library, editor) are available
   * to every authenticated user — a paying business needs them too.
   *
   * 'business' routes (campaigns, brand kit, approvals, analytics) require
   * a team plan. This is a UI gate only; api_write() enforces the real rules.
   */
  allowedRole: WorkspaceRole;
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRole, children }) => {
  const { authState, can } = useApp();
  const location = useLocation();

  // Session restoration is in flight. Redirecting now would sign the user
  // out on every page refresh.
  if (authState === 'loading') {
    return (
      <div className="min-h-screen bg-[#F8F7FF] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6] flex items-center justify-center text-white shadow-md animate-pulse mb-4">
          <Sparkles className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-[#2D1B69]">Loading your workspace…</p>
      </div>
    );
  }

  if (authState === 'signed_out') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (authState === 'needs_onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // Team surfaces require a paid plan. Solo users land on their own dashboard
  // rather than an access-denied page — they haven't done anything wrong.
  if (allowedRole === 'business' && !can.campaigns) {
    return <Navigate to="/creator/dashboard" replace />;
  }

  return <>{children}</>;
};