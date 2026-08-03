-- 同一香港電話 24 小時內只計 1 宗有效查詢（推廣統計用）

alter table leads
  add column if not exists counts_for_stats boolean not null default true;

create index if not exists leads_hk_phone_dedup_idx
  on leads (phone, created_at desc)
  where counts_for_stats = true
    and country_code = 'HK';

create index if not exists leads_ref_country_counted_idx
  on leads (referral_code, country_code)
  where counts_for_stats = true
    and referral_code is not null;
