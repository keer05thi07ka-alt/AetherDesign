/**
 * Feature gating.
 *
 * A single source of truth for what a user can see and do, derived from
 * their plan (what the organisation pays for) and their role (what they
 * are permitted to do within it).
 *
 * These are UI gates only. Authorisation is enforced server-side in
 * api_write(); this module exists so the interface doesn't offer actions
 * the backend will refuse.
 */

import type { MembershipRole } from '../types/api';

export type Plan = 'free' | 'pro' | 'enterprise';

export interface Capabilities {
  // creation — available to everyone
  generate: boolean;
  templates: boolean;
  assetLibrary: boolean;
  editor: boolean;
  schedule: boolean;

  // collaboration — paid plans only
  campaigns: boolean;
  brandKit: boolean;
  brandKitEdit: boolean;
  approvals: boolean;
  approvalDecide: boolean;
  analytics: boolean;
  members: boolean;

  // labels
  isSolo: boolean;
  workspaceLabel: string;
}

export function capabilitiesFor(role: MembershipRole, plan: Plan): Capabilities {
  const isTeam = plan !== 'free';

  return {
    generate: true,
    templates: true,
    assetLibrary: true,
    editor: true,
    schedule: true,

    campaigns: isTeam,
    brandKit: isTeam,
    brandKitEdit: isTeam && ['owner', 'brand_admin'].includes(role),
    approvals: isTeam,
    approvalDecide: isTeam && ['owner', 'brand_admin', 'approver'].includes(role),
    analytics: isTeam && ['owner', 'brand_admin', 'marketing_manager'].includes(role),
    members: isTeam && ['owner', 'brand_admin'].includes(role),

    isSolo: !isTeam,
    workspaceLabel: isTeam ? 'Business Workspace' : 'Creator Studio',
  };
}