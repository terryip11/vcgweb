-- Prevent members from self-escalating to admin via profiles.role update

create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    new.role := old.role;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_role_trigger on profiles;

create trigger protect_profile_role_trigger
  before update on profiles
  for each row
  execute function public.protect_profile_role();

-- Only admins may change another user's role (future admin UI)
create policy "Admin update profiles"
  on profiles for update
  using (public.is_admin())
  with check (public.is_admin());
