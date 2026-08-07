/**
 * Resource services. Pages and context call these, never apiClient directly.
 * Each returns UI-shaped data so existing components need no changes.
 */

import * as api from '../lib/apiClient';
import type { Campaign as ApiCampaign, Member, MembershipRole } from '../types/api';
import type { Campaign as UiCampaign, GeneratedAsset, BrandKit as UiBrandKit } from '../types';
import { mapCampaign, mapAsset, mapBrandKit, toApiStatus } from './mappers';

// ---------- campaigns ----------

export async function fetchCampaigns(): Promise<UiCampaign[]> {
  const [campaigns, assets, members] = await Promise.all([
    api.list('campaigns'),
    api.list('assets'),
    api.list('members'),
  ]);

  const counts = new Map<string, number>();
  for (const a of assets) {
    if (a.campaign_id) counts.set(a.campaign_id, (counts.get(a.campaign_id) ?? 0) + 1);
  }

  return campaigns.map((c) => mapCampaign(c, members, counts.get(c.id) ?? 0));
}

export async function createCampaign(input: {
  name: string;
  description?: string;
  audience?: string;
  platform?: string;
  status?: UiCampaign['status'];
  deadline?: string;
}): Promise<UiCampaign> {
  const created = await api.write('campaigns', 'create', {
    name: input.name,
    brief: input.description ?? null,
    audience: input.audience ?? null,
    platform: input.platform ?? null,
    status: toApiStatus(input.status ?? 'Draft'),
    deadline: input.deadline ?? null,
  } as Partial<ApiCampaign>);

  return mapCampaign(created);
}

export async function deleteCampaign(id: string): Promise<void> {
  await api.write('campaigns', 'delete', {}, id);
}

// ---------- assets ----------

export async function fetchAssets(): Promise<GeneratedAsset[]> {
  const assets = await api.list('assets');
  return assets.map(mapAsset);
}

export async function deleteAsset(id: string): Promise<void> {
  await api.write('assets', 'delete', {}, id);
}

// ---------- brand kit ----------

export async function fetchBrandKit(): Promise<UiBrandKit | null> {
  const kits = await api.list('brand_kits');
  return kits.length ? mapBrandKit(kits[0]) : null;
}

// ---------- members ----------

export async function fetchMembers(): Promise<Member[]> {
  return api.list('members');
}

// ---------- auth ----------

export interface LoginResult {
  userId: string;
  orgId: string;
  role: MembershipRole;
  email: string;
  fullName: string;
  avatarUrl: string | null;
}

export async function signIn(email: string, password: string): Promise<LoginResult> {
  const session = await api.login(email, password);

  // The token carries identity; members gives us display name and avatar.
  let me: Member | undefined;
  try {
    const members = await api.list('members');
    me = members.find((m) => m.id === session.userId);
  } catch {
    // Non-fatal — fall back to the email local part.
  }

  return {
    userId: session.userId,
    orgId: session.orgId,
    role: session.role,
    email: session.email,
    fullName: me?.full_name ?? session.email.split('@')[0],
    avatarUrl: me?.avatar_url ?? null,
  };
}

export async function register(input: {
  fullName: string;
  email: string;
  orgName: string;
  password: string;
}): Promise<LoginResult> {
  const session = await api.signUp({
    full_name: input.fullName,
    email: input.email,
    org_name: input.orgName,
    password: input.password,
  });

  return {
    userId: session.userId,
    orgId: session.orgId,
    role: session.role,
    email: session.email,
    fullName: input.fullName,
    avatarUrl: null,
  };
}

export function signOut(): void {
  api.logout();
}

export function restore(): ReturnType<typeof api.restoreSession> {
  return api.restoreSession();
}