# AetherDesign API Contract

Backend: SNS Agent Workbench webhooks.
Base URL: https://api.agents.snsihub.ai/webhook

Every workflow must be DEPLOYED (not merely saved) to be reachable.
The /webhook-test/ URL wraps responses in {success,status,mode,output} —
never call it from the frontend.

---

## Authentication

All endpoints except /auth/* require:

    Authorization: Bearer <jwt>

The "Bearer " prefix is mandatory (verified — raw token returns 401).

### JWT payload
{
  "sub":    "<user uuid>",
  "org_id": "<org uuid>",
  "role":   "owner|brand_admin|marketing_manager|designer|approver",
  "email":  "<email>",
  "exp":    <unix seconds>
}

### Webhook JWT Auth config (per protected endpoint)
| Field | Value |
|---|---|
| Authentication | JWT Auth |
| JWT Secret | credential store |
| JWT Algorithm | HS256 |
| Session Claim | sub |
| Session Source | Header |
| Session Source Name | Authorization |
| Require Role Check | ON (where restricted) |
| Role Claim Key | role |
| Allowed Roles | per endpoint, see below |

### THE TENANCY RULE
org_id is read from the VERIFIED TOKEN ONLY.
It is never read from the request body or query string.
Every SQL statement filters on it. No exceptions.

---

## Error format

    { "error": "message", "code": "MACHINE_CODE" }

| Status | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 202 | Accepted (async job started) |
| 400 | Validation failed |
| 401 | Missing or invalid token |
| 403 | Authenticated but role not permitted |
| 404 | Not found, or not in caller's org |
| 409 | Invalid state transition |
| 500 | Server error |

404 rather than 403 for another org's rows — do not confirm existence.

---

## WF-1 — Auth

Path: auth        Method: POST      Auth: none

Body: { "action": "signup" | "login" | "me", ... }

### signup
Request:  { action, email, password, full_name, org_name }
Creates:  organizations + users + memberships(role=owner)
Response: 201 { token, user: {...}, memberships: [...] }

### login
Request:  { action, email, password }
Response: 200 { token, user: {...}, memberships: [...] }
          401 { error: "Invalid credentials" }

### me
Request:  { action: "me" }  with Bearer token
Response: 200 { user, memberships, active_org }

Nodes: Webhook -> Switch(action) -> Crypto(Hash) -> Postgres -> JWT(Sign) -> Respond

---

## WF-2 — Generic Read

Path: api-read     Method: GET      Auth: JWT (all roles)

Query parameters:
| Param | Required | Notes |
|---|---|---|
| resource | yes | must be on the allowlist |
| id | no | single record if present |
| campaign_id | no | filter |
| status | no | filter |
| limit | no | default 50, max 200 |
| offset | no | default 0 |

Allowlist (reject anything else with 400):
  campaigns | assets | asset_versions | brand_kits
  approvals | templates | generation_jobs | memberships

Examples:
  GET /webhook/api-read?resource=campaigns
  GET /webhook/api-read?resource=assets&campaign_id=<uuid>&status=in_review
  GET /webhook/api-read?resource=assets&id=<uuid>

Response (list):   200 { data: [...], total: <int>, limit, offset }
Response (single): 200 { data: {...} }

### SQL pattern — parameter binding is MANDATORY
SQL Query:
    select * from campaigns where org_id = $1 order by created_at desc
    limit $2 offset $3

Parameters for prepared statements:
    {{ [$json.orgId, $json.limit, $json.offset] }}

Never concatenate values into the SQL string.
Route resource -> table via a Switch node, never by interpolating the param.

Nodes: Webhook(JWT) -> Switch(resource) -> Postgres.executeQuery -> Set -> Respond

---

## WF-3 — Generic Write

Path: api-write    Method: POST     Auth: JWT

Body:
{
  "resource": "campaigns",
  "op": "create" | "update" | "delete",
  "id": "<uuid>",          // update/delete only
  "data": { ... }
}

Role permissions:
| Resource | create | update | delete |
|---|---|---|---|
| campaigns | marketing_manager, brand_admin, owner | same | brand_admin, owner |
| assets | designer, marketing_manager, brand_admin, owner | same | brand_admin, owner |
| brand_kits | brand_admin, owner | brand_admin, owner | owner |
| templates | brand_admin, owner | brand_admin, owner | owner |

Response: 201 { data: {...} }  |  200 { data: {...} }  |  200 { deleted: true }

org_id is injected server-side on every insert. Never accepted from the client.

---

## WF-4 — Generate Asset (async)

Path: generate     Method: POST     Auth: JWT (designer, marketing_manager, brand_admin, owner)

Request:
{
  "prompt": "summer sale square ad",
  "campaign_id": "<uuid>",
  "brand_kit_id": "<uuid>",
  "width": 1080, "height": 1080,
  "use_brand_context": true
}

Response: 202 { job_id, status: "queued" }

Respond mode: onReceived (respond immediately, continue in background)

Pipeline:
  insert generation_jobs(queued)
  -> respond 202
  -> status=retrieving  -> subworkflow: retrieve-brand-context (pgvector)
  -> compose refined prompt (Gemini 3.6 Flash)
  -> status=generating  -> Generate Image (HF)   output: {{ $json.image }}
  -> status=storing     -> decode base64, store
  -> embed asset, insert assets + asset_versions(v1)
  -> status=done, set result_asset_id

Poll with:
  GET /webhook/api-read?resource=generation_jobs&id=<job_id>

Job statuses: queued | retrieving | generating | storing | done | failed
Frontend polls every 2s. Typical completion under 30s.

---

## WF-5 — Approval Transition

Path: approval-transition   Method: POST   Auth: JWT (approver, brand_admin, owner)

Request: { asset_id, decision: "approved"|"rejected"|"changes_requested", comment }

Valid transitions:
  draft      -> in_review
  in_review  -> approved | rejected | changes_requested
  rejected   -> draft          (creates version n+1)
  approved   -> archived

Invalid transition -> 409 { error: "Invalid transition", code: "BAD_TRANSITION" }

Effects (single transaction):
  insert approvals
  update assets.status
  if rejected -> insert asset_versions(version_no = current + 1)
                 update assets.current_version

---

## WF-6 — Campaign Automation

Path: campaign-automate   Method: POST   Auth: JWT (marketing_manager, brand_admin, owner)

Request: { campaign_id, base_prompt, variants: ["instagram_square","story", ...] }

Response: 202 { job_ids: [...] }

Loops variants -> executeSubWorkflow(WF-4) per platform size.

---

## WF-8 — Semantic Search

Path: search        Method: POST     Auth: JWT (all roles)

Request: { query: "calm minimal summer", limit: 10, campaign_id?, status? }

Response: 200 { data: [ { ...asset, similarity: 0.87 } ] }

Pipeline: embed query (HTTP Request -> Gemini) -> pgvector cosine search

SQL:
    select a.*, 1 - (a.embedding <=> $2::vector) as similarity
    from assets a
    where a.org_id = $1 and a.embedding is not null
    order by a.embedding <=> $2::vector
    limit $3

---

## Node response shapes — do not confuse these

| Node | Shape | Reference |
|---|---|---|
| HTTP Request | { statusCode, body: {...} } | {{ $json.body.<field> }} |
| Generate Image | { image, _usage } | {{ $json.image }} |
| Postgres Execute Query | { items: [ { json: {...} } ] } | {{ $json.items }} |

---

## Frontend configuration

frontend/.env.local:
    VITE_API_BASE_URL=https://api.agents.snsihub.ai/webhook

All requests:
    Authorization: Bearer <token>
    Content-Type: application/json

---

## OPEN — resolve at the start of Phase 2

Does the webhook path field support :param syntax (e.g. api/:resource)?
Unverified. This contract uses query parameters, which are guaranteed to work.
If path params are supported, URLs can be upgraded to /api/campaigns style
without changing any workflow logic.

Test: create a webhook with path "test/:thing", deploy, call
/webhook/test/hello, and check whether the trigger output exposes
params.thing.


## 2.0 — Webhook payload structure  [VERIFIED]

Path parameters ARE supported. Path "test/:thing" called as /test/hello gives:

{
  "query":   {},                       -> {{ $json.query.<name> }}
  "headers": { ... },                  -> {{ $json.headers.<name> }}
  "params":  { "thing": "hello" },     -> {{ $json.params.<name> }}
  "file":    null
}

Header names arrive LOWERCASED: authorization, origin, user-agent.
No "body" key present on GET requests.

CONSEQUENCE: API uses clean REST paths.
  GET  /webhook/api/:resource
  GET  /webhook/api/:resource/:id
  POST /webhook/api/:resource