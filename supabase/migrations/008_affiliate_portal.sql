-- Affiliate Phase 2: partner accounts, commissions, self-service portal

alter table affiliate_partners add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table affiliate_partners add column if not exists commission_cpl_hkd numeric(10, 2);

create unique index if not exists affiliate_partners_user_id_idx
  on affiliate_partners (user_id)
  where user_id is not null;

create table if not exists affiliate_commissions (
  id uuid primary key default uuid_generate_v4(),
  affiliate_id uuid not null references affiliate_partners(id) on delete cascade,
  period_label text not null,
  lead_count integer not null default 0 check (lead_count >= 0),
  amount_hkd numeric(10, 2) not null default 0 check (amount_hkd >= 0),
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'void')),
  notes text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists affiliate_commissions_affiliate_idx
  on affiliate_commissions (affiliate_id, created_at desc);

alter table affiliate_commissions enable row level security;

create policy "Admin full access affiliate_commissions"
  on affiliate_commissions for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Affiliate read own commissions"
  on affiliate_commissions for select
  using (
    exists (
      select 1 from affiliate_partners
      where affiliate_partners.id = affiliate_commissions.affiliate_id
        and affiliate_partners.user_id = auth.uid()
    )
  );

create policy "Affiliate read own partner record"
  on affiliate_partners for select
  using (auth.uid() = user_id);
