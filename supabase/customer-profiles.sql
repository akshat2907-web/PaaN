create table public.customer_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_customer_profiles_updated_at
before update on public.customer_profiles
for each row execute function public.set_updated_at();

alter table public.customer_profiles enable row level security;

create policy "Customers can read own profile"
on public.customer_profiles
for select
to authenticated
using (auth.uid() = id);

create policy "Customers can insert own profile"
on public.customer_profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy "Customers can update own profile"
on public.customer_profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Admins can read customer profiles"
on public.customer_profiles
for select
to authenticated
using (public.is_admin());

create policy "Admins can update customer profiles"
on public.customer_profiles
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());
