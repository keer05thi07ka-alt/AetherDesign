/**
 * Authentication client.
 *
 * Supabase owns identity: Google OAuth, email/password, bcrypt hashing,
 * password reset. It does NOT own application data.
 *
 * A Supabase token proves "this is a verified human". It is exchanged at
 * /identity/exchange for an AetherDesign session token carrying org_id,
 * role, and plan — which is what every API call uses.
 */

import { supabase } from './supabaseClient';
import {
  setToken, clearToken, getToken, sessionFromToken, decodeToken, ApiRequestError,
} from './apiClient';
import type { MembershipRole, Session } from '../types/api';

const BASE = import.meta.env.VITE_API_BASE_URL as string;

// ---------- shapes ----------

export interface Membership {
  org_id: string;
  org_name: string;
  org_slug: string;
  plan: 'free' | 'pro' | 'enterprise';
  role: MembershipRole;
}

export interface AuthOutcome {
  /** True when the user has no workspace yet and must onboard. */
  needsOnboarding: boolean;
  session: Session | null;
  /** All workspaces the user belongs to. Length > 1 enables the switcher. */
  orgs: Membership[];
  profile: { userId: string; email: string; fullName: string };
}

// ---------- transport ----------

async function post<T>(path: string, body: unknown, bearer?: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiRequestError(
      { error: 'Network request failed. Check your connection.', code: 'NETWORK' });
  }

  const text = await res.text();
  let parsed: unknown;
  try { parsed = JSON.parse(text); }
  catch {
    throw new ApiRequestError(
      { error: `Unexpected response: ${text.slice(0, 120)}`, code: 'UNKNOWN' }, res.status);
  }

  const obj = parsed as Record<string, unknown>;

  if (typeof obj.error === 'string') {
    throw new ApiRequestError(
      { error: obj.error, code: (obj.code as never) ?? 'UNKNOWN' }, res.status);
  }

  // A workflow that ran but emitted nothing — usually an undeployed workflow.
  if (obj.result === null && obj.success === true) {
    throw new ApiRequestError(
      { error: 'The service is temporarily unavailable.', code: 'UNKNOWN' }, res.status);
  }

  return parsed as T;
}

function parseOrgs(raw: unknown): Membership[] {
  if (typeof raw !== 'string') return [];
  try { return JSON.parse(raw) as Membership[]; } catch { return []; }
}

// ---------- Supabase identity ----------

/** Redirects to Google. The browser returns to /auth/callback. */
export async function signInWithGoogle(intent: 'login' | 'signup' = 'login'): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback?intent=${intent}` },
  });
  if (error) {
    throw new ApiRequestError({ error: error.message, code: 'UNKNOWN' });
  }
}

export async function signInWithPassword(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error) {
    const invalid = /invalid login credentials/i.test(error.message);
    throw new ApiRequestError({
      error: invalid ? 'No account found with that email and password.' : error.message,
      code: invalid ? 'INVALID_CREDENTIALS' : 'UNKNOWN',
    });
  }
}

export async function signUpWithPassword(
  email: string, password: string, fullName: string,
): Promise<void> {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) {
    const exists = /already registered|already exists/i.test(error.message);
    throw new ApiRequestError({
      error: exists ? 'An account with that email already exists. Try logging in.' : error.message,
      code: 'UNKNOWN',
    });
  }
  if (!data.session) {
    throw new ApiRequestError({
      error: 'Check your email to confirm your account before signing in.',
      code: 'UNKNOWN',
    });
  }
}

export async function requestPasswordReset(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw new ApiRequestError({ error: error.message, code: 'UNKNOWN' });
}

export async function updatePassword(newPassword: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new ApiRequestError({ error: error.message, code: 'UNKNOWN' });
}

// ---------- exchange ----------

/**
 * Trade the current Supabase session for an AetherDesign session token.
 * Call this after any successful Supabase sign-in, and on app start.
 */
/**
 * Trade the current Supabase session for an AetherDesign session token.
 *
 * The workflow returns only { token } — the JWT node replaces the item,
 * so any sibling fields are lost. Everything is therefore derived from
 * the signed claims, which is the more reliable source anyway.
 *
 * A provisional token (onboarding) carries no org_id. That absence is
 * the distinction, not a flag field.
 */
export async function completeAuth(): Promise<AuthOutcome> {
  const { data } = await supabase.auth.getSession();
  const supabaseJwt = data.session?.access_token;

  if (!supabaseJwt) {
    throw new ApiRequestError({ error: 'Not signed in.', code: 'UNAUTHORIZED' });
  }

  const res = await post<Record<string, string>>('/identity/exchange',
    { supabase_jwt: supabaseJwt });

  const claims = decodeToken(res.token);
  if (!claims?.sub) {
    throw new ApiRequestError(
      { error: 'Received a malformed token from the server.', code: 'UNKNOWN' });
  }

  // Supabase knows the display name; our token does not carry it.
  const meta = data.session?.user?.user_metadata ?? {};
  const fullName =
    (meta.full_name as string) ||
    (meta.name as string) ||
    res.full_name ||
    claims.email.split('@')[0];

  setToken(res.token);

  // No org_id => provisional token => needs onboarding.
  if (!claims.org_id) {
    return {
      needsOnboarding: true,
      session: null,
      orgs: [],
      profile: { userId: claims.sub, email: claims.email, fullName },
    };
  }

  const session = sessionFromToken(res.token);
  if (!session) {
    throw new ApiRequestError(
      { error: 'Received a malformed token from the server.', code: 'UNKNOWN' });
  }

  return {
    needsOnboarding: false,
    session,
    orgs: parseOrgs(res.orgs),
    profile: { userId: claims.sub, email: claims.email, fullName },
  };
}

/** Onboarding. Uses the provisional token issued by completeAuth. */
export async function bootstrapWorkspace(
  orgName: string,
  plan: 'free' | 'enterprise',
): Promise<Session> {
  const provisional = getToken();
  if (!provisional) {
    throw new ApiRequestError({ error: 'Session expired. Sign in again.', code: 'UNAUTHORIZED' });
  }

  const res = await post<Record<string, string>>(
    '/identity/bootstrap', { org_name: orgName, plan }, provisional);

  const session = sessionFromToken(res.token);
  if (!session) {
    throw new ApiRequestError(
      { error: 'Received a malformed token from the server.', code: 'UNKNOWN' });
  }
  setToken(res.token);
  return session;
}

/** Switch to another workspace the user belongs to. */
export async function switchOrganization(orgId: string): Promise<Session> {
  const current = getToken();
  if (!current) {
    throw new ApiRequestError({ error: 'Session expired. Sign in again.', code: 'UNAUTHORIZED' });
  }

  const res = await post<Record<string, string>>(
    '/identity/switch', { org_id: orgId }, current);

  const session = sessionFromToken(res.token);
  if (!session) {
    throw new ApiRequestError(
      { error: 'Received a malformed token from the server.', code: 'UNKNOWN' });
  }
  setToken(res.token);
  return session;
}

// ---------- session lifecycle ----------

export async function signOut(): Promise<void> {
  clearToken();
  await supabase.auth.signOut();
}

/** True when Supabase still holds a valid session (survives page reload). */
export async function hasSupabaseSession(): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
}