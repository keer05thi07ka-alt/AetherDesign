create or replace function rag_retrieve(
  p_org_id    uuid,
  p_embedding text,
  p_limit     int default 5
) returns json
language plpgsql
security definer
as $$
declare
  v_rows json;
  v_top  numeric;
  v_gap  numeric;
begin
  -- Absolute cosine similarity is a poor relevance signal here: an
  -- unanswerable query still scores ~0.74 against short text. The GAP
  -- between the best chunk and the next is far more informative — a real
  -- match leads by 0.05-0.08, a flat distribution by ~0.01.
  --
  -- Retrieval reports its confidence rather than silently filtering, so
  -- the caller decides whether to inject the context into a prompt.
  with scored as (
    select (1 - (c.embedding <=> p_embedding::vector)) as sim
    from brand_chunks c
    where c.org_id = p_org_id and c.embedding is not null
    order by sim desc
    limit 2
  )
  select max(sim), max(sim) - min(sim) into v_top, v_gap from scored;

  if v_top is null then
    return json_build_object(
      'chunks', '[]'::json, 'top_similarity', null,
      'gap', null, 'confident', false);
  end if;

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

  return json_build_object(
    'chunks',         v_rows,
    'top_similarity', round(v_top, 4),
    'gap',            round(v_gap, 4),
    'confident',      (v_gap >= 0.03)
  );

exception when others then
  return json_build_object('error', SQLERRM, 'code','DB_ERROR');
end $$;