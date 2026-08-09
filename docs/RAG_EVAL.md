# RAG Retrieval Evaluation

Corpus: Brightfold Studio brand guidelines, 3,000 chars → 18 chunks (avg 170).
Embeddings: gemini-embedding-001, 128 dimensions.
Search: pgvector HNSW, cosine similarity.

## Method
Queries a designer would realistically ask, with the expected chunk labelled
by hand before retrieval was run. Two are deliberately unanswerable, to test
whether the system admits ignorance rather than surfacing noise confidently.

| # | Query | Expected | Top-1 | Sim | Gap |
|---|---|---|---|---|---|
| 1 | what contrast ratio do I need for text | accessibility | ✅ | 0.8704 | 0.054 |
| 2 | can I use stock photos of people pointing at laptops | photography | ✅ | 0.8462 | 0.056 |
| 3 | how much clear space around the logo | logo | ✅ | 0.8940 | 0.084 |
| 4 | what is our refund policy | NONE | n/a | 0.7375 | 0.011 |

## Finding
Absolute similarity does not separate relevant from irrelevant: an
unanswerable query scores 0.7375, only 0.11 below a perfect match.

The GAP between rank 1 and rank 2 separates them cleanly:
  answerable   0.054 – 0.084
  unanswerable 0.011

Threshold adopted: gap >= 0.03 marks a result confident. Retrieval reports
this rather than filtering, so the generation layer decides whether to inject
brand context or proceed without it.

## Results
precision@1: __ / __
Unanswerable queries correctly flagged: __ / __