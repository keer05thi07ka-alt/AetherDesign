-- ============================================================
-- 012 — Dual confidence signal for retrieval
--
-- The previous rule (gap >= 0.03) produced a false negative:
--   "team photo for our about page"  top 0.8550  gap 0.0198  -> unconfident
-- despite a directly relevant rule existing ("People may appear in
-- photographs, but they are never the subject").
--
-- The narrow gap reflected several adjacent chunks all being relevant, not
-- an absence of relevance. A tight cluster of good matches is
-- indistinguishable from a flat spread of bad ones if only the gap is
-- measured.
--
-- Revised: a result is confident when EITHER
--   the leader is clear      (gap >= 0.03)
--   OR the leader is strong  (top >= 0.85)
--
-- Observed data:
--   contrast ratio   top 0.8704  gap 0.054  relevant
--   stock photos     top 0.8462  gap 0.056  relevant
--   logo clear space top 0.8940  gap 0.084  relevant
--   team photo       top 0.8550  gap 0.020  relevant   <- fixed by this rule
--   refund policy    top 0.7375  gap 0.011  NOT relevant
-- ============================================================

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
    'confident',      (v_gap >= 0.03 or v_top >= 0.85)
  );

exception when others then
  return json_build_object('error', SQLERRM, 'code','DB_ERROR');
end $$;