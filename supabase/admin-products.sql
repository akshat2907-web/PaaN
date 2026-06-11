create type product_collection as enum ('classic', 'premium', 'exclusive');
create type product_status as enum ('draft', 'published', 'archived');
create type admin_role as enum ('owner', 'admin');

create table public.admins (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role admin_role not null default 'admin',
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  collection product_collection not null,
  price numeric(10,2) not null,
  fabric text,
  color text,
  description text,
  craft_note text,
  occasion text,
  inventory_count integer not null default 0 check (inventory_count >= 0),
  featured boolean not null default false,
  status product_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

insert into public.admins (email, role)
values
  ('dragonwarrior2907@gmail.com', 'owner'),
  ('pkkanwar08@gmail.com', 'admin')
on conflict (email) do update set role = excluded.role;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1
    from public.admins
    where email = auth.jwt() ->> 'email'
    and role in ('owner', 'admin')
  );
$$ language sql stable security definer;

alter table public.admins enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;

create policy "Admins can read admins"
on public.admins
for select
to authenticated
using (public.is_admin());

create policy "Admins can manage admins"
on public.admins
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read published products"
on public.products
for select
to anon, authenticated
using (status = 'published');

create policy "Admins can read all products"
on public.products
for select
to authenticated
using (public.is_admin());

create policy "Admins can insert products"
on public.products
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update products"
on public.products
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read images for published products"
on public.product_images
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.products
    where products.id = product_images.product_id
    and products.status = 'published'
  )
);

create policy "Admins can read all product images"
on public.product_images
for select
to authenticated
using (public.is_admin());

create policy "Admins can insert product images"
on public.product_images
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update product images"
on public.product_images
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete product images"
on public.product_images
for delete
to authenticated
using (public.is_admin());

create policy "Public can read product image files"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'product-images');

create policy "Admins can upload product image files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'product-images'
  and public.is_admin()
);

create policy "Admins can update product image files"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'product-images'
  and public.is_admin()
)
with check (
  bucket_id = 'product-images'
  and public.is_admin()
);

create policy "Admins can delete product image files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'product-images'
  and public.is_admin()
);
