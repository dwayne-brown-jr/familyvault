-- ============================================
-- Migration: Security hardening (Nov 2026)
-- Fixes from the Blueprint stage 0 gap list:
--   G1  users could rewrite their own profiles.household_id and join any household
--   G3  open sign-up -> invite-only sign-up
--   G5  SECURITY DEFINER functions callable through the public API, mutable search_path
--   +   invite acceptance never worked (invitee couldn't read or accept the invite)
-- Safe to run more than once. Applied to production Nov 3, 2026.
-- ============================================

-- ---------- G1: household membership can only change through an invite ----------
-- Users may edit only their own non-security profile fields.
revoke insert, update, delete on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (display_name, household_income, monthly_take_home) on public.profiles to authenticated;

drop policy if exists "Users can insert own profile" on public.profiles;  -- profiles are created by the signup trigger only
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- Households: no free-floating creation from the browser (the signup trigger creates them).
drop policy if exists "Users can create household" on public.households;
revoke insert, delete on public.households from anon, authenticated;

-- ---------- G5: lock down SECURITY DEFINER functions ----------
create or replace function public.get_my_household_id()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select household_id from public.profiles where id = auth.uid()
$$;
revoke execute on function public.get_my_household_id() from public, anon;
grant execute on function public.get_my_household_id() to authenticated;

-- Members of the same household can see each other's display name (Settings > members list).
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can view household profiles" on public.profiles;
create policy "Users can view household profiles" on public.profiles
  for select to authenticated using (auth.uid() = id or household_id = public.get_my_household_id());


create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_household_id uuid;
begin
  insert into public.households (name, created_by)
  values (coalesce(new.raw_user_meta_data->>'display_name', 'My Family') || '''s Family', new.id)
  returning id into new_household_id;

  insert into public.profiles (id, display_name, household_id)
  values (new.id, new.raw_user_meta_data->>'display_name', new_household_id);

  return new;
end;
$$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

do $$
begin
  if exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
             where n.nspname = 'public' and p.proname = 'rls_auto_enable') then
    execute 'revoke execute on function public.rls_auto_enable() from public, anon, authenticated';
  end if;
end $$;

-- ---------- G3: invite-only sign-up ----------
-- New accounts are allowed only for an email with a pending, unexpired household invite.
create or replace function public.enforce_invite_only_signup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.household_invites i
    where lower(i.email) = lower(new.email)
      and i.accepted_at is null
      and i.expires_at > now()
  ) then
    raise exception 'Sign-ups are invite-only for this app.' using errcode = '42501';
  end if;
  return new;
end;
$$;
revoke execute on function public.enforce_invite_only_signup() from public, anon, authenticated;

drop trigger if exists invite_only_signup on auth.users;
create trigger invite_only_signup
  before insert on auth.users
  for each row execute procedure public.enforce_invite_only_signup();

-- ---------- Invites: read and accept on the server ----------
-- Invites can no longer be edited from the browser.
revoke update on public.household_invites from anon, authenticated;

-- Shows the join page who invited you. Only reveals the household name and invited email,
-- and only to someone holding the 64-character random token.
create or replace function public.get_household_invite(p_token text)
returns table (email text, household_name text, is_valid boolean)
language sql
security definer
stable
set search_path = public
as $$
  select i.email,
         h.name,
         (i.accepted_at is null and i.expires_at > now()) as is_valid
  from public.household_invites i
  join public.households h on h.id = i.household_id
  where i.token = p_token
$$;
revoke execute on function public.get_household_invite(text) from public;
grant execute on function public.get_household_invite(text) to anon, authenticated;

-- Accepts an invite for the signed-in user. The signed-in email must match the invited email.
create or replace function public.accept_household_invite(p_token text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
  v_invite public.household_invites%rowtype;
  v_old_household uuid;
  t text;
begin
  if v_uid is null then
    raise exception 'Sign in first.' using errcode = '42501';
  end if;

  select * into v_invite from public.household_invites
  where token = p_token
  for update;

  if not found or v_invite.accepted_at is not null or v_invite.expires_at <= now() then
    raise exception 'This invite is invalid or has expired.' using errcode = '22023';
  end if;

  if lower(v_invite.email) <> v_email then
    raise exception 'This invite was sent to a different email address.' using errcode = '42501';
  end if;

  select household_id into v_old_household from public.profiles where id = v_uid;

  if v_old_household is distinct from v_invite.household_id then
    update public.profiles set household_id = v_invite.household_id where id = v_uid;

    if v_old_household is not null and not exists (
      select 1 from public.profiles where household_id = v_old_household
    ) then
      -- They were the only member: bring everything from their old household
      -- (including starter rows with no user_id), then remove it.
      -- Calculator rows (one per household) are dropped with the old household.
      foreach t in array array[
        'debts','debt_payments','net_worth_snapshots','budget_categories','expenses',
        'contacts','legal_documents','financial_accounts','insurance_policies','monthly_bills',
        'digital_access','letter_of_intent','action_items'
      ] loop
        execute format('update public.%I set household_id = $1 where household_id = $2', t)
          using v_invite.household_id, v_old_household;
      end loop;
      delete from public.household_invites where household_id = v_old_household;
      delete from public.households where id = v_old_household;
    else
      -- Others remain in the old household: bring only the user's own rows.
      foreach t in array array[
        'debts','debt_payments','net_worth_snapshots','budget_categories','expenses',
        'contacts','legal_documents','financial_accounts','insurance_policies','monthly_bills',
        'digital_access','letter_of_intent','action_items'
      ] loop
        execute format('update public.%I set household_id = $1 where user_id = $2', t)
          using v_invite.household_id, v_uid;
      end loop;
    end if;
  end if;

  update public.household_invites set accepted_at = now() where id = v_invite.id;
  return v_invite.household_id;
end;
$$;
revoke execute on function public.accept_household_invite(text) from public, anon;
grant execute on function public.accept_household_invite(text) to authenticated;

-- ---------- Logged-out visitors get no table access ----------
-- Keep SELECT on profiles only so the keep-alive ping (anon key) still gets HTTP 200;
-- RLS returns zero rows to anon.
do $$
declare r record;
begin
  for r in select tablename from pg_tables where schemaname = 'public' loop
    execute format('revoke all on public.%I from anon', r.tablename);
  end loop;
end $$;
grant select on public.profiles to anon;
alter default privileges in schema public revoke all on tables from anon;
