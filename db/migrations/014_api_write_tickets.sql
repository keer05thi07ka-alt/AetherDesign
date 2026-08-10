-- ============================================================
-- api_write() — single entry point for all write operations.
-- Enforces org scoping and role permissions inside the database.
-- Called by WF-3 with claims taken from the verified JWT.
-- ============================================================

create or replace function api_write(
  p_org_id   uuid,
  p_user_id  uuid,
  p_role     text,
  p_resource text,
  p_op       text,
  p_id       uuid,
  p_data     jsonb
) returns json
language plpgsql
security definer
as $$
declare
  v_row json;
  v_allowed boolean := false;
begin
  -- ---------- permission matrix ----------
  v_allowed := case
    when p_resource = 'campaigns' and p_op in ('create','update')
      then p_role in ('marketing_manager','brand_admin','owner')
    when p_resource = 'campaigns' and p_op = 'delete'
      then p_role in ('brand_admin','owner')

    when p_resource = 'assets' and p_op in ('create','update')
      then p_role in ('designer','marketing_manager','brand_admin','owner')
    when p_resource = 'assets' and p_op = 'delete'
      then p_role in ('brand_admin','owner')

    when p_resource = 'brand_kits' and p_op in ('create','update')
      then p_role in ('brand_admin','owner')
    when p_resource = 'brand_kits' and p_op = 'delete'
      then p_role = 'owner'

    when p_resource = 'templates' and p_op in ('create','update')
      then p_role in ('brand_admin','owner')
    when p_resource = 'templates' and p_op = 'delete'
      then p_role = 'owner'

    when p_resource = 'support_tickets' and p_op = 'create'
      then true
    else false
  end;

  if not v_allowed then
    return json_build_object(
      'error', format('Role %s cannot %s %s', p_role, p_op, p_resource),
      'code',  'FORBIDDEN');
  end if;

  -- ---------- CAMPAIGNS ----------
  if p_resource = 'campaigns' then
    if p_op = 'create' then
      insert into campaigns (org_id, name, brief, audience, platform, status,
                             deadline, brand_kit_id, assigned_to, created_by)
      values (p_org_id,
              p_data->>'name',
              p_data->>'brief',
              p_data->>'audience',
              p_data->>'platform',
              coalesce((p_data->>'status')::campaign_status, 'draft'),
              nullif(p_data->>'deadline','')::timestamptz,
              nullif(p_data->>'brand_kit_id','')::uuid,
              nullif(p_data->>'assigned_to','')::uuid,
              p_user_id)
      returning to_json(campaigns.*) into v_row;

    elsif p_op = 'update' then
      update campaigns set
        name         = coalesce(p_data->>'name', name),
        brief        = coalesce(p_data->>'brief', brief),
        audience     = coalesce(p_data->>'audience', audience),
        platform     = coalesce(p_data->>'platform', platform),
        status       = coalesce((p_data->>'status')::campaign_status, status),
        deadline     = coalesce(nullif(p_data->>'deadline','')::timestamptz, deadline),
        brand_kit_id = coalesce(nullif(p_data->>'brand_kit_id','')::uuid, brand_kit_id),
        assigned_to  = coalesce(nullif(p_data->>'assigned_to','')::uuid, assigned_to)
      where id = p_id and org_id = p_org_id
      returning to_json(campaigns.*) into v_row;

    elsif p_op = 'delete' then
      delete from campaigns where id = p_id and org_id = p_org_id
      returning json_build_object('id', id, 'deleted', true) into v_row;
    end if;

  -- ---------- ASSETS ----------
  elsif p_resource = 'assets' then
    if p_op = 'create' then
      insert into assets (org_id, campaign_id, brand_kit_id, title, description,
                          category, status, width, height, storage_path, created_by)
      values (p_org_id,
              nullif(p_data->>'campaign_id','')::uuid,
              nullif(p_data->>'brand_kit_id','')::uuid,
              p_data->>'title',
              p_data->>'description',
              p_data->>'category',
              coalesce((p_data->>'status')::asset_status, 'draft'),
              nullif(p_data->>'width','')::int,
              nullif(p_data->>'height','')::int,
              p_data->>'storage_path',
              p_user_id)
      returning to_json(assets.*) into v_row;

    elsif p_op = 'update' then
      update assets set
        title       = coalesce(p_data->>'title', title),
        description = coalesce(p_data->>'description', description),
        category    = coalesce(p_data->>'category', category),
        status      = coalesce((p_data->>'status')::asset_status, status),
        campaign_id = coalesce(nullif(p_data->>'campaign_id','')::uuid, campaign_id)
      where id = p_id and org_id = p_org_id
      returning to_json(assets.*) into v_row;

    elsif p_op = 'delete' then
      delete from assets where id = p_id and org_id = p_org_id
      returning json_build_object('id', id, 'deleted', true) into v_row;
    end if;

  -- ---------- BRAND KITS ----------
  elsif p_resource = 'brand_kits' then
    if p_op = 'create' then
      insert into brand_kits (org_id, name, tokens, guidelines_text, created_by)
      values (p_org_id,
              p_data->>'name',
              coalesce(p_data->'tokens', '{}'::jsonb),
              p_data->>'guidelines_text',
              p_user_id)
      returning json_build_object('id', id, 'name', name) into v_row;

    elsif p_op = 'update' then
      update brand_kits set
        name            = coalesce(p_data->>'name', name),
        tokens          = coalesce(p_data->'tokens', tokens),
        guidelines_text = coalesce(p_data->>'guidelines_text', guidelines_text)
      where id = p_id and org_id = p_org_id
      returning json_build_object('id', id, 'name', name) into v_row;

    elsif p_op = 'delete' then
      delete from brand_kits where id = p_id and org_id = p_org_id
      returning json_build_object('id', id, 'deleted', true) into v_row;
    end if;

  -- ---------- TEMPLATES ----------
  elsif p_resource = 'templates' then
    if p_op = 'create' then
      insert into templates (org_id, title, category, spec, preview_path, is_public)
      values (p_org_id,
              p_data->>'title',
              p_data->>'category',
              coalesce(p_data->'spec', '{}'::jsonb),
              p_data->>'preview_path',
              false)
      returning to_json(templates.*) into v_row;

    elsif p_op = 'update' then
      update templates set
        title    = coalesce(p_data->>'title', title),
        category = coalesce(p_data->>'category', category),
        spec     = coalesce(p_data->'spec', spec)
      where id = p_id and org_id = p_org_id
      returning to_json(templates.*) into v_row;

    elsif p_op = 'delete' then
      delete from templates where id = p_id and org_id = p_org_id
      returning json_build_object('id', id, 'deleted', true) into v_row;
    end if;
  -- ---------- SUPPORT TICKETS ----------
  -- Any authenticated member may raise a ticket, so no role restriction.
  elsif p_resource = 'support_tickets' then
    if p_op = 'create' then
      return create_support_ticket(
        p_org_id,
        p_user_id,
        p_data->>'email',
        p_data->>'name',
        p_data->>'topic',
        p_data->>'subject',
        p_data->>'message',
        p_data->'chat_transcript'
      );
    else
      return json_build_object('error','Not permitted','code','FORBIDDEN');
    end if;

  else
    return json_build_object('error','Unknown resource','code','BAD_RESOURCE');
  end if;

  if v_row is null then
    return json_build_object('error','Not found','code','NOT_FOUND');
  end if;

  return v_row;

exception when others then
  return json_build_object('error', SQLERRM, 'code','DB_ERROR');
end $$;