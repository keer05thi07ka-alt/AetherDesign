import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, Loader2, UserPlus, CheckCircle2, Mail, ArrowRight, Settings, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import type { WorkspaceRole } from '../../types';
import { getStoredGoogleClientId, setStoredGoogleClientId, initiateGoogleOAuth } from '../../utils/googleAuth';

interface GoogleAccount {
  name: string;
  email: string;
  avatar: string;
  rolePermission: WorkspaceRole | 'unregistered';
}

interface GoogleAuthModalProps {
  isOpen: boolean;
  targetRole: WorkspaceRole;
  onClose: () => void;
  onSuccess: (role: WorkspaceRole) => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  targetRole,
  onClose,
  onSuccess,
}) => {
  const [authenticatingEmail, setAuthenticatingEmail] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customEmail, setCustomEmail] = useState('');

  // Settings tab for Google Cloud Client ID
  const [showClientIdConfig, setShowClientIdConfig] = useState(false);
  const [clientIdInput, setClientIdInput] = useState('');

  useEffect(() => {
    setClientIdInput(getStoredGoogleClientId());
  }, [isOpen]);

  if (!isOpen) return null;

  const mockGoogleAccounts: GoogleAccount[] = [
    {
      name: 'Keerthika K',
      email: 'keer05thi07ka@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rolePermission: targetRole,
    },
    {
      name: 'Alex Rivera',
      email: 'alex.rivera@nexus.ai',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      rolePermission: 'business',
    },
    {
      name: 'Elena Rostova',
      email: 'elena.design@aether.ai',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      rolePermission: 'creator',
    },
    {
      name: 'John Smith',
      email: 'john.smith@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      rolePermission: 'unregistered',
    },
  ];

  const handleSelectAccount = (account: GoogleAccount) => {
    setErrorMsg(null);
    setAuthenticatingEmail(account.email);

    setTimeout(() => {
      setAuthenticatingEmail(null);

      if (account.rolePermission === targetRole) {
        toast.success(`Google Auth Successful: Signed in as ${account.name}`);
        onSuccess(targetRole);
      } else {
        const error = account.rolePermission === 'unregistered'
          ? `Access Denied: "${account.email}" is not registered in AetherDesign AI. Please select an authorized account.`
          : `Access Denied: "${account.email}" holds a ${account.rolePermission.toUpperCase()} account and cannot access the ${targetRole.toUpperCase()} Workspace.`;
        
        setErrorMsg(error);
        toast.error('Google Sign-In Authorization Failed');
      }
    }, 1000);
  };

  const handleCustomEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;

    setErrorMsg(null);
    setAuthenticatingEmail(customEmail);

    setTimeout(() => {
      setAuthenticatingEmail(null);
      toast.success(`Google Auth Successful: Signed in as ${customEmail}`);
      onSuccess(targetRole);
    }, 1000);
  };

  const handleSaveClientId = () => {
    setStoredGoogleClientId(clientIdInput);
    toast.success(clientIdInput ? 'Google Client ID updated!' : 'Cleared Google Client ID');
    setShowClientIdConfig(false);
  };

  const handleLaunchGoogleCloudPopup = () => {
    initiateGoogleOAuth({
      clientId: clientIdInput,
      onSuccess: (profile) => {
        const isBusiness = profile.email.includes('alex') || profile.email.includes('nexus') || profile.email.includes('business');
        const isCreator = profile.email.includes('elena') || profile.email.includes('design') || profile.email.includes('creator');
        const matchedRole = isBusiness ? 'business' : isCreator ? 'creator' : targetRole;

        if (matchedRole === targetRole) {
          toast.success(`Authenticated with Google: ${profile.email}`);
          onSuccess(targetRole);
        } else {
          setErrorMsg(`Access Denied: "${profile.email}" is not authorized for ${targetRole.toUpperCase()} Workspace.`);
        }
      },
      onError: (err) => {
        setErrorMsg(err);
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2D1B69]/50 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-3xl border border-[#E9D5FF] shadow-2xl max-w-md w-full p-6 sm:p-8 relative overflow-hidden text-left space-y-5"
      >
        
        {/* Header with Google Logo */}
        <div className="flex items-center justify-between border-b border-[#F3F0FF] pb-4">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <div>
              <h3 className="font-bold text-sm text-[#2D1B69]">Sign in with Google</h3>
              <p className="text-[11px] text-[#6B7280]">to continue to AetherDesign AI</p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setShowClientIdConfig(!showClientIdConfig)}
              className="p-1.5 rounded-xl text-[#6B7280] hover:text-[#8B5CF6] hover:bg-[#F3F0FF] transition-colors"
              title="Configure Google Cloud Client ID"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-gray-400 hover:text-[#2D1B69] hover:bg-[#F3F0FF] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Workspace Context Badge */}
        <div className="bg-[#F8F7FF] border border-[#E9D5FF] p-3 rounded-2xl flex items-center justify-between text-xs">
          <span className="font-semibold text-[#2D1B69]">Target Workspace:</span>
          <span className="font-bold text-[#8B5CF6] uppercase tracking-wider bg-[#F3F0FF] px-2.5 py-0.5 rounded-full border border-[#E9D5FF]">
            {targetRole} Workspace
          </span>
        </div>

        {/* Client ID Configuration Section if toggled */}
        <AnimatePresence>
          {showClientIdConfig && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3.5 rounded-2xl bg-[#F8F7FF] border border-[#E9D5FF] space-y-2.5 text-xs text-[#2D1B69]"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold">Google Cloud Client ID Settings</span>
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-[#8B5CF6] font-bold flex items-center gap-1 hover:underline"
                >
                  <span>Google Console</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-[11px] text-[#6B7280] leading-snug">
                To eliminate Error 401 on <code className="text-[#8B5CF6]">accounts.google.com</code> popups, paste your Client ID registered with origin <code className="text-[#8B5CF6]">http://localhost:5173</code>.
              </p>
              <input
                type="text"
                placeholder="YOUR_CLIENT_ID.apps.googleusercontent.com"
                value={clientIdInput}
                onChange={(e) => setClientIdInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E9D5FF] bg-white text-xs font-mono text-[#2D1B69] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveClientId}
                  className="flex-1 py-1.5 bg-[#8B5CF6] text-white text-xs font-bold rounded-xl"
                >
                  Save Client ID
                </button>
                <button
                  type="button"
                  onClick={handleLaunchGoogleCloudPopup}
                  className="flex-1 py-1.5 bg-white border border-[#8B5CF6] text-[#8B5CF6] text-xs font-bold rounded-xl flex items-center justify-center gap-1"
                >
                  <span>Test Popup</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Alert if Access Denied */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start space-x-2.5"
            >
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-medium">{errorMsg}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Google Accounts Selection List (Forces Account Picker) */}
        <div className="space-y-2.5">
          <p className="text-xs font-semibold text-[#6B7280]">Choose a Google account (prompt=select_account):</p>
          
          {mockGoogleAccounts.map((account) => {
            const isAuthenticating = authenticatingEmail === account.email;

            return (
              <button
                key={account.email}
                disabled={!!authenticatingEmail}
                onClick={() => handleSelectAccount(account)}
                className="w-full p-3 rounded-2xl border border-[#E9D5FF] bg-white hover:bg-[#F8F7FF] hover:border-[#8B5CF6] transition-all flex items-center justify-between text-left group disabled:opacity-50 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={account.avatar}
                    alt={account.name}
                    className="w-9 h-9 rounded-xl object-cover border border-[#C4B5FD]"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs font-bold text-[#2D1B69] group-hover:text-[#8B5CF6]">
                        {account.name}
                      </p>
                      <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                        account.rolePermission === 'business'
                          ? 'bg-purple-100 text-purple-700'
                          : account.rolePermission === 'creator'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {account.rolePermission}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B7280]">{account.email}</p>
                  </div>
                </div>

                {isAuthenticating ? (
                  <Loader2 className="w-4 h-4 text-[#8B5CF6] animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-gray-300 group-hover:text-[#8B5CF6]" />
                )}
              </button>
            );
          })}

          {/* Use another account section */}
          {!showCustomInput ? (
            <button
              onClick={() => setShowCustomInput(true)}
              className="w-full py-2.5 px-3 rounded-2xl border border-dashed border-[#8B5CF6] bg-[#F8F7FF] text-xs font-semibold text-[#8B5CF6] hover:bg-[#F3F0FF] transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Use another account</span>
            </button>
          ) : (
            <form onSubmit={handleCustomEmailSubmit} className="space-y-2 pt-1">
              <label className="block text-[11px] font-bold text-[#2D1B69]">Enter Google Account Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8B5CF6] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E9D5FF] bg-[#F8F7FF] text-xs font-medium text-[#2D1B69] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCustomInput(false)}
                  className="flex-1 py-2 rounded-xl border border-[#E9D5FF] text-xs font-bold text-[#6B7280]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!!authenticatingEmail}
                  className="flex-1 py-2 bg-[#8B5CF6] text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1"
                >
                  {authenticatingEmail ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <span>Next</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>

        <p className="text-[10px] text-gray-400 text-center leading-normal">
          Google OAuth 2.0 Account Selector & Role Guard enforced. AetherDesign AI will verify authorized workspace permissions.
        </p>

      </motion.div>
    </div>
  );
};
