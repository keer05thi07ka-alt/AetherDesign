import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import type {
  WorkspaceRole, User, BrandKit, Campaign, GeneratedAsset, ApprovalItem, NotificationItem,
} from '../types';
import type { MembershipRole } from '../types/api';
import { initialApprovals, mockNotifications } from '../data/mockData';
import * as svc from '../services/resources.service';
import type { Membership } from '../services/resources.service';
import { workspaceFor } from '../services/mappers';
import { ApiRequestError, decodeToken } from '../lib/apiClient';
import { capabilitiesFor, type Capabilities } from '../lib/capabilities';

/** Where the user is in the authentication lifecycle. */
export type AuthState = 'loading' | 'signed_out' | 'needs_onboarding' | 'ready';

export interface AuthResult {
  ok: boolean;
  needsOnboarding: boolean;
  workspace: WorkspaceRole | null;
}

interface AppContextType {
  // ---- auth ----
  authState: AuthState;
  membershipRole: MembershipRole | null;
  plan: 'free' | 'pro' | 'enterprise' | null;
  can: Capabilities;
  orgs: Membership[];
  orgName: string;

  signInWithGoogle: (intent?: 'login' | 'signup') => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<AuthResult>;
  signUpWithPassword: (email: string, password: string, fullName: string) => Promise<AuthResult>;
  completeOnboarding: (orgName: string, plan: 'free' | 'enterprise') => Promise<WorkspaceRole | null>;
  switchOrg: (orgId: string) => Promise<boolean>;
  completeAuth: () => Promise<AuthResult>;
  logout: () => Promise<void>;

  // ---- session view ----
  role: WorkspaceRole;
  setRole: (role: WorkspaceRole) => void;
  user: User;
  setUser: (user: User) => void;
  businessSession: User | null;
  creatorSession: User | null;
  loginAsRole: (targetRole: WorkspaceRole) => void;

  // ---- data ----
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

  // ---- request state ----
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const defaultUser: User = {
  id: '', name: 'Guest', email: '', avatar: '',
  role: 'business', company: 'AetherDesign', title: '',
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

function titleCase(role: string): string {
  return role.replace(/_/g, ' ').replace(/\b\w/g, (ch: string) => ch.toUpperCase());
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [membershipRole, setMembershipRole] = useState<MembershipRole | null>(null);
  const [plan, setPlan] = useState<'free' | 'pro' | 'enterprise' | null>(null);
  const [orgs, setOrgs] = useState<Membership[]>([]);
  const [orgName, setOrgName] = useState('');

  const [role, setRoleState] = useState<WorkspaceRole>('business');
  const [user, setUser] = useState<User>(defaultUser);
  const [businessSession, setBusinessSession] = useState<User | null>(null);
  const [creatorSession, setCreatorSession] = useState<User | null>(null);

  const [brandKit, setBrandKitState] = useState<BrandKit>(emptyBrandKit);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedAsset[]>([]);

  // Approvals and notifications stay local until Phase 9.
  const [approvals, setApprovals] = useState<ApprovalItem[]>(initialApprovals);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [c, a, k] = await Promise.all([
        svc.fetchCampaigns(), svc.fetchAssets(), svc.fetchBrandKit(),
      ]);
      setCampaigns(c);
      setGeneratedAssets(a);
      setBrandKitState(k ?? emptyBrandKit);
    } catch (e) {
      const msg = messageFor(e);
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const applyOutcome = useCallback((out: svc.AuthOutcome): AuthResult => {
    if (out.needsOnboarding) {
      setAuthState('needs_onboarding');
      setUser({
        ...defaultUser,
        id: out.profile.userId,
        name: out.profile.fullName,
        email: out.profile.email,
      });
      return { ok: true, needsOnboarding: true, workspace: null };
    }

    const s = out.session!;
    // The session token is the source of truth for plan. out.orgs arrives
    // empty because the JWT node drops sibling fields from the response.
    const activePlan = (s.plan ?? 'free') as 'free' | 'pro' | 'enterprise';
    const workspace = workspaceFor(s.role, activePlan);
    const active = out.orgs.find((o) => o.org_id === s.orgId);
    const tokenOrgName = decodeToken(s.token)?.org_name ?? '';

    const u: User = {
      id: s.userId,
      name: out.profile.fullName,
      email: s.email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(out.profile.fullName)}&background=8B5CF6&color=fff`,
      role: workspace,
      company: active?.org_name ?? tokenOrgName ?? 'AetherDesign',
      title: titleCase(s.role),
    };

    setUser(u);
    setMembershipRole(s.role);
    setPlan(activePlan);
    setOrgs(out.orgs);
    setOrgName(active?.org_name ?? tokenOrgName);
    setRoleState(workspace);
    if (workspace === 'business') setBusinessSession(u); else setCreatorSession(u);
    setAuthState('ready');

    return { ok: true, needsOnboarding: false, workspace };
  }, []);

  const completeAuth = useCallback(async (): Promise<AuthResult> => {
    setLoading(true);
    setError(null);
    try {
      const out = await svc.completeAuth();
      const result = applyOutcome(out);
      if (!result.needsOnboarding) await refresh();
      return result;
    } catch (e) {
      setAuthState('signed_out');
      return { ok: false, needsOnboarding: false, workspace: null };
    } finally {
      setLoading(false);
    }
  }, [applyOutcome, refresh]);

  // Restore an existing Supabase session on first mount.
  useEffect(() => {
    void (async () => {
      if (!(await svc.hasSupabaseSession())) {
        setAuthState('signed_out');
        return;
      }
      await completeAuth();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signInWithGoogle = useCallback(async (intent: 'login' | 'signup' = 'login') => {
    try {
      await svc.signInWithGoogle(intent);   // redirects away
    } catch (e) {
      toast.error(messageFor(e));
    }
  }, []);

  const signInWithPassword = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      setLoading(true);
      setError(null);
      try {
        await svc.signInWithPassword(email, password);
        const result = await completeAuth();
        if (result.ok && !result.needsOnboarding) toast.success('Welcome back');
        return result;
      } catch (e) {
        const msg = messageFor(e);
        setError(msg);
        toast.error(msg);
        return { ok: false, needsOnboarding: false, workspace: null };
      } finally {
        setLoading(false);
      }
    }, [completeAuth]);

  const signUpWithPassword = useCallback(
    async (email: string, password: string, fullName: string): Promise<AuthResult> => {
      setLoading(true);
      setError(null);
      try {
        await svc.signUpWithPassword(email, password, fullName);
        return await completeAuth();
      } catch (e) {
        const msg = messageFor(e);
        setError(msg);
        toast.error(msg);
        return { ok: false, needsOnboarding: false, workspace: null };
      } finally {
        setLoading(false);
      }
    }, [completeAuth]);

  const completeOnboarding = useCallback(
    async (name: string, chosenPlan: 'free' | 'enterprise'): Promise<WorkspaceRole | null> => {
      setLoading(true);
      setError(null);
      try {
        await svc.bootstrapWorkspace(name, chosenPlan);
        const result = await completeAuth();
        toast.success(`${name} is ready`);
        return result.workspace;
      } catch (e) {
        const msg = messageFor(e);
        setError(msg);
        toast.error(msg);
        return null;
      } finally {
        setLoading(false);
      }
    }, [completeAuth]);

  const switchOrg = useCallback(async (orgId: string): Promise<boolean> => {
    setLoading(true);
    try {
      await svc.switchOrganization(orgId);
      const result = await completeAuth();
      return result.ok;
    } catch (e) {
      toast.error(messageFor(e));
      return false;
    } finally {
      setLoading(false);
    }
  }, [completeAuth]);

  const logout = useCallback(async () => {
    await svc.signOut();
    setAuthState('signed_out');
    setUser(defaultUser);
    setMembershipRole(null);
    setPlan(null);
    setOrgs([]);
    setOrgName('');
    setBusinessSession(null);
    setCreatorSession(null);
    setCampaigns([]);
    setGeneratedAssets([]);
    setBrandKitState(emptyBrandKit);
    toast.success('Signed out.');
  }, []);

  /** Switches the workspace view only. Does not change permissions. */
  const loginAsRole = useCallback((targetRole: WorkspaceRole) => {
    setRoleState(targetRole);
  }, []);

  const updateBrandKit = useCallback((updated: Partial<BrandKit>) => {
    setBrandKitState((prev) => ({ ...prev, ...updated, updatedAt: 'Just now' }));
    toast('Brand kit changes are local until Phase 4.', { icon: 'i' });
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

  const generateAsset = useCallback(() => {
    toast('AI generation arrives in Phase 5.', { icon: 'i' });
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

  // Recomputed whenever role or plan changes — no memo needed, it's a
  // handful of boolean comparisons.
  const can = capabilitiesFor(membershipRole ?? 'designer', plan ?? 'free');


  return (
    <AppContext.Provider value={{
      authState, membershipRole, plan, can, orgs, orgName,
      signInWithGoogle, signInWithPassword, signUpWithPassword,
      completeOnboarding, switchOrg, completeAuth, logout,
      role, setRole: loginAsRole, user, setUser,
      businessSession, creatorSession, loginAsRole,
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