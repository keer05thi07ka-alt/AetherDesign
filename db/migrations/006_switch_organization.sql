-- ============================================================
-- 006 — Organisation switching
--
-- Called by wf-switch with a user_id taken from the VERIFIED
-- session token. Returns nothing if the user is not a member of
-- the requested org, which is what makes switching unforgeable.
-- ============================================================

create or replace function switch_organization(
  p_user_id uuid,
  p_org_id  uuid
) returns json
language plpgsql
security definer
as $$
declare
  v_row json;
begin
  select json_build_object(
           'user_id',    u.id,
           'email',      u.email,
           'full_name',  u.full_name,
           'avatar_url', u.avatar_url,
           'org_id',     o.id,
           'org_name',   o.name,
           'org_slug',   o.slug,
           'plan',       o.plan,
           'role',       m.role::text
         )
    into v_row
  from memberships m
  join organizations o on o.id = m.org_id
  join users u         on u.id = m.user_id
  where m.user_id = p_user_id
    and m.org_id  = p_org_id;

  if v_row is null then
    return json_build_object(
      'error','You are not a member of that workspace','code','NOT_FOUND');
  end if;

  return v_row;

exception when others then
  return json_build_object('error', SQLERRM, 'code','DB_ERROR');
end $$;