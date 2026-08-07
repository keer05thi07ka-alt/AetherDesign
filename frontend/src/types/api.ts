/**
 * API types — mirror the PostgreSQL schema exactly.
 * Source of truth: db/migrations/001_initial_schema.sql
 *
 * Kept separate from types/index.ts (the legacy UI types) so the
 * migration can happen page by page instead of all at once.
 */

// ---------- enums (match Postgres) ----------

export type MembershipRole =
  | 'owner'
  | 'brand_admin'
  | 'marketing_manager'
  | 'designer'
  | 'approver';

export type AssetStatus =
  | 'draft' | 'in_review' | 'approved' | 'rejected' | 'archived';

export type CampaignStatus =
  | 'draft' | 'active' | 'paused' | 'completed' | 'archived';

export type JobStatus =
  | 'queued' | 'retrieving' | 'generating' | 'storing' | 'done' | 'failed';

export type ApprovalDecision =
  | 'approved' | 'rejected' | 'changes_requested';

/**
 * Workspace is a VIEW derived from role, not a role itself.
 * The frontend's two-workspace UI maps onto five real roles.
 */
export type Workspace = 'business' | 'creator';

export function workspaceForRole(role: MembershipRole): Workspace {
  return role === 'designer' ? 'creator' : 'business';
}

// ---------- auth ----------

export interface JwtClaims {
  sub: string;
  org_id: string;
  role: MembershipRole;
  email: string;
  exp: number;
  iat: number;
}

export interface Session {
  token: string;
  userId: string;
  orgId: string;
  role: MembershipRole;
  email: string;
  expiresAt: number;
}

// ---------- resources ----------

export interface Campaign {
  id: string;
  name: string;
  brief: string | null;
  audience: string | null;
  platform: string | null;
  status: CampaignStatus;
  deadline: string | null;
  brand_kit_id: string | null;
  assigned_to: string | null;
  created_by: string;
  created_at: string;
}

export interface Asset {
  id: string;
  campaign_id: string | null;
  brand_kit_id: string | null;
  title: string;
  description: string | null;
  category: string | null;
  status: AssetStatus;
  current_version: number;
  width: number | null;
  height: number | null;
  storage_path: string | null;
  thumbnail_path: string | null;
  quality_score: number | null;
  created_by: string;
  created_at: string;
}

export interface AssetVersion {
  id: string;
  asset_id: string;
  version_no: number;
  storage_path: string | null;
  prompt: string | null;
  negative_prompt: string | null;
  model: string | null;
  params: Record<string, unknown>;
  locale: string | null;
  quality_score: number | null;
  created_by: string | null;
  created_at: string;
}

export interface BrandTokens {
  colors?: Record<string, string>;
  fonts?: Record<string, string>;
  logos?: Record<string, string>;
  spacing?: Record<string, number>;
  tone?: string[];
}

export interface BrandKit {
  id: string;
  name: string;
  tokens: BrandTokens;
  guidelines_length: number;
  created_by: string | null;
  created_at: string;
}

export interface Approval {
  id: string;
  asset_id: string;
  asset_version_id: string | null;
  reviewer_id: string | null;
  decision: ApprovalDecision | null;
  comment: string | null;
  requested_by: string;
  requested_at: string;
  decided_at: string | null;
}

export interface GenerationJob {
  id: string;
  campaign_id: string | null;
  brand_kit_id: string | null;
  prompt: string;
  refined_prompt: string | null;
  status: JobStatus;
  progress: number;
  error_message: string | null;
  result_asset_id: string | null;
  created_by: string;
  created_at: string;
}

export interface Template {
  id: string;
  title: string;
  category: string | null;
  spec: Record<string, unknown>;
  preview_path: string | null;
  is_public: boolean;
  created_at: string;
}

export interface Member {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: MembershipRole;
}

// ---------- resource name → row type ----------

export interface ResourceMap {
  campaigns: Campaign;
  assets: Asset;
  asset_versions: AssetVersion;
  brand_kits: BrandKit;
  approvals: Approval;
  generation_jobs: GenerationJob;
  templates: Template;
  members: Member;
}

export type ResourceName = keyof ResourceMap;
export type WriteOp = 'create' | 'update' | 'delete';

export interface ApiError {
  error: string;
  code: 'FORBIDDEN' | 'NOT_FOUND' | 'BAD_RESOURCE' | 'DB_ERROR'
      | 'INVALID_CREDENTIALS' | 'UNAUTHORIZED' | 'NETWORK' | 'UNKNOWN';
}