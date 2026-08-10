-- ============================================================
-- 013 — Support tickets
--
-- Backs both the contact form and chatbot escalation. Tickets are
-- org-scoped like everything else, but a signed-out user can also
-- submit one, so org_id and user_id are nullable.
-- ============================================================

create type ticket_status as enum ('open', 'in_progress', 'resolved', 'closed');
create type ticket_topic  as enum
  ('generation', 'editing', 'campaigns', 'account', 'billing', 'publishing', 'other');

create table if not exists support_tickets (
  id             uuid primary key default gen_random_uuid(),
  org_id         uuid references organizations(id) on delete set null,
  user_id        uuid references users(id) on delete set null,
  email          text not null,
  name           text,
  topic          ticket_topic not null default 'other',
  subject        text not null,
  message        text not null,
  status         ticket_status not null default 'open',
  chat_transcript jsonb,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists idx_tickets_org    on support_tickets(org_id);
create index if not exists idx_tickets_status on support_tickets(status, created_at desc);

create trigger trg_support_tickets_updated
  before update on support_tickets
  for each row execute function set_updated_at();


-- ------------------------------------------------------------
-- Create a ticket. Accepts an anonymous submission (no org, no user)
-- so the contact form works for signed-out visitors.
-- ------------------------------------------------------------
create or replace function create_support_ticket(
  p_org_id     uuid,
  p_user_id    uuid,
  p_email      text,
  p_name       text,
  p_topic      text,
  p_subject    text,
  p_message    text,
  p_transcript jsonb default null
) returns json
language plpgsql
security definer
as $$
declare
  v_id uuid;
begin
  if nullif(trim(p_email), '') is null then
    return json_build_object('error','Email is required','code','BAD_REQUEST');
  end if;
  if nullif(trim(p_message), '') is null then
    return json_build_object('error','Message is required','code','BAD_REQUEST');
  end if;

  insert into support_tickets
    (org_id, user_id, email, name, topic, subject, message, chat_transcript)
  values
    (p_org_id, p_user_id, lower(trim(p_email)), nullif(trim(p_name), ''),
     coalesce(nullif(p_topic,'')::ticket_topic, 'other'),
     coalesce(nullif(trim(p_subject),''), 'Support request'),
     trim(p_message), p_transcript)
  returning id into v_id;

  return json_build_object('id', v_id, 'status', 'open');

exception when others then
  return json_build_object('error', SQLERRM, 'code','DB_ERROR');
end $$;