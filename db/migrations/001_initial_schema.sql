-- ============================================================
-- AetherDesign — Initial Schema
-- Postgres 17.6 + pgvector 0.8.2
-- Embedding dimension: 768 (gemini-embedding-001, pinned)
-- ============================================================

create extension if not exists vector;
create extension if not exists pgcrypto;

-- ---------- ENUMS ----------
-- Postgres has no "create type if not exists" — guard each one so the
-- migration is safe to re-run.
do $$ begin
  create type membership_role as enum
    ('owner','brand_admin','marketing_manager','designer','approver');
exception when duplicate_object then null; end $$;

do $$ begin
  create type asset_status as enum
    ('draft','in_review','approved','rejected','archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type campaign_status as enum
    ('draft','active','paused','completed','archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type job_status as enum
    ('queued','retrieving','generating','storing','done','failed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type approval_decision as enum
    ('approved','rejected','changes_requested');
exception when duplicate_object then null; end $$;

-- ---------- TENANCY ----------
-- D8 fix: no tenant concept existed in the frontend model.
create table if not exists organizations (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  plan        text not null default 'free',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists users (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  full_name     text not null,
  avatar_url    text,
  password_hash text,
  auth_provider text not null default 'password',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- D1 fix: a user holds a role PER organization, not globally.
-- This is what SwitchWorkspaceModal in the frontend implies.
create table if not exists memberships (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references users(id) on delete cascade,
  org_id      uuid not null references organizations(id) on delete cascade,
  role        membership_role not null,
  created_at  timestamptz not null default now(),
  unique (user_id, org_id)
);

create index if not exists idx_memberships_user on memberships(user_id);
create index if not exists idx_memberships_org  on memberships(org_id);

-- ---------- BRAND ----------
-- D11 fix: frontend had 3 fixed colour fields. jsonb allows N colours,
-- N fonts, and multiple logo variants.
create table if not exists brand_kits (
  id                      uuid primary key default gen_random_uuid(),
  org_id                  uuid not null references organizations(id) on delete cascade,
  name                    text not null,
  tokens                  jsonb not null default '{}'::jsonb,
  guidelines_text         text,
  file_search_store_name  text,          -- Gemini File Search store, hybrid RAG
  created_by              uuid references users(id),
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists idx_brand_kits_org on brand_kits(org_id);

-- Chunked guidelines for pgvector retrieval
create table if not exists brand_chunks (
  id            uuid primary key default gen_random_uuid(),
  brand_kit_id  uuid not null references brand_kits(id) on delete cascade,
  org_id        uuid not null references organizations(id) on delete cascade,
  chunk_index   int  not null,
  content       text not null,
  embedding     vector(768),
  created_at    timestamptz not null default now()
);

create index if not exists idx_brand_chunks_kit on brand_chunks(brand_kit_id);
create index if not exists idx_brand_chunks_emb on brand_chunks
  using hnsw (embedding vector_cosine_ops);

-- ---------- CAMPAIGNS ----------
-- D7 fix: frontend embedded {name, avatar, role} as a blob. Now a real FK.
create table if not exists campaigns (
  id           uuid primary key default gen_random_uuid(),
  org_id       uuid not null references organizations(id) on delete cascade,
  name         text not null,
  brief        text,
  audience     text,
  platform     text,
  status       campaign_status not null default 'draft',
  deadline     timestamptz,
  brand_kit_id uuid references brand_kits(id) on delete set null,
  assigned_to  uuid references users(id) on delete set null,
  created_by   uuid not null references users(id),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_campaigns_org    on campaigns(org_id);
create index if not exists idx_campaigns_status on campaigns(org_id, status);

-- ---------- ASSETS ----------
-- D2 fix: campaign_id FK (frontend had no link at all)
-- D3 fix: status column (frontend had none)
-- D4 fix: current_version + asset_versions table
-- D5 fix: created_by
create table if not exists assets (
  id               uuid primary key default gen_random_uuid(),
  org_id           uuid not null references organizations(id) on delete cascade,
  campaign_id      uuid references campaigns(id) on delete set null,
  brand_kit_id     uuid references brand_kits(id) on delete set null,
  title            text not null,
  description      text,
  category         text,
  status           asset_status not null default 'draft',
  current_version  int not null default 1,
  width            int,
  height           int,
  storage_path     text,
  thumbnail_path   text,
  embedding        vector(768),
  quality_score    numeric(5,2),
  created_by       uuid not null references users(id),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists idx_assets_org      on assets(org_id);
create index if not exists idx_assets_campaign on assets(campaign_id);
create index if not exists idx_assets_status   on assets(org_id, status);
create index if not exists idx_assets_emb      on assets
  using hnsw (embedding vector_cosine_ops);

-- D4 fix: full version history with reproducibility metadata
create table if not exists asset_versions (
  id             uuid primary key default gen_random_uuid(),
  asset_id       uuid not null references assets(id) on delete cascade,
  org_id         uuid not null references organizations(id) on delete cascade,
  version_no     int  not null,
  storage_path   text,
  prompt         text,
  negative_prompt text,
  model          text,
  params         jsonb not null default '{}'::jsonb,
  locale         text default 'en',
  quality_score  numeric(5,2),
  created_by     uuid references users(id),
  created_at     timestamptz not null default now(),
  unique (asset_id, version_no)
);

create index if not exists idx_asset_versions_asset on asset_versions(asset_id);

-- ---------- WORKFLOW ----------
-- D6 fix: approvals now reference the asset. Frontend had them unlinked.
create table if not exists approvals (
  id                uuid primary key default gen_random_uuid(),
  org_id            uuid not null references organizations(id) on delete cascade,
  asset_id          uuid not null references assets(id) on delete cascade,
  asset_version_id  uuid references asset_versions(id) on delete set null,
  reviewer_id       uuid references users(id),
  decision          approval_decision,
  comment           text,
  requested_by      uuid not null references users(id),
  requested_at      timestamptz not null default now(),
  decided_at        timestamptz
);

create index if not exists idx_approvals_asset   on approvals(asset_id);
create index if not exists idx_approvals_pending on approvals(org_id) where decided_at is null;

-- ---------- GENERATION ----------
create table if not exists generation_jobs (
  id               uuid primary key default gen_random_uuid(),
  org_id           uuid not null references organizations(id) on delete cascade,
  campaign_id      uuid references campaigns(id) on delete set null,
  brand_kit_id     uuid references brand_kits(id) on delete set null,
  prompt           text not null,
  refined_prompt   text,
  status           job_status not null default 'queued',
  progress         int not null default 0,
  error_message    text,
  result_asset_id  uuid references assets(id) on delete set null,
  created_by       uuid not null references users(id),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists idx_jobs_org    on generation_jobs(org_id);
create index if not exists idx_jobs_status on generation_jobs(org_id, status);

-- ---------- TEMPLATES ----------
create table if not exists templates (
  id           uuid primary key default gen_random_uuid(),
  org_id       uuid references organizations(id) on delete cascade,
  title        text not null,
  category     text,
  spec         jsonb not null default '{}'::jsonb,
  preview_path text,
  is_public    boolean not null default false,
  created_at   timestamptz not null default now()
);

create index if not exists idx_templates_org on templates(org_id);

-- ---------- updated_at triggers ----------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
declare t text;
begin
  foreach t in array array[
    'organizations','users','brand_kits','campaigns',
    'assets','generation_jobs'
  ] loop
    execute format('drop trigger if exists trg_%s_updated on %s', t, t);
    execute format(
      'create trigger trg_%s_updated before update on %s
       for each row execute function set_updated_at()', t, t);
  end loop;
end $$;