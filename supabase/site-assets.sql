create table public.site_assets (
  id uuid primary key default gen_random_uuid(),
  asset_key text not null unique,
  label text not null,
  asset_type text not null default 'image',
  image_url text,
  alt_text text,
  section text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_site_assets_updated_at
before update on public.site_assets
for each row execute function public.set_updated_at();

alter table public.site_assets enable row level security;

create policy "Public can read site assets"
on public.site_assets
for select
to anon, authenticated
using (true);

create policy "Admins can insert site assets"
on public.site_assets
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update site assets"
on public.site_assets
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete site assets"
on public.site_assets
for delete
to authenticated
using (public.is_admin());

insert into public.site_assets
  (asset_key, label, asset_type, section, sort_order)
values
  ('home_hero_main', 'Homepage hero main image', 'image', 'homepage', 10),
  ('home_hero_secondary', 'Homepage hero secondary image', 'image', 'homepage', 20),
  ('about_main', 'About page main image', 'image', 'about', 10),
  ('about_founder_1', 'Founder image 1', 'image', 'about', 20),
  ('about_founder_2', 'Founder image 2', 'image', 'about', 30),
  ('footer_brand_image', 'Footer brand image', 'image', 'footer', 10)
on conflict (asset_key) do nothing;

create policy "Public can read site asset files"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'site-assets');

create policy "Admins can upload site asset files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'site-assets'
  and public.is_admin()
);

create policy "Admins can update site asset files"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'site-assets'
  and public.is_admin()
)
with check (
  bucket_id = 'site-assets'
  and public.is_admin()
);

create policy "Admins can delete site asset files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'site-assets'
  and public.is_admin()
);
