import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import type {
  WorkspaceRole, User, BrandKit, Campaign, GeneratedAsset, ApprovalItem, NotificationItem,
} from '../types';
import type { MembershipRole } from '../types/api';
import { initialApprovals, mockNotifications } from '../data/mockData';
import * as svc from '../services/resources.service';
import { roleToWorkspace } from '../services/mappers';
import { ApiRequestError } from '../lib/apiClient';

interface AppContextType {
  // session
  role: WorkspaceRole;
  setRole: (role: WorkspaceRole) => void;
  user: User;
  setUser: (user: User) => void;
  businessSession: User | null;
  creatorSession: User | null;
  loginAsRole: (targetRole: WorkspaceRole, userDetails?: Partial<User>) => void;
  logout: () => void;

  // real auth
  signIn: (email: string, password: string) => Promise<WorkspaceRole | null>;
  membershipRole: MembershipRole | null;

  signUp: (input: { fullName: string; email: string; orgName: string; password: string })
    => Promise<WorkspaceRole | null>;

  // data
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

  // request state
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const defaultUser: User = {
  id: '',
  name: 'Guest',
  email: '',
  avatar: '',
  role: 'business',
  company: 'AetherDesign',
  title: '',
};

const emptyBrandKit: BrandKit = {
  id: '', name: 'No brand kit',
  primaryColor: '#8B5CF6', secondaryColor: '#F5E6DC', accentColor: '#C9A227',
  typography: 'Inter', tone: '', logoUrl: '',
  guidelines: 'No guidelines uploaded yet.', updatedAt: 'Never',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

function messageFor(e: unknown): string {
  if (e instanceof ApiRequestError) return e.payload.error;
  if (e instanceof Error) return e.message;
  return 'Something went wrong.';
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<WorkspaceRole>('business');
  const [membershipRole, setMembershipRole] = useState<MembershipRole | null>(null);
  const [businessSession, setBusinessSession] = useState<User | null>(null);
  const [creatorSession, setCreatorSession] = useState<User | null>(null);
  const [user, setUser] = useState<User>(defaultUser);

  const [brandKit, setBrandKitState] = useState<BrandKit>(emptyBrandKit);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedAsset[]>([]);

  // Approvals and notifications remain local until Phase 5.
  const [approvals, setApprovals] = useState<ApprovalItem[]>(initialApprovals);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [c, a, k] = await Promise.all([
        svc.fetchCampaigns(),
        svc.fetchAssets(),
        svc.fetchBrandKit(),
      ]);
      setCampaigns(c);
      setGeneratedAssets(a);
      if (k) setBrandKitState(k);
    } catch (e) {
      const msg = messageFor(e);
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const applySession = useCallback((r: svc.LoginResult) => {
    const workspace = roleToWorkspace(r.role);
    const u: User = {
      id: r.userId,
      name: r.fullName,
      email: r.email,
      avatar: r.avatarUrl ??
        `https://ui-avatars.com/api/?name=${encodeURIComponent(r.fullName)}&background=8B5CF6&color=fff`,
      role: workspace,
      company: 'AetherDesign',
      title: r.role.replace(/_/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase()),
    };
    setUser(u);
    setMembershipRole(r.role);
    setRoleState(workspace);
    if (workspace === 'business') setBusinessSession(u); else setCreatorSession(u);
  }, []);

  // Restore an existing session on first mount.
  useEffect(() => {
    const session = svc.restore();
    if (!session) return;
    applySession({
      userId: session.userId,
      orgId: session.orgId,
      role: session.role,
      email: session.email,
      fullName: session.email.split('@')[0],
      avatarUrl: null,
    });
    void refresh();
  }, [applySession, refresh]);

  const signIn = useCallback(async (email: string, password: string): Promise<WorkspaceRole | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await svc.signIn(email, password);
      applySession(result);
      toast.success(`Welcome back, ${result.fullName}`);
      await refresh();
      return roleToWorkspace(result.role);
    } catch (e) {
      const msg = messageFor(e);
      setError(msg);
      toast.error(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [applySession, refresh]);

  const signUp = useCallback(async (input: {
    fullName: string; email: string; orgName: string; password: string;
  }): Promise<WorkspaceRole | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await svc.register(input);
      applySession(result);
      toast.success(`Welcome to AetherDesign, ${result.fullName}`);
      await refresh();
      return roleToWorkspace(result.role);
    } catch (e) {
      const msg = messageFor(e);
      setError(msg);
      toast.error(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [applySession, refresh]);

  /** Compatibility shim — switches the workspace view without re-authenticating. */
  const loginAsRole = useCallback((targetRole: WorkspaceRole) => {
    setRoleState(targetRole);
  }, []);

  const setRole = loginAsRole;

  const logout = useCallback(() => {
    svc.signOut();
    setUser(defaultUser);
    setMembershipRole(null);
    setBusinessSession(null);
    setCreatorSession(null);
    setCampaigns([]);
    setGeneratedAssets([]);
    setBrandKitState(emptyBrandKit);
    toast.success('Signed out.');
  }, []);

  const updateBrandKit = useCallback((updated: Partial<BrandKit>) => {
    setBrandKitState((prev) => ({ ...prev, ...updated, updatedAt: 'Just now' }));
    toast('Brand kit changes are local only until Phase 3.', { icon: 'i' });
  }, []);

  const addCampaign = useCallback(
    (newCamp: Omit<Campaign, 'id' | 'createdAt' | 'assetsCount' | 'progress'>) => {
      void (async () => {
        setLoading(true);
        try {
          const created = await svc.createCampaign({
            name: newCamp.name,
            description: newCamp.description,
            audience: newCamp.audience,
            platform: newCamp.platform,
            status: newCamp.status,
          });
          setCampaigns((prev) => [created, ...prev]);
          toast.success(`Campaign "${created.name}" created`);
        } catch (e) {
          toast.error(messageFor(e));
        } finally {
          setLoading(false);
        }
      })();
    }, []);

  // Real generation arrives in Phase 4.
  const generateAsset = useCallback(() => {
    toast('AI generation is wired up in Phase 4.', { icon: 'i' });
  }, []);

  const toggleFavoriteAsset = useCallback((id: string) => {
    setGeneratedAssets((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item)));
  }, []);

  const deleteAsset = useCallback((id: string) => {
    void (async () => {
      try {
        await svc.deleteAsset(id);
        setGeneratedAssets((prev) => prev.filter((item) => item.id !== id));
        toast.success('Asset deleted');
      } catch (e) {
        toast.error(messageFor(e));
      }
    })();
  }, []);

  const handleApproval = useCallback((id: string, status: 'approved' | 'rejected') => {
    setApprovals((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
    toast.success(status === 'approved' ? 'Design approved' : 'Revision requested');
  }, []);

  const addApprovalComment = useCallback((id: string, commentText: string) => {
    setApprovals((prev) => prev.map((item) => item.id === id ? {
      ...item,
      comments: [...item.comments, {
        id: `c-${Date.now()}`, author: user.name, avatar: user.avatar,
        text: commentText, time: 'Just now',
      }],
    } : item));
    toast.success('Comment posted');
  }, [user.name, user.avatar]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  }, []);

  return (
    <AppContext.Provider value={{
      role, setRole, user, setUser, businessSession, creatorSession,
      loginAsRole, logout, signIn, signUp, membershipRole,
      brandKit, updateBrandKit, campaigns, addCampaign,
      generatedAssets, generateAsset, toggleFavoriteAsset, deleteAsset,
      approvals, handleApproval, addApprovalComment,
      notifications, markNotificationRead,
      loading, error, refresh,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};