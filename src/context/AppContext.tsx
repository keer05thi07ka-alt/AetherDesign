import React, { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';
import type { WorkspaceRole, User, BrandKit, Campaign, GeneratedAsset, ApprovalItem, NotificationItem } from '../types';
import { initialBrandKit, initialCampaigns, initialGeneratedAssets, initialApprovals, mockNotifications } from '../data/mockData';

interface AppContextType {
  role: WorkspaceRole;
  setRole: (role: WorkspaceRole) => void;
  user: User;
  setUser: (user: User) => void;
  businessSession: User | null;
  creatorSession: User | null;
  loginAsRole: (targetRole: WorkspaceRole, userDetails?: Partial<User>) => void;
  logout: () => void;
  brandKit: BrandKit;
  updateBrandKit: (updated: Partial<BrandKit>) => void;
  campaigns: Campaign[];
  addCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'assetsCount' | 'progress'>) => void;
  generatedAssets: GeneratedAsset[];
  generateAsset: (params: { prompt: string; platform: string; audience: string; style: string }) => void;
  toggleFavoriteAsset: (id: string) => void;
  deleteAsset: (id: string) => void;
  approvals: ApprovalItem[];
  handleApproval: (id: string, status: 'approved' | 'rejected') => void;
  addApprovalComment: (id: string, commentText: string) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
}

const defaultUser: User = {
  id: 'usr-1',
  name: 'Workspace User',
  email: 'user@workspace.com',
  avatar: 'https://ui-avatars.com/api/?name=Workspace+User&background=8B5CF6&color=fff',
  role: 'business',
  company: 'AetherDesign Platform',
  title: 'Workspace Admin',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<WorkspaceRole>('business');
  const [businessSession, setBusinessSession] = useState<User | null>(null);
  const [creatorSession, setCreatorSession] = useState<User | null>(null);

  const [user, setUser] = useState<User>(defaultUser);
  const [brandKit, setBrandKitState] = useState<BrandKit>(initialBrandKit);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedAsset[]>(initialGeneratedAssets);
  const [approvals, setApprovals] = useState<ApprovalItem[]>(initialApprovals);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);

  const loginAsRole = (targetRole: WorkspaceRole, userDetails?: Partial<User>) => {
    setRoleState(targetRole);
    const updatedUser: User = {
      ...defaultUser,
      role: targetRole,
      name: userDetails?.name || (targetRole === 'business' ? 'Business User' : 'Creator User'),
      email: userDetails?.email || (targetRole === 'business' ? 'business@aether.ai' : 'creator@aether.ai'),
      avatar: userDetails?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(targetRole)}+User&background=8B5CF6&color=fff`,
    };

    if (targetRole === 'business') {
      setBusinessSession(updatedUser);
      setUser(updatedUser);
      toast.success('Signed in to Business Workspace 💼');
    } else {
      setCreatorSession(updatedUser);
      setUser(updatedUser);
      toast.success('Signed in to Creator Workspace 🎨');
    }
  };

  const setRole = (newRole: WorkspaceRole) => {
    loginAsRole(newRole);
  };

  const logout = () => {
    if (role === 'business') {
      setBusinessSession(null);
    } else {
      setCreatorSession(null);
    }
    toast.success('Logged out of workspace.');
  };

  const updateBrandKit = (updated: Partial<BrandKit>) => {
    setBrandKitState((prev) => ({
      ...prev,
      ...updated,
      updatedAt: 'Just now',
    }));
    toast.success('Brand Kit updated successfully!');
  };

  const addCampaign = (newCamp: Omit<Campaign, 'id' | 'createdAt' | 'assetsCount' | 'progress'>) => {
    const campaign: Campaign = {
      ...newCamp,
      id: `camp-${Date.now()}`,
      createdAt: 'Just now',
      assetsCount: 0,
      progress: 0,
    };
    setCampaigns((prev) => [campaign, ...prev]);
    toast.success(`Campaign "${campaign.name}" created successfully!`);
  };

  const generateAsset = (params: { prompt: string; platform: string; audience: string; style: string }) => {
    // Generate clean SVG visual asset Data URL
    const svgData = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#8B5CF6" />
          <stop offset="50%" stop-color="#A78BFA" />
          <stop offset="100%" stop-color="#C4B5FD" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#g)" />
      <circle cx="400" cy="300" r="180" fill="#ffffff" opacity="0.15" />
      <text x="400" y="270" font-family="sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">${params.style} ${params.platform} Asset</text>
      <text x="400" y="320" font-family="sans-serif" font-size="16" fill="#ffffff" opacity="0.8" text-anchor="middle">${params.prompt.substring(0, 45)}...</text>
    </svg>`;

    const svgBlobUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgData)}`;

    const newAsset: GeneratedAsset = {
      id: `gen-${Date.now()}`,
      title: `${params.style} ${params.platform} Visual`,
      prompt: params.prompt,
      platform: params.platform,
      audience: params.audience,
      style: params.style,
      imageUrl: svgBlobUrl,
      createdAt: 'Just now',
      isFavorite: false,
      category: params.platform,
      dimensions: '1920 x 1080 px',
      aspectRatio: '16:9',
      tags: ['AI Generated', params.platform, params.style],
    };

    setGeneratedAssets((prev) => [newAsset, ...prev]);
    toast.success('AI Asset generated successfully! ✨');
  };

  const toggleFavoriteAsset = (id: string) => {
    setGeneratedAssets((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
  };

  const deleteAsset = (id: string) => {
    setGeneratedAssets((prev) => prev.filter((item) => item.id !== id));
    toast.success('Asset deleted from library.');
  };

  const handleApproval = (id: string, status: 'approved' | 'rejected') => {
    setApprovals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
    if (status === 'approved') {
      toast.success('Design approved! Creator notified.');
    } else {
      toast.error('Revision requested from creator.');
    }
  };

  const addApprovalComment = (id: string, commentText: string) => {
    setApprovals((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            comments: [
              ...item.comments,
              {
                id: `c-${Date.now()}`,
                author: user.name,
                avatar: user.avatar,
                text: commentText,
                time: 'Just now',
              },
            ],
          };
        }
        return item;
      })
    );
    toast.success('Comment posted.');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        user,
        setUser,
        businessSession,
        creatorSession,
        loginAsRole,
        logout,
        brandKit,
        updateBrandKit,
        campaigns,
        addCampaign,
        generatedAssets,
        generateAsset,
        toggleFavoriteAsset,
        deleteAsset,
        approvals,
        handleApproval,
        addApprovalComment,
        notifications,
        markNotificationRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
