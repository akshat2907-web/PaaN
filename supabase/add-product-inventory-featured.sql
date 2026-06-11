alter table public.products
add column if not exists inventory_count integer not null default 0,
add column if not exists featured boolean not null default false;

alter table public.products
drop constraint if exists products_inventory_count_non_negative;

alter table public.products
add constraint products_inventory_count_non_negative
check (inventory_count >= 0);
