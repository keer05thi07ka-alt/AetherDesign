import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import { MainLayout } from './components/layouts/MainLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AuthCallback } from './pages/AuthCallback';
import { OnboardingPage } from './pages/OnboardingPage';

// Public & Auth Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { RoleSelectionPage } from './pages/RoleSelectionPage';
import { AccessDeniedPage } from './pages/AccessDeniedPage';

// Business Workspace Pages
import { BusinessDashboard } from './pages/business/BusinessDashboard';
import { CampaignsPage } from './pages/business/CampaignsPage';
import { CreateCampaignPage } from './pages/business/CreateCampaignPage';
import { BrandKitPage } from './pages/business/BrandKitPage';
import { ApprovalsPage } from './pages/business/ApprovalsPage';
import { AnalyticsPage } from './pages/business/AnalyticsPage';

// Creator Workspace Pages
import { CreatorDashboard } from './pages/creator/CreatorDashboard';
import { AIGeneratorPage } from './pages/creator/AIGeneratorPage';
import { TemplatesPage } from './pages/creator/TemplatesPage';
import { AssetLibraryPage } from './pages/creator/AssetLibraryPage';
import { CanvaEditorPage } from './pages/creator/CanvaEditorPage';

// Shared Pages
import { SettingsPage } from './pages/SettingsPage';
import { SupportPage } from './pages/SupportPage';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <MainLayout>
          <Routes>
            {/* Public Landing & Separate Auth Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/login/business" element={<LoginPage />} />
            <Route path="/login/creator" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/role-selection" element={<RoleSelectionPage />} />
            <Route path="/access-denied" element={<AccessDeniedPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/support" element={<SupportPage />} />

            {/* Business Workspace Routes (Protected for Business Role Only) */}
            <Route
              path="/business/dashboard"
              element={
                <ProtectedRoute allowedRole="business">
                  <BusinessDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/business/campaigns"
              element={
                <ProtectedRoute allowedRole="business">
                  <CampaignsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/business/campaigns/create"
              element={
                <ProtectedRoute allowedRole="business">
                  <CreateCampaignPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/business/brand-kit"
              element={
                <ProtectedRoute allowedRole="business">
                  <BrandKitPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/business/approvals"
              element={
                <ProtectedRoute allowedRole="business">
                  <ApprovalsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/business/analytics"
              element={
                <ProtectedRoute allowedRole="business">
                  <AnalyticsPage />
                </ProtectedRoute>
              }
            />

            {/* Creator Workspace Routes (Protected for Creator Role Only) */}
            <Route
              path="/creator/dashboard"
              element={
                <ProtectedRoute allowedRole="creator">
                  <CreatorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/creator/generator"
              element={
                <ProtectedRoute allowedRole="creator">
                  <AIGeneratorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/creator/templates"
              element={
                <ProtectedRoute allowedRole="creator">
                  <TemplatesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/creator/assets"
              element={
                <ProtectedRoute allowedRole="creator">
                  <AssetLibraryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/creator/editor"
              element={
                <ProtectedRoute allowedRole="creator">
                  <CanvaEditorPage />
                </ProtectedRoute>
              }
            />

            {/* Shared Routes */}
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/support" element={<SupportPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
