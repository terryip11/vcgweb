-- 同一香港 IP + ref 24 小時內只計一次有效點擊

alter table affiliate_clicks
  add column if not exists visitor_ip_hash text,
  add column if not exists counts_for_stats boolean not null default true;

create index if not exists affiliate_clicks_hk_dedup_idx
  on affiliate_clicks (visitor_ip_hash, referral_code, created_at desc)
  where counts_for_stats = true
    and country_code = 'HK'
    and visitor_ip_hash is not null
    and referral_code is not null;
