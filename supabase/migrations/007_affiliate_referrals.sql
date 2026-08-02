-- Affiliate Phase 1: referral tracking + partner applications

alter table leads add column if not exists referral_code text;
alter table affiliate_clicks add column if not exists referral_code text;

create index if not exists leads_referral_code_idx
  on leads (referral_code)
  where referral_code is not null;

create index if not exists affiliate_clicks_referral_code_idx
  on affiliate_clicks (referral_code)
  where referral_code is not null;

create table if not exists affiliate_partners (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text,
  phone text not null,
  channel text,
  website text,
  audience text,
  referral_code text unique,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'suspended')),
  notes text,
  created_at timestamptz not null default now(),
  approved_at timestamptz
);

create index if not exists affiliate_partners_status_idx
  on affiliate_partners (status);

alter table affiliate_partners enable row level security;

create policy "Admin full access affiliate_partners"
  on affiliate_partners for all
  using (public.is_admin())
  with check (public.is_admin());
