create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  requested_role public.role_type;
begin
  requested_role := coalesce((new.raw_user_meta_data->>'role')::public.role_type, 'parent'::public.role_type);

  insert into public.profiles (id, role, full_name, email, subscription_status)
  values (
    new.id,
    requested_role,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    case when requested_role = 'parent'::public.role_type then 'pending' else 'active' end
  )
  on conflict (id) do nothing;

  return new;
end;
$$;
