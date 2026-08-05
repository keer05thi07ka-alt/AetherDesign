-- ============================================================
-- AetherDesign — Seed Data
-- Two orgs: Lumen (primary demo) + Northwind (isolation testing)
-- Fixed UUIDs so workflows and tests can reference them.
-- Re-runnable: truncates first.
-- ============================================================

truncate table
  approvals, asset_versions, assets, generation_jobs,
  campaigns, brand_chunks, brand_kits, templates,
  memberships, users, organizations
restart identity cascade;

-- ---------- ORGANIZATIONS ----------
insert into organizations (id, name, slug, plan) values
('11111111-1111-1111-1111-111111111111', 'Lumen Cosmetics',   'lumen',     'pro'),
('22222222-2222-2222-2222-222222222222', 'Northwind Outdoors','northwind', 'free');

-- ---------- USERS ----------
-- Demo password for every account: Password123!
-- Stored as SHA-256 hex to match the Workbench Crypto node (Hash -> SHA256).
-- NOTE: unsalted SHA-256 is NOT production-grade password storage. It is used
-- here because the Crypto node offers no bcrypt/argon2. Record this as a known
-- limitation rather than presenting it as secure.
insert into users (id, email, full_name, avatar_url, password_hash, auth_provider) values
('a0000000-0000-0000-0000-000000000001','priya@lumen.test', 'Priya Nair',
 'https://i.pravatar.cc/150?u=priya',
 'a109e36947ad56de1dca1cc49f0ef8ac9ad9a7b1aa0df41fb3c4cb73c1ff01ea','password'),
('a0000000-0000-0000-0000-000000000002','asha@lumen.test',  'Asha Menon',
 'https://i.pravatar.cc/150?u=asha',
 'a109e36947ad56de1dca1cc49f0ef8ac9ad9a7b1aa0df41fb3c4cb73c1ff01ea','password'),
('a0000000-0000-0000-0000-000000000003','rahul@lumen.test', 'Rahul Iyer',
 'https://i.pravatar.cc/150?u=rahul',
 'a109e36947ad56de1dca1cc49f0ef8ac9ad9a7b1aa0df41fb3c4cb73c1ff01ea','password'),
('a0000000-0000-0000-0000-000000000004','kiran@lumen.test', 'Kiran Das',
 'https://i.pravatar.cc/150?u=kiran',
 'a109e36947ad56de1dca1cc49f0ef8ac9ad9a7b1aa0df41fb3c4cb73c1ff01ea','password'),
-- Northwind user — exists solely to prove cross-tenant reads are blocked
('b0000000-0000-0000-0000-000000000001','sam@northwind.test','Sam Whitfield',
 'https://i.pravatar.cc/150?u=sam',
 'a109e36947ad56de1dca1cc49f0ef8ac9ad9a7b1aa0df41fb3c4cb73c1ff01ea','password');

-- ---------- MEMBERSHIPS (D1 fix: real roles) ----------
insert into memberships (user_id, org_id, role) values
('a0000000-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','brand_admin'),
('a0000000-0000-0000-0000-000000000002','11111111-1111-1111-1111-111111111111','marketing_manager'),
('a0000000-0000-0000-0000-000000000003','11111111-1111-1111-1111-111111111111','designer'),
('a0000000-0000-0000-0000-000000000004','11111111-1111-1111-1111-111111111111','approver'),
('b0000000-0000-0000-0000-000000000001','22222222-2222-2222-2222-222222222222','owner');

-- ---------- BRAND KITS (D11 fix: jsonb tokens, N colours) ----------
insert into brand_kits (id, org_id, name, tokens, guidelines_text, created_by) values
('c0000000-0000-0000-0000-000000000001',
 '11111111-1111-1111-1111-111111111111',
 'Lumen Core Brand',
 '{
    "colors": {
      "primary":   "#E8735A",
      "secondary": "#F5E6DC",
      "accent":    "#C9A227",
      "neutral":   "#2B2B2B",
      "surface":   "#FFFDF9"
    },
    "fonts": { "heading": "Playfair Display", "body": "Inter" },
    "logos": {
      "light": "brand/lumen-logo-light.svg",
      "dark":  "brand/lumen-logo-dark.svg",
      "mark":  "brand/lumen-mark.svg"
    },
    "spacing": { "unit": 8 },
    "tone": ["warm", "minimal", "confident", "unfussy"]
  }'::jsonb,
 'Lumen Cosmetics is a clean-beauty brand built on restraint. Visual language: generous negative space, soft natural light, matte ceramic textures. Primary coral (#E8735A) carries emotional warmth and should anchor no more than one third of any composition; cream (#F5E6DC) carries the rest. Photography is always product-forward, shot on neutral surfaces, never on models. Avoid: harsh shadows, saturated gradients, stock-photo lifestyle scenes, exclamation marks. Voice is calm and declarative — state the benefit, do not sell it. Headlines run two to four words. Body copy never exceeds two sentences. Sustainability claims must be specific and verifiable; never use the word "natural" without qualification.',
 'a0000000-0000-0000-0000-000000000001'),
('c0000000-0000-0000-0000-000000000002',
 '22222222-2222-2222-2222-222222222222',
 'Northwind Trail',
 '{"colors":{"primary":"#2F5D50","secondary":"#D9C7A3"},
   "fonts":{"heading":"Bitter","body":"Source Sans 3"},
   "tone":["rugged","practical","understated"]}'::jsonb,
 'Northwind Outdoors makes gear for people who would rather be outside. Imagery is field-shot, weather-real, never studio-perfect.',
 'b0000000-0000-0000-0000-000000000001');

-- ---------- CAMPAIGNS (D7 fix: FK, not an embedded blob) ----------
insert into campaigns (id, org_id, name, brief, audience, platform, status, deadline, brand_kit_id, assigned_to, created_by) values
('d0000000-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111',
 'Summer Sale 2026',
 'Drive a 20% site-wide summer promotion across social and email. Lead with the hydrating serum. Warm, restrained, no urgency language.',
 'Women 25-40, urban, skincare-conscious','instagram','active',
 now() + interval '21 days',
 'c0000000-0000-0000-0000-000000000001',
 'a0000000-0000-0000-0000-000000000003','a0000000-0000-0000-0000-000000000002'),
('d0000000-0000-0000-0000-000000000002','11111111-1111-1111-1111-111111111111',
 'Autumn Refresh',
 'Seasonal repositioning of the moisturiser range. Deeper tones permitted while staying inside brand palette.',
 'Existing customers, repeat purchasers','email','draft',
 now() + interval '60 days',
 'c0000000-0000-0000-0000-000000000001',
 'a0000000-0000-0000-0000-000000000003','a0000000-0000-0000-0000-000000000002'),
('d0000000-0000-0000-0000-000000000003','22222222-2222-2222-2222-222222222222',
 'Trail Season Launch','Spring hiking range launch.','Hikers 30-55','facebook','active',
 now() + interval '30 days',
 'c0000000-0000-0000-0000-000000000002',
 'b0000000-0000-0000-0000-000000000001','b0000000-0000-0000-0000-000000000001');

-- ---------- ASSETS (D2/D3/D4/D5 fixes) ----------
insert into assets (id, org_id, campaign_id, brand_kit_id, title, description, category, status, current_version, width, height, storage_path, created_by) values
('e0000000-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','d0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000001',
 'Summer Sale — Instagram Square','Hero square ad, serum on ceramic riser','social_post','in_review',2,1080,1080,'assets/lumen/summer-ig-square-v2.png','a0000000-0000-0000-0000-000000000003'),
('e0000000-0000-0000-0000-000000000002','11111111-1111-1111-1111-111111111111','d0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000001',
 'Summer Sale — Newsletter Banner','Wide email header','banner','draft',1,1200,400,'assets/lumen/summer-email-banner-v1.png','a0000000-0000-0000-0000-000000000003'),
('e0000000-0000-0000-0000-000000000003','11111111-1111-1111-1111-111111111111','d0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000001',
 'Summer Sale — Story Vertical','9:16 story format','story','approved',1,1080,1920,'assets/lumen/summer-story-v1.png','a0000000-0000-0000-0000-000000000003'),
('e0000000-0000-0000-0000-000000000004','11111111-1111-1111-1111-111111111111','d0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000001',
 'Summer Sale — Carousel Slide 1','Product close-up','social_post','approved',1,1080,1080,'assets/lumen/summer-carousel-1.png','a0000000-0000-0000-0000-000000000003'),
('e0000000-0000-0000-0000-000000000005','11111111-1111-1111-1111-111111111111','d0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000001',
 'Summer Sale — Rejected Draft','Too saturated, off-brand','social_post','rejected',1,1080,1080,'assets/lumen/summer-rejected-v1.png','a0000000-0000-0000-0000-000000000003'),
('e0000000-0000-0000-0000-000000000006','11111111-1111-1111-1111-111111111111','d0000000-0000-0000-0000-000000000002','c0000000-0000-0000-0000-000000000001',
 'Autumn Refresh — Concept A','Early exploration','concept','draft',1,1080,1080,'assets/lumen/autumn-concept-a.png','a0000000-0000-0000-0000-000000000003'),
('e0000000-0000-0000-0000-000000000007','11111111-1111-1111-1111-111111111111',null,'c0000000-0000-0000-0000-000000000001',
 'Brand Pattern Tile','Reusable background texture','texture','approved',1,1024,1024,'assets/lumen/pattern-tile.png','a0000000-0000-0000-0000-000000000001'),
('e0000000-0000-0000-0000-000000000008','11111111-1111-1111-1111-111111111111',null,'c0000000-0000-0000-0000-000000000001',
 'Archived Spring Banner','Superseded by summer campaign','banner','archived',3,1200,400,'assets/lumen/spring-banner-v3.png','a0000000-0000-0000-0000-000000000003'),
('e0000000-0000-0000-0000-000000000009','22222222-2222-2222-2222-222222222222','d0000000-0000-0000-0000-000000000003','c0000000-0000-0000-0000-000000000002',
 'Trail Launch — Hero','Field shot, boots on granite','banner','approved',1,1200,630,'assets/northwind/trail-hero.png','b0000000-0000-0000-0000-000000000001'),
('e0000000-0000-0000-0000-000000000010','22222222-2222-2222-2222-222222222222','d0000000-0000-0000-0000-000000000003','c0000000-0000-0000-0000-000000000002',
 'Trail Launch — Social','Square crop','social_post','in_review',1,1080,1080,'assets/northwind/trail-social.png','b0000000-0000-0000-0000-000000000001');

-- ---------- ASSET VERSIONS (D4 fix) ----------
insert into asset_versions (asset_id, org_id, version_no, storage_path, prompt, negative_prompt, model, params, quality_score, created_by) values
('e0000000-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111',1,'assets/lumen/summer-ig-square-v1.png',
 'minimalist summer skincare serum on ceramic riser, coral and cream palette, soft natural light',
 'blurry, watermark, harsh shadows','FLUX.1-schnell',
 '{"width":1080,"height":1080,"steps":4}'::jsonb, 78.5,'a0000000-0000-0000-0000-000000000003'),
('e0000000-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111',2,'assets/lumen/summer-ig-square-v2.png',
 'minimalist summer skincare serum on matte ceramic riser, coral accent under one third of frame, cream ground, soft diffused window light, product-forward',
 'blurry, watermark, harsh shadows, model, lifestyle scene','FLUX.1-schnell',
 '{"width":1080,"height":1080,"steps":4}'::jsonb, 91.2,'a0000000-0000-0000-0000-000000000003'),
('e0000000-0000-0000-0000-000000000008','11111111-1111-1111-1111-111111111111',3,'assets/lumen/spring-banner-v3.png',
 'spring skincare banner, pale green and cream','saturated, cluttered','FLUX.1-schnell',
 '{"width":1200,"height":400,"steps":4}'::jsonb, 84.0,'a0000000-0000-0000-0000-000000000003');

-- ---------- APPROVALS (D6 fix: linked to asset) ----------
insert into approvals (org_id, asset_id, reviewer_id, decision, comment, requested_by, requested_at, decided_at) values
('11111111-1111-1111-1111-111111111111','e0000000-0000-0000-0000-000000000003','a0000000-0000-0000-0000-000000000004','approved','Palette and spacing on brand. Ship it.','a0000000-0000-0000-0000-000000000003', now() - interval '3 days', now() - interval '2 days'),
('11111111-1111-1111-1111-111111111111','e0000000-0000-0000-0000-000000000005','a0000000-0000-0000-0000-000000000004','rejected','Coral covers more than half the frame and the gradient is off-brand. Rework with cream dominant.','a0000000-0000-0000-0000-000000000003', now() - interval '2 days', now() - interval '1 day'),
-- pending: drives the Approvals queue in the demo
('11111111-1111-1111-1111-111111111111','e0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000004',null,null,'a0000000-0000-0000-0000-000000000003', now() - interval '6 hours', null),
('22222222-2222-2222-2222-222222222222','e0000000-0000-0000-0000-000000000010','b0000000-0000-0000-0000-000000000001',null,null,'b0000000-0000-0000-0000-000000000001', now() - interval '1 day', null);

-- ---------- TEMPLATES ----------
insert into templates (org_id, title, category, spec, is_public) values
(null,'Instagram Square Promo','social_post','{"width":1080,"height":1080,"zones":["headline","product","cta"]}'::jsonb,true),
(null,'Instagram Story','story','{"width":1080,"height":1920,"zones":["headline","product","swipe"]}'::jsonb,true),
(null,'Email Header Banner','banner','{"width":1200,"height":400,"zones":["logo","headline","cta"]}'::jsonb,true),
(null,'Facebook Link Preview','banner','{"width":1200,"height":630,"zones":["headline","image"]}'::jsonb,true),
(null,'Product Grid Tile','social_post','{"width":1080,"height":1080,"zones":["product"]}'::jsonb,true),
(null,'Carousel Slide','social_post','{"width":1080,"height":1080,"zones":["headline","product"]}'::jsonb,true),
('11111111-1111-1111-1111-111111111111','Lumen Seasonal Hero','banner','{"width":1600,"height":600,"zones":["headline","product","cta"],"brand_locked":true}'::jsonb,false),
('11111111-1111-1111-1111-111111111111','Lumen Ingredient Card','social_post','{"width":1080,"height":1350,"zones":["ingredient","claim"],"brand_locked":true}'::jsonb,false);

-- ---------- GENERATION JOBS ----------
insert into generation_jobs (org_id, campaign_id, brand_kit_id, prompt, refined_prompt, status, progress, result_asset_id, created_by) values
('11111111-1111-1111-1111-111111111111','d0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000001',
 'summer sale square ad',
 'minimalist summer skincare serum on matte ceramic riser, coral accent under one third of frame, cream ground, soft diffused window light, product-forward',
 'done',100,'e0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000003'),
('11111111-1111-1111-1111-111111111111','d0000000-0000-0000-0000-000000000002','c0000000-0000-0000-0000-000000000001',
 'autumn moisturiser concept', null,'failed',40,null,'a0000000-0000-0000-0000-000000000003');