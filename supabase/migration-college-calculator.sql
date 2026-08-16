-- ============================================
-- Migration: Persist 529 College Savings Calculator inputs per household
-- Run this in the Supabase SQL Editor.
-- ============================================

create table if not exists college_calculator (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households(id) on delete cascade unique,
  user_id uuid references auth.users(id),
  monthly_contribution numeric default 250,
  initial_deposit numeric default 0,
  expected_return numeric default 7,
  years integer default 18,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table college_calculator enable row level security;

-- Household-based access, matching the rest of the app
-- (get_my_household_id() is defined in migration-household.sql).
drop policy if exists "Household can view college_calculator" on college_calculator;
drop policy if exists "Household can insert college_calculator" on college_calculator;
drop policy if exists "Household can update college_calculator" on college_calculator;

create policy "Household can view college_calculator" on college_calculator
  for select using (household_id = get_my_household_id());
create policy "Household can insert college_calculator" on college_calculator
  for insert with check (household_id = get_my_household_id());
create policy "Household can update college_calculator" on college_calculator
  for update using (household_id = get_my_household_id());
