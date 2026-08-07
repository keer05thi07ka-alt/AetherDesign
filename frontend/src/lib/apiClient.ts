import type {
  ApiError, JwtClaims, MembershipRole, ResourceMap, ResourceName, Session, WriteOp,
} from '../types/api';

const BASE = import.meta.env.VITE_API_BASE_URL as string;
if (!BASE) console.error('VITE_API_BASE_URL is not set — check frontend/.env.local');

const TOKEN_KEY = 'aether.token';

// ---------- token ----------

export function getToken(): string | null {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}
export function setToken(token: string): void {
  try { localStorage.setItem(TOKEN_KEY, token); } catch { /* private mode */ }
}
export function clearToken(): void {
  try { localStorage.removeItem(TOKEN_KEY); } catch { /* noop */ }
}

/** Decode without verifying — the server verifies; this is for UI only. */
export function decodeToken(token: string): JwtClaims | null {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as JwtClaims;
  } catch {
    return null;
  }
}

export function sessionFromToken(token: string): Session | null {
  const c = decodeToken(token);
  if (!c?.sub || !c.org_id || !c.role) return null;
  if (c.exp * 1000 <= Date.now()) return null;
  return {
    token,
    userId: c.sub,
    orgId: c.org_id,
    role: c.role as MembershipRole,
    email: c.email,
    expiresAt: c.exp * 1000,
  };
}

// ---------- errors ----------

export class ApiRequestError extends Error {
  readonly payload: ApiError;
  readonly status?: number;

  constructor(payload: ApiError, status?: number) {
    super(payload.error);
    this.name = 'ApiRequestError';
    this.payload = payload;
    this.status = status;
  }
}

function isApiError(v: unknown): v is ApiError {
  return typeof v === 'object' && v !== null && 'error' in v;
}

// ---------- transport ----------

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  let res: Response;

  try {
    res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init.headers ?? {}),
      },
    });
  } catch (e) {
    throw new ApiRequestError(
      { error: 'Network request failed. Check your connection.', code: 'NETWORK' });
  }

  if (res.status === 401) {
    clearToken();
    throw new ApiRequestError(
      { error: 'Session expired. Please sign in again.', code: 'UNAUTHORIZED' }, 401);
  }

  const text = await res.text();
  let body: unknown;
  try { body = JSON.parse(text); }
  catch {
    throw new ApiRequestError(
      { error: `Unexpected response: ${text.slice(0, 120)}`, code: 'UNKNOWN' }, res.status);
  }

  if (isApiError(body)) throw new ApiRequestError(body as ApiError, res.status);
  return body as T;
}

// ---------- envelopes ----------
// Read:  { status, data: { items: [ { json: { data: [...] } } ] }, metadata }
// Write: { result: "<JSON string>" }

interface ReadEnvelope<T> {
  status?: string;
  data?: { items?: Array<{ json?: { data?: T[] } }> };
  result?: null;
}

function unwrapRead<T>(env: ReadEnvelope<T>): T[] {
  const rows = env?.data?.items?.[0]?.json?.data;
  if (!Array.isArray(rows)) {
    // result:null means the workflow ran but emitted nothing — usually
    // an undeployed workflow or a failed query node.
    throw new ApiRequestError(
      { error: 'Backend returned no data. The workflow may be paused.', code: 'UNKNOWN' });
  }
  return rows;
}

function unwrapWrite<T>(env: { result?: string }): T {
  if (typeof env?.result !== 'string') {
    throw new ApiRequestError(
      { error: 'Backend returned no result. The workflow may be paused.', code: 'UNKNOWN' });
  }
  const parsed = JSON.parse(env.result) as T | ApiError;
  if (isApiError(parsed)) throw new ApiRequestError(parsed);
  return parsed as T;
}

// ---------- public API ----------

export async function login(email: string, password: string): Promise<Session> {
  const body = await request<{ token?: string }>('/identity/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (!body.token) {
    throw new ApiRequestError(
      { error: 'Invalid email or password', code: 'INVALID_CREDENTIALS' });
  }
  const session = sessionFromToken(body.token);
  if (!session) {
    throw new ApiRequestError(
      { error: 'Received a malformed token from the server.', code: 'UNKNOWN' });
  }
  setToken(body.token);
  return session;
}

export function logout(): void {
  clearToken();
}

export function restoreSession(): Session | null {
  const token = getToken();
  if (!token) return null;
  const session = sessionFromToken(token);
  if (!session) { clearToken(); return null; }
  return session;
}

export async function list<R extends ResourceName>(
  resource: R,
  params?: Record<string, string>,
): Promise<ResourceMap[R][]> {
  const qs = params ? `?${new URLSearchParams(params)}` : '';
  const env = await request<ReadEnvelope<ResourceMap[R]>>(`/api/${resource}${qs}`);
  return unwrapRead(env);
}

export async function getOne<R extends ResourceName>(
  resource: R,
  id: string,
): Promise<ResourceMap[R] | null> {
  const rows = await list(resource, { id });
  return rows[0] ?? null;
}

export async function write<R extends ResourceName>(
  resource: R,
  op: WriteOp,
  data: Partial<ResourceMap[R]> = {},
  id?: string,
): Promise<ResourceMap[R]> {
  const env = await request<{ result?: string }>(`/api/${resource}`, {
    method: 'POST',
    body: JSON.stringify({ op, id, data }),
  });
  return unwrapWrite<ResourceMap[R]>(env);
}