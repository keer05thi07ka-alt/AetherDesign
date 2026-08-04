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

## 0.4 — CORS  [PASSED]

Browser fetch from http://localhost:5173 to Workbench webhook: 200 OK.
No Vite proxy required.

### Webhook URL patterns
| Type | URL | Notes |
|---|---|---|
| Production | https://api.agents.snsihub.ai/webhook/<path> | Requires workflow ACTIVE. Returns clean data. |
| Test | https://api.agents.snsihub.ai/webhook-test/<path> | Works while paused. Wraps response in {success,status,mode,output}. |

API host is api.agents.snsihub.ai (subdomain), not agents.snsihub.ai.

### CORS configuration
Webhook Trigger node -> Options -> "Allowed Origins (CORS)"
Value used: *
Tighten to the deployed frontend origin before demo.

### Frontend base URL
VITE_API_BASE_URL=https://api.agents.snsihub.ai/webhook
Always use the production URL, never webhook-test.

## 0.5 — JWT webhook auth  [PASSED]

### JWT node (Security category)
- Operation: Sign
- "Use JSON to Build Payload" toggle ON -> paste JSON directly
- Payload: {"sub":"user-123","org_id":"org-abc","role":"designer"}
- Secret entered manually (JWT Credential dropdown left blank)
- Add option offers only: Key ID, Override Algorithm
- NO built-in "Expires In" -> add exp as a claim inside the JSON payload
- Output field: token   -> downstream reference {{ $json.token }}

### Webhook Trigger JWT Auth
Extra fields appear only after Authentication is set to "JWT Auth".

| Field | Value used |
|---|---|
| JWT Secret | aether-dev-secret-change-me (dev only) |
| JWT Algorithm | HS256 |
| Session Claim | sub |
| Session Source | Header |
| Session Source Name | Authorization |
| Require Role Check | ON |
| Role Claim Key | role |
| Allowed Roles | designer, brand_admin |

### Test results
| Test | Status | Body |
|---|---|---|
| Authorization: Bearer <token> | 200 | {"authenticated":"true"} |
| No Authorization header | 401 | {"error":"Unauthorized: Bearer token required"} |
| Invalid token value | 401 | same |

### CRITICAL for frontend
Header MUST be:  Authorization: Bearer <token>
The "Bearer " prefix is required. Raw token is rejected.
401 error bodies are JSON and parseable.

### Consequence
Auth and RBAC are declarative per-webhook config.
No manual JWT verification chain needed anywhere in Phase 2.
org_id must still be taken from the verified token, never the request body.

## 0.7 — Embeddings route  [PENDING]
## 0.8 — Image generation to storage  [PENDING]
## 0.9 — Gemini File Search Store availability  [PENDING]