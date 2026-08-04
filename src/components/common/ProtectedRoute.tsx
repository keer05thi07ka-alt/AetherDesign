import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import type { WorkspaceRole } from '../../types';

interface ProtectedRouteProps {
  allowedRole: WorkspaceRole;
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRole, children }) => {
  const { businessSession, creatorSession } = useApp();
  const location = useLocation();

  if (allowedRole === 'business') {
    if (!businessSession) {
      return <Navigate to="/login/business" state={{ from: location }} replace />;
    }
  }

  if (allowedRole === 'creator') {
    if (!creatorSession) {
      return <Navigate to="/login/creator" state={{ from: location }} replace />;
    }
  }

  return <>{children}</>;
};
