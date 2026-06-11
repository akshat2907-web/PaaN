insert into public.admins (email, role)
values ('pkkanwar08@gmail.com', 'admin')
on conflict (email) do update set role = excluded.role;
