alter table public.products
add column if not exists product_type text not null default 'saree';

alter table public.products
drop constraint if exists products_product_type_check;

alter table public.products
add constraint products_product_type_check
check (product_type in ('saree', 'kurta_set', 'suit'));
