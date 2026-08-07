-- ============================================================
-- 005 — Identity resolution and organisation bootstrap
--
-- Called by wf-exchange and wf-bootstrap after the Supabase token
-- has been verified via /auth/v1/user. These functions assume the
-- caller is already authenticated — they never verify tokens.
-- ============================================================

-- ------------------------------------------------------------
-- resolve_identity
--   Find or create the application user for a Supabase identity,
--   then return their memberships.
--
--   p_org_id, when supplied, narrows the result to that one org
--   and returns nothing if the user is not a member — which is
--   how org switching is authorised.
-- ------------------------------------------------------------
create or replace function resolve_identity(
  p_supabase_uid uuid,
  p_email        text,
  p_full_name    text default null,
  p_avatar_url   text default null,
  p_org_id       uuid default null
) returns json
language plpgsql
security definer
as $$
declare
  v_user      users%rowtype;
  v_members   json;
  v_count     int;
begin
  if p_supabase_uid is null or p_email is null then
    return json_build_object('error','Missing identity','code','BAD_REQUEST');
  end if;

  -- 1. Already linked?
  select * into v_user from users where supabase_user_id = p_supabase_uid;

  -- 2. Pre-existing account with the same email (seed users, or a user
  --    who previously signed up with a password). Link it.
  if not found then
    select * into v_user from users where email = lower(p_email);
    if found then
      update users
         set supabase_user_id = p_supabase_uid,
             full_name  = coalesce(nullif(p_full_name,''), full_name),
             avatar_url = coalesce(nullif(p_avatar_url,''), avatar_url)
       where id = v_user.id
      returning * into v_user;
    end if;
  end if;

  -- 3. Brand new person.
  if v_user.id is null then
    insert into users (email, full_name, avatar_url, supabase_user_id, auth_provider)
    values (lower(p_email),
            coalesce(nullif(p_full_name,''), split_part(p_email,'@',1)),
            nullif(p_avatar_url,''),
            p_supabase_uid,
            'supabase')
    returning * into v_user;
  end if;

  -- 4. Memberships, optionally narrowed to one org.
  select coalesce(json_agg(t), '[]'::json), count(*)
    into v_members, v_count
  from (
    select m.org_id,
           o.name  as org_name,
           o.slug  as org_slug,
           o.plan  as plan,
           m.role::text as role
    from memberships m
    join organizations o on o.id = m.org_id
    where m.user_id = v_user.id
      and (p_org_id is null or m.org_id = p_org_id)
    order by o.name
  ) t;

  return json_build_object(
    'user_id',     v_user.id,
    'email',       v_user.email,
    'full_name',   v_user.full_name,
    'avatar_url',  v_user.avatar_url,
    'memberships', v_members,
    'count',       v_count
  );

exception when others then
  return json_build_object('error', SQLERRM, 'code','DB_ERROR');
end $$;


-- ------------------------------------------------------------
-- create_organization
--   Onboarding. Creates an org and makes the caller its owner.
--   Solo users and teams take the same path; only plan differs.
-- ------------------------------------------------------------
create or replace function create_organization(
  p_user_id  uuid,
  p_org_name text,
  p_plan     text default 'free'
) returns json
language plpgsql
security definer
as $$
declare
  v_org_id uuid;
  v_slug   text;
begin
  if p_user_id is null or nullif(trim(p_org_name),'') is null then
    return json_build_object('error','Workspace name is required','code','BAD_REQUEST');
  end if;

  if p_plan not in ('free','pro','enterprise') then
    return json_build_object('error','Unknown plan','code','BAD_REQUEST');
  end if;

  if not exists (select 1 from users where id = p_user_id) then
    return json_build_object('error','Unknown user','code','NOT_FOUND');
  end if;

  -- Random suffix so two companies with the same name don't collide.
  v_slug := lower(regexp_replace(trim(p_org_name), '[^a-zA-Z0-9]+', '-', 'g'))
            || '-' || substr(md5(random()::text), 1, 6);

  insert into organizations (name, slug, plan)
  values (trim(p_org_name), v_slug, p_plan)
  returning id into v_org_id;

  insert into memberships (user_id, org_id, role)
  values (p_user_id, v_org_id, 'owner'::membership_role);

  return json_build_object(
    'org_id',   v_org_id,
    'org_name', trim(p_org_name),
    'org_slug', v_slug,
    'plan',     p_plan,
    'role',     'owner'
  );

exception when others then
  return json_build_object('error', SQLERRM, 'code','DB_ERROR');
end $$;