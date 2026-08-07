-- ============================================================
-- 003 — Email format constraint
--
-- The browser's type="email" check can be bypassed by calling the
-- API directly, so format validation belongs at the database.
-- ============================================================

-- Normalise any existing rows before adding the constraint.
update users set email = lower(trim(email));

alter table users
  drop constraint if exists users_email_format;

alter table users
  add constraint users_email_format
  check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');