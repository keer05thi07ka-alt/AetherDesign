# RAG Retrieval Evaluation

Corpus: Brightfold Core Brand guidelines, N chunks, 128-dim embeddings
(gemini-embedding-001), cosine similarity via pgvector HNSW.

## Method
20 queries a real user might ask. For each, the expected chunk was labelled
by hand before running retrieval. Scored as precision@1 (was the top result
correct) and precision@5 (was the correct chunk in the top five).

## Queries

| # | Query | Expected topic | Top-1 correct | In top 5 |
|---|---|---|---|---|
| 1 | what colours should I use | colour/composition | | |
| 2 | can I photograph on a white background | photography | | |
| 3 | how long should headlines be | voice/headlines | | |
| 4 | how much green is too much | colour/composition | | |
| 5 | can I use models in photos | photography | | |
| 6 | are drop shadows allowed | effects | | |
| 7 | what tone should copy have | voice | | |
| 8 | can I say our products are premium | claims | | |
| 9 | how do I describe sustainability | claims | | |
| 10 | should photos be studio lit | photography | | |
| ... | | | | |

## Results
precision@1: __
precision@5: __

## Failure analysis
(queries that missed, and why)