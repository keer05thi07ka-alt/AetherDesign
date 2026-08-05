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

## 0.7 — Embeddings  [PASSED]

Workbench has NO native embeddings node.
Route: HTTP Request node -> Gemini API.

### Working configuration
| Field | Value |
|---|---|
| Method | POST |
| URL | https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent |
| Header | x-goog-api-key: <key from credential store> |
| Header | Content-Type: application/json |
| Body Content Type | JSON |
| Response Format | JSON |

Body:
{"model":"models/gemini-embedding-001","content":{"parts":[{"text":"..."}]},"outputDimensionality":768}

VECTOR DIMENSION: 768 (verified) -> Phase 1 schema uses vector(768)

### CRITICAL — HTTP Request wraps every response
Shape: { statusCode, body: { ...actual API response... } }

Downstream reference MUST be:  {{ $json.body.embedding.values }}
NOT:                           {{ $json.embedding.values }}

$json.statusCode is available for IF-node error branching.

### Model availability (ListModels, Aug 2026)
- text-embedding-004   -> RETIRED (404)
- gemini-embedding-001 -> WORKS, 2048 token input limit
- gemini-embedding-2   -> available, 8192 token input (fallback for long chunks)

### Bonus: image models on the same Gemini key
- models/imagen-4.0-fast-generate-001
- models/gemini-3.1-flash-image ("Nano Banana 2")
Fallback if the Hugging Face Generate Image node fails.

## 0.8 — Image generation  [PASSED]

### Working setup
Node: Generate Image (Hugging Face, AI/LLM category)
Credential: aetherdesign-inference (credential store — NOT inline)
Width/Height: 768 x 768
Generation time: ~20s or less

### Output shape — NOT wrapped
{ "image": "data:image/png;base64,...", "_usage": { inputTokens, outputTokens } }

Reference: {{ $json.image }}

CONTRAST: HTTP Request node DOES wrap -> {{ $json.body.<field> }}
Generate Image node does NOT wrap    -> {{ $json.image }}
Two different shapes. Do not confuse them.

### Hugging Face token requirement
A "Read" token is NOT sufficient. Error:
  "This authentication method does not have sufficient permissions
   to call Inference Providers"
Requires FINE-GRAINED token with "Make calls to Inference Providers" ticked.
The node's error hint mentions Google/BigQuery scopes — hardcoded UI string,
irrelevant, ignore it.

### Known limitation — text in generated images
Headline renders acceptably ("SUMMER SALE"); sub-headlines come out garbled.
Do NOT rely on the model for copy.
Phase 4 approach: generate the visual, overlay real text as HTML/SVG.
Also better for multilingual (Phase 6): one base image, N text overlays,
instead of N generations.

### Storage — decide in Phase 4
Output is a base64 data URI, not a file.
Options: (a) code.execute decode -> aws.s3.file.upload
         (b) store base64 directly in Postgres for the demo
Workbench has a Binary output tab that renders images — useful for debugging.

## 0.9 — Gemini File Search Store  [NOT AVAILABLE]
Gemini node Resource dropdown offers Text / Audio / Vision only.
No File Search resource.
CONSEQUENCE: Phase 3 builds retrieval with HTTP Request (embeddings)
+ pgvector, as originally planned. No managed RAG shortcut.

## 0.9 — Gemini File Search Store  [PENDING]
