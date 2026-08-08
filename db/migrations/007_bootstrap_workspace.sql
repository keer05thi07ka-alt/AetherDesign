-- ============================================================
-- 007 — Onboarding: create the first workspace for a new identity.
--
-- Takes a Supabase uid rather than a user_id, because wf-bootstrap
-- only has the Supabase identity at that point in the chain.
-- ============================================================

create or replace function bootstrap_workspace(
  p_supabase_uid uuid,
  p_email        text,
  p_full_name    text,
  p_org_name     text,
  p_plan         text default 'free'
) returns json
language plpgsql
security definer
as $$
declare
  v_identity json;
  v_user_id  uuid;
  v_org      json;
begin
  v_identity := resolve_identity(p_supabase_uid, p_email, p_full_name, null, null);
  if v_identity ? 'error' then
    return v_identity;
  end if;

  v_user_id := (v_identity->>'user_id')::uuid;

  -- Guard against a repeated request creating a second org.
  if exists (select 1 from memberships where user_id = v_user_id) then
    return json_build_object(
      'error','You already belong to a workspace','code','ALREADY_ONBOARDED');
  end if;

  v_org := create_organization(v_user_id, p_org_name, p_plan);
  if v_org ? 'error' then
    return v_org;
  end if;

  return json_build_object(
    'user_id',   v_user_id,
    'email',     v_identity->>'email',
    'full_name', v_identity->>'full_name',
    'org_id',    v_org->>'org_id',
    'org_name',  v_org->>'org_name',
    'plan',      v_org->>'plan',
    'role',      'owner'
  );

exception when others then
  return json_build_object('error', SQLERRM, 'code','DB_ERROR');
end $$;