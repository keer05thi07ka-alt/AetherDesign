-- ============================================================
-- 008 — RAG chunk storage
--
-- Replaces all chunks for a brand kit in one transaction. Ingestion is
-- idempotent: re-running with the same guidelines yields the same state.
-- ============================================================

create or replace function rag_store_chunks(
  p_org_id       uuid,
  p_brand_kit_id uuid,
  p_chunks       jsonb   -- [{ "index": 0, "content": "...", "embedding": [768 floats] }]
) returns json
language plpgsql
security definer
as $$
declare
  v_count int := 0;
  v_item  jsonb;
begin
  -- Tenant check: the brand kit must belong to the caller's org.
  if not exists (
    select 1 from brand_kits
    where id = p_brand_kit_id and org_id = p_org_id
  ) then
    return json_build_object('error','Brand kit not found','code','NOT_FOUND');
  end if;

  delete from brand_chunks where brand_kit_id = p_brand_kit_id;

  for v_item in select * from jsonb_array_elements(p_chunks)
  loop
    insert into brand_chunks (brand_kit_id, org_id, chunk_index, content, embedding)
    values (
      p_brand_kit_id,
      p_org_id,
      (v_item->>'index')::int,
      v_item->>'content',
      (v_item->>'embedding')::vector
    );
    v_count := v_count + 1;
  end loop;

  return json_build_object(
    'brand_kit_id', p_brand_kit_id,
    'chunks_stored', v_count
  );

exception when others then
  return json_build_object('error', SQLERRM, 'code','DB_ERROR');
end $$;


-- ------------------------------------------------------------
-- rag_retrieve — cosine similarity search over brand chunks.
-- ------------------------------------------------------------
create or replace function rag_retrieve(
  p_org_id    uuid,
  p_embedding text,      -- '[0.1,0.2,...]'
  p_limit     int default 5
) returns json
language plpgsql
security definer
as $$
declare
  v_rows json;
begin
  select coalesce(json_agg(t), '[]'::json) into v_rows
  from (
    select c.id,
           c.content,
           c.chunk_index,
           b.name as brand_kit_name,
           round((1 - (c.embedding <=> p_embedding::vector))::numeric, 4) as similarity
    from brand_chunks c
    join brand_kits b on b.id = c.brand_kit_id
    where c.org_id = p_org_id
      and c.embedding is not null
    order by c.embedding <=> p_embedding::vector
    limit greatest(1, least(p_limit, 20))
  ) t;

  return json_build_object('chunks', v_rows);

exception when others then
  return json_build_object('error', SQLERRM, 'code','DB_ERROR');
end $$;