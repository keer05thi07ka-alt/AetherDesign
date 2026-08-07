-- ============================================================
-- 004 — Link application users to Supabase Auth identities
--
-- Supabase Auth owns credentials (bcrypt, Google OAuth, reset flows).
-- public.users owns application identity: name, avatar, memberships.
-- supabase_user_id is the join between them.
-- ============================================================

alter table users
  add column if not exists supabase_user_id uuid;

create unique index if not exists idx_users_supabase_uid
  on users(supabase_user_id)
  where supabase_user_id is not null;

-- Credentials now live in Supabase, not here.
alter table users
  alter column password_hash drop not null;

comment on column users.supabase_user_id is
  'auth.users.id from Supabase Auth. Set on first exchange.';
comment on column users.password_hash is
  'DEPRECATED. Legacy SHA-256 hashes from wf1-login. Supabase Auth owns
   credentials now. Retained only until seed users are migrated.';