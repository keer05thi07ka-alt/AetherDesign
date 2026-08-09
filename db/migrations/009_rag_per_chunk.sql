delete from brand_chunks;

drop index if exists idx_brand_chunks_emb;
alter table brand_chunks drop column embedding;
alter table brand_chunks add column embedding vector(256);

create index idx_brand_chunks_emb on brand_chunks
  using hnsw (embedding vector_cosine_ops);

-- Upsert a single chunk. Called once per chunk so each parameter payload
-- stays small — the Workbench parameter field cannot carry a full batch.
-- Passing index 0 clears the previous set, keeping ingestion idempotent.
create or replace function rag_upsert_chunk(
  p_org_id       uuid,
  p_brand_kit_id uuid,
  p_index        int,
  p_content      text,
  p_embedding    text
) returns json
language plpgsql
security definer
as $$
begin
  if not exists (
    select 1 from brand_kits where id = p_brand_kit_id and org_id = p_org_id
  ) then
    return json_build_object('error','Brand kit not found','code','NOT_FOUND');
  end if;

  if p_index = 0 then
    delete from brand_chunks where brand_kit_id = p_brand_kit_id;
  end if;

  insert into brand_chunks (brand_kit_id, org_id, chunk_index, content, embedding)
  values (p_brand_kit_id, p_org_id, p_index, p_content, p_embedding::vector);

  return json_build_object('index', p_index, 'stored', true);

exception when others then
  return json_build_object('error', SQLERRM, 'code','DB_ERROR');
end $$;