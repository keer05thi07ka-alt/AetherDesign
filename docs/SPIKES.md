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

## 0.8 — Image generation  [SOLVED — Cloudflare Workers AI]

Provider: Cloudflare Workers AI
Model:    @cf/black-forest-labs/flux-1-schnell
Quota:    ~10,000 requests/day free
Node:     HTTP Request

| Field | Value |
|---|---|
| Method | POST |
| URL | https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/ai/run/@cf/black-forest-labs/flux-1-schnell |
| Header | Authorization: Bearer <TOKEN> |
| Header | Content-Type: application/json |
| Body Content Type | JSON |
| Response Format | JSON |

Body: {"prompt":"...","steps":4}

Response: { statusCode, body: { result: { image: "<base64>" }, success: true } }
Field path: {{ $json.body.result.image }}
Format: JPEG — render as data:image/jpeg;base64,<string>

NOTE: the Binary output tab does not activate for this node even with
Response Format = File / Binary. Keep Response Format = JSON and preview
via a scratch HTML file during development.

### Providers rejected
| Provider | Why |
|---|---|
| Hugging Face Inference | Monthly credits depleted after ~6 calls |
| Gemini Nano Banana Pro | limit: 0 — paid tier only |
| Imagen 4.0 Fast | 404, retired for new accounts |
| Pollinations.ai | 500 Internal Server Error |

### Resolution strategy
FLUX caps near 1024px. Generate ONCE at 1024x1024, then crop/resize per
platform with a code.execute node in Phase 4:
  Instagram square 1080x1080 | Story 1080x1920
  Email banner 1200x400      | Facebook link 1200x630
One generation -> four platform assets.

### Text handling
Diffusion models render text unreliably (verified: garbled sub-headlines).
Generate the visual only; overlay real text as HTML/SVG in the frontend.
Makes multilingual variants nearly free in Phase 6.

## 0.9 — Gemini File Search Store  [NOT AVAILABLE]
Gemini node Resource dropdown offers Text / Audio / Vision only.
No File Search resource.
CONSEQUENCE: Phase 3 builds retrieval with HTTP Request (embeddings)
+ pgvector, as originally planned. No managed RAG shortcut.

## 0.9 — Gemini File Search  [AVAILABLE]

Gemini node Resource dropdown: Text | Audio | Document | Media File | File Search

Operations:
- Create File Search Store
- Upload to File Search Store
- List File Search Stores
- Delete File Search Store
- File Search (built-in tool on "Message a Model")

Credential: "Google Gemini Api Account" dropdown exists -> keys go in the
credential store, NOT inline headers. Create "aetherdesign-gemini" in Phase 2.

### DECISION — hybrid RAG
Gemini File Search  -> brand guideline documents (managed, handles PDFs)
pgvector + embeddings -> asset semantic search + brand consistency scoring
                         (needs org_id filtering and image embeddings;
                          File Search cannot do either)

Rationale: File Search alone would mean writing zero code, forfeiting the
sanctioned RAG engineering showcase. pgvector alone would mean hand-building
document chunking that File Search does for free.


## PLATFORM BUG — two Execute Query nodes in one workflow

Symptom: the second Execute Query node's "Parameters for prepared statements"
field is silently cleared on save. Its SQL may also be overwritten with the
first node's query.

Confirmed with support. Workaround suggested: drag fields in rather than typing.

DESIGN RULE ADOPTED: one Execute Query node per workflow.
Split branching flows into separate workflows with fixed webhook paths.
  identity/login  -> wf1-login
  identity/signup -> wf1-signup


  ## Phase 2 platform notes

### BUG — fields clear on save
Two Execute Query nodes in one workflow: the second node's Parameters field
is cleared and its SQL may be overwritten by the first node's.
The Postgres credential dropdown also resets to blank on reopen.

RULE: one Execute Query per workflow. Re-check the credential on every open.

### Reserved path prefix
Webhook path "auth/*" returns 401 even with Authentication: None.
"auth" is reserved. Auth endpoints use /identity/login and /identity/signup.

### Node names are not editable
$('Node Name') references are unusable. Chain data forward instead.

### IF node passes full input through
After IF: {{ $json.data.items[0].json.<column> }}

### JWT node replaces the item
Output is only { token }. Recover upstream fields with a Set Fields node
+ "Include Other Input Fields" ON, or decode the token client-side.

### Postgres node output shape
{ status, data: { items: [ { json: {row} } ] }, metadata: { rowCount, command } }

### Working auth endpoint
POST /webhook/identity/login  {email, password}
-> { token } with claims: sub, org_id, role, email, exp (24h)
Chain: Webhook -> Crypto(SHA256) -> Execute Query -> IF(rowCount==1)
       -> TRUE: Set Fields (flatten) -> JWT Sign
       -> FALSE: Set Fields (error)

## JWT claims exposure  [VERIFIED]

A webhook with Authentication: JWT Auth exposes decoded claims at $json.jwt:

{
  "query":   {},
  "headers": { authorization: "Bearer ..." },
  "params":  {},
  "jwt":     { sub, org_id, role, email, exp, iat },
  "file":    null,
  "sessionId": "rs_..."
}

TENANCY RULE:
  org_id  -> {{ $json.jwt.org_id }}   (verified, unforgeable)
  user_id -> {{ $json.jwt.sub }}
  role    -> {{ $json.jwt.role }}

NEVER read org_id from body, query, or params.

### Parameter field size limit
A ~20,000 character parameter fails with "Database operation failed" — even
for a trivial length($3) query. There is an undocumented size cap.

RULE: pass bulk data one row at a time using Query Batching Mode =
"Each Item Independently", with the Code node emitting one item per row.
Embeddings use 256 dimensions to keep each payload near 3.5 KB.