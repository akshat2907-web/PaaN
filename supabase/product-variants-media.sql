create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  color_name text not null,
  color_hex text,
  price_override numeric(10,2),
  inventory_count integer,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_variants_inventory_non_negative
    check (inventory_count is null or inventory_count >= 0)
);

create trigger set_product_variants_updated_at
before update on public.product_variants
for each row execute function public.set_updated_at();

alter table public.product_variants enable row level security;

create policy "Public can read variants for published products"
on public.product_variants
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.products
    where products.id = product_variants.product_id
    and products.status = 'published'
  )
);

create policy "Admins can read all product variants"
on public.product_variants
for select
to authenticated
using (public.is_admin());

create policy "Admins can insert product variants"
on public.product_variants
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update product variants"
on public.product_variants
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete product variants"
on public.product_variants
for delete
to authenticated
using (public.is_admin());

alter table public.product_images
add column if not exists media_type text not null default 'image',
add column if not exists variant_id uuid references public.product_variants(id) on delete set null,
add column if not exists thumbnail_url text;

alter table public.product_images
drop constraint if exists product_images_media_type_check;

alter table public.product_images
add constraint product_images_media_type_check
check (media_type in ('image', 'video'));

create index if not exists product_variants_product_id_sort_idx
on public.product_variants (product_id, sort_order);

create index if not exists product_images_variant_id_sort_idx
on public.product_images (variant_id, sort_order);
