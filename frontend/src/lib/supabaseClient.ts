/**
 * Supabase client — identity only.
 *
 * Supabase handles authentication (Google OAuth, email/password, bcrypt,
 * password reset). It is NOT used for data access: all application data
 * goes through the Workbench API via apiClient.ts.
 *
 * The Supabase token proves identity. It is exchanged at
 * POST /identity/exchange for an AetherDesign session token carrying
 * org_id and role.
 */

import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

if (!url || !key) {
  console.error(
    'Supabase env vars missing. Check VITE_SUPABASE_URL and ' +
    'VITE_SUPABASE_PUBLISHABLE_KEY in frontend/.env.local'
  );
}

export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,   // needed for the Google OAuth callback
  },
});

/** Current Supabase access token, or null if signed out. */
export async function getSupabaseToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}