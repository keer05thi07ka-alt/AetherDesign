-- ============================================================
-- 007 — Onboarding: create the first workspace.
--
-- Takes a user_id from a VERIFIED provisional session token,
-- so no Supabase round-trip is needed inside the workflow.
-- ============================================================
drop function if exists bootstrap_workspace(uuid, text, text, text, text);
create or replace function bootstrap_workspace(
  p_user_id  uuid,
  p_org_name text,
  p_plan     text default 'free'
) returns json
language plpgsql
security definer
as $$
declare
  v_user users%rowtype;
  v_org  json;
begin
  select * into v_user from users where id = p_user_id;
  if not found then
    return json_build_object('error','Unknown user','code','NOT_FOUND');
  end if;

  -- Guard against a repeated request creating a second org.
  if exists (select 1 from memberships where user_id = p_user_id) then
    return json_build_object(
      'error','You already belong to a workspace','code','ALREADY_ONBOARDED');
  end if;

  v_org := create_organization(p_user_id, p_org_name, p_plan);
  if v_org ? 'error' then
    return v_org;
  end if;

  return json_build_object(
    'user_id',    v_user.id,
    'email',      v_user.email,
    'full_name',  v_user.full_name,
    'avatar_url', v_user.avatar_url,
    'org_id',     v_org->>'org_id',
    'org_name',   v_org->>'org_name',
    'plan',       v_org->>'plan',
    'role',       'owner'
  );

exception when others then
  return json_build_object('error', SQLERRM, 'code','DB_ERROR');
end $$;