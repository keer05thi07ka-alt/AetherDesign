# Phase 0 — Spike Results

## 0.2 / 0.3 — Database  [PASSED]

| Item | Value |
|---|---|
| Provider | Supabase |
| Project ref | ydbzcsfkgwaqrygenrqo |
| Region | South Asia (Mumbai) |
| Postgres version | 17.6 |
| pgvector version | 0.8.2 |
| Connection mode | Session pooler (IPv4) |
| Host | aws-1-ap-south-1.pooler.supabase.com |
| User format | postgres.<project-ref> |
| SSL | required |
| Workbench credential name | aetherdesign-db-v2 |

### Prepared statement syntax — CRITICAL

Postgres Execute Query node:
- SQL placeholders: $1, $2, $3 ...
- Parameters field REQUIRES expression braces: {{ ["value", 42] }}
- A bare JSON array without braces does NOT work.
- Dynamic form for Phase 2: {{ [$json.org_id, $json.limit] }}

Consequence: two-workflow generic router is viable.
SQL string concatenation is never required.

### Gotchas hit
- Direct connection is IPv6-only -> "Database host could not be found". Use Session pooler.
- Credentials cannot be edited after saving; create a new one via the + button.
- Host prefix is aws-1, not aws-0.
- Node to use is "Execute Query" with the PostgreSQL elephant icon (not BigQuery, not Databricks).

## 0.4 — CORS  [PENDING]
## 0.5 — JWT webhook auth  [PENDING]
## 0.7 — Embeddings route  [PENDING]
## 0.8 — Image generation to storage  [PENDING]
## 0.9 — Gemini File Search Store availability  [PENDING]