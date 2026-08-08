/**
 * Translation between API types (mirroring Postgres) and the legacy UI
 * types the existing pages consume.
 *
 * This layer exists so pages can migrate to API types one at a time
 * instead of all at once. Delete a mapper when its last consumer is gone.
 */

import type {
  Campaign as ApiCampaign,
  Asset as ApiAsset,
  BrandKit as ApiBrandKit,
  Member as ApiMember,
  MembershipRole,
  CampaignStatus,
} from '../types/api';

import type {
  Campaign as UiCampaign,
  GeneratedAsset as UiAsset,
  BrandKit as UiBrandKit,
  User as UiUser,
  WorkspaceRole,
} from '../types';

// ---------- status ----------

const STATUS_TO_UI: Record<CampaignStatus, UiCampaign['status']> = {
  draft: 'Draft',
  active: 'Active',
  paused: 'Under Review',
  completed: 'Completed',
  archived: 'Completed',
};

const STATUS_TO_API: Record<UiCampaign['status'], CampaignStatus> = {
  Draft: 'draft',
  Active: 'active',
  'Under Review': 'paused',
  Completed: 'completed',
};

export function toApiStatus(s: UiCampaign['status']): CampaignStatus {
  return STATUS_TO_API[s] ?? 'draft';
}

// ---------- dates ----------

export function relativeTime(iso: string | null): string {
  if (!iso) return 'Never';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return 'Never';

  const diff = Date.now() - then;
  const mins = Math.round(diff / 60_000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;

  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;

  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}d ago`;

  return new Date(then).toLocaleDateString();
}

function formatDeadline(iso: string | null): string {
  if (!iso) return 'No deadline';
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? 'No deadline'
    : d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

// ---------- campaigns ----------

export function mapCampaign(
  c: ApiCampaign,
  members: ApiMember[] = [],
  assetCount = 0,
): UiCampaign {
  const assignee = members.find((m) => m.id === c.assigned_to);

  return {
    id: c.id,
    name: c.name,
    description: c.brief ?? '',
    audience: c.audience ?? '',
    industry: '',
    platform: c.platform ?? '',
    assignedCreator: {
      name: assignee?.full_name ?? 'Unassigned',
      avatar: assignee?.avatar_url ?? '',
      role: assignee?.role ?? '',
    },
    deadline: formatDeadline(c.deadline),
    status: STATUS_TO_UI[c.status] ?? 'Draft',
    progress: c.status === 'completed' ? 100 : c.status === 'active' ? 45 : 0,
    assetsCount: assetCount,
    createdAt: relativeTime(c.created_at),
  };
}

// ---------- assets ----------

export function mapAsset(a: ApiAsset): UiAsset {
  const w = a.width ?? 0;
  const h = a.height ?? 0;

  return {
    id: a.id,
    title: a.title,
    prompt: a.description ?? '',
    platform: a.category ?? '',
    audience: '',
    style: '',
    imageUrl: resolveAssetUrl(a),
    createdAt: relativeTime(a.created_at),
    isFavorite: false,
    category: a.category ?? 'uncategorised',
    dimensions: w && h ? `${w}x${h}` : '—',
    aspectRatio: w && h ? aspectRatio(w, h) : '1:1',
    tags: [a.status, `v${a.current_version}`],
  };
}

/**
 * Resolve an asset's display URL.
 *
 * Until Phase 4 uploads real files, storage_path holds a logical path
 * rather than a URL. Fall back to a deterministic placeholder keyed on
 * the asset id, so the same asset always renders the same image.
 */
function resolveAssetUrl(a: ApiAsset): string {
  const path = a.storage_path ?? a.thumbnail_path;
  if (path && /^(https?:|data:)/.test(path)) return path;

  const w = a.width ?? 800;
  const h = a.height ?? 800;
  const seed = a.id.replace(/-/g, '').slice(-12);
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

function aspectRatio(w: number, h: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const d = gcd(w, h) || 1;
  return `${w / d}:${h / d}`;
}

// ---------- brand kit ----------

export function mapBrandKit(b: ApiBrandKit): UiBrandKit {
  const colors = b.tokens?.colors ?? {};
  const fonts = b.tokens?.fonts ?? {};
  const logos = b.tokens?.logos ?? {};
  const tone = b.tokens?.tone ?? [];

  return {
    id: b.id,
    name: b.name,
    primaryColor: colors.primary ?? '#8B5CF6',
    secondaryColor: colors.secondary ?? '#F5E6DC',
    accentColor: colors.accent ?? '#C9A227',
    typography: fonts.heading ?? 'Inter',
    tone: tone.join(', '),
    logoUrl: logos.light ?? logos.mark ?? '',
    guidelines: b.guidelines_length
      ? `${b.guidelines_length} characters of brand guidelines on file.`
      : 'No guidelines uploaded yet.',
    updatedAt: relativeTime(b.created_at),
  };
}

// ---------- users ----------

export function workspaceFor(
  role: MembershipRole,
  plan: 'free' | 'pro' | 'enterprise' = 'free',
): WorkspaceRole {
  if (plan === 'free') return 'creator';
  return role === 'designer' ? 'creator' : 'business';
}

/** @deprecated Use workspaceFor(role, plan). */
export function roleToWorkspace(role: MembershipRole): WorkspaceRole {
  return role === 'designer' ? 'creator' : 'business';
}

export function mapMemberToUser(m: ApiMember, orgName = ''): UiUser {
  return {
    id: m.id,
    name: m.full_name,
    email: m.email,
    avatar: m.avatar_url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(m.full_name)}&background=8B5CF6&color=fff`,
    role: roleToWorkspace(m.role),
    company: orgName,
    title: m.role.replace(/_/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase()),
  };
}