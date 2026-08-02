-- Admin role + RLS policies for management backend

alter table profiles
  add column if not exists role text not null default 'member'
  check (role in ('member', 'admin'));

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Auto-assign admin on registration
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_role text := 'member';
begin
  if lower(new.email) = 'vcgrouphk@gmail.com' then
    user_role := 'admin';
  end if;

  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url',
    user_role
  );
  return new;
end;
$$;

-- Promote existing admin account if already registered
update profiles
set role = 'admin'
where lower(email) = 'vcgrouphk@gmail.com';

-- Admin: leads full access
create policy "Admin full access leads"
  on leads for all
  using (public.is_admin())
  with check (public.is_admin());

-- Admin: products read all (including inactive) + write
create policy "Admin read all products"
  on products for select
  using (public.is_admin());

create policy "Admin write products"
  on products for all
  using (public.is_admin())
  with check (public.is_admin());

-- Admin: campaigns read all + write
create policy "Admin read all campaigns"
  on campaigns for select
  using (public.is_admin());

create policy "Admin write campaigns"
  on campaigns for all
  using (public.is_admin())
  with check (public.is_admin());

-- Admin: read all profiles
create policy "Admin read all profiles"
  on profiles for select
  using (public.is_admin());

-- Admin: read affiliate clicks
create policy "Admin read affiliate clicks"
  on affiliate_clicks for select
  using (public.is_admin());
