create table if not exists platform_presets (
  key         text primary key,
  label       text not null,
  width       int  not null,
  height      int  not null,
  aspect      text not null,
  description text
);

insert into platform_presets (key, label, width, height, aspect, description) values
  ('instagram_square', 'Instagram Post',    1080, 1080, '1:1',  'Feed post, square'),
  ('instagram_story',  'Instagram Story',   1080, 1920, '9:16', 'Full-screen vertical'),
  ('facebook_link',    'Facebook Link',     1200,  630, '16:9', 'Link preview card'),
  ('linkedin_post',    'LinkedIn Post',     1200, 1200, '1:1',  'Feed post'),
  ('email_banner',     'Email Banner',      1200,  400, '3:1',  'Newsletter header'),
  ('web_hero',         'Website Hero',      1600,  600, '8:3',  'Landing page banner'),
  ('pinterest_pin',    'Pinterest Pin',     1000, 1500, '2:3',  'Tall pin')
on conflict (key) do update
  set label = excluded.label, width = excluded.width,
      height = excluded.height, aspect = excluded.aspect;