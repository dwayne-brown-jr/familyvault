-- ============================================
-- Migration: Persist Insurance Gap Analyzer inputs per household
-- Run this in the Supabase SQL Editor.
-- ============================================

create table if not exists insurance_calculator (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references households(id) on delete cascade unique,
  user_id uuid references auth.users(id),
  annual_salary numeric default 75000,
  years_until_child_independent integer default 22,
  number_of_children integer default 1,
  monthly_expenses numeric default 10000,
  supplemental_coverage numeric default 0,
  spouse_coverage numeric default 0,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table insurance_calculator enable row level security;

-- Household-based access, matching the rest of the app
-- (get_my_household_id() is defined in migration-household.sql).
drop policy if exists "Household can view insurance_calculator" on insurance_calculator;
drop policy if exists "Household can insert insurance_calculator" on insurance_calculator;
drop policy if exists "Household can update insurance_calculator" on insurance_calculator;

create policy "Household can view insurance_calculator" on insurance_calculator
  for select using (household_id = get_my_household_id());
create policy "Household can insert insurance_calculator" on insurance_calculator
  for insert with check (household_id = get_my_household_id());
create policy "Household can update insurance_calculator" on insurance_calculator
  for update using (household_id = get_my_household_id());
