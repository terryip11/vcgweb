-- 推廣點擊 / 查詢記錄訪客國家（用於僅統計香港 IP）

alter table affiliate_clicks
  add column if not exists country_code text;

alter table leads
  add column if not exists country_code text;

create index if not exists affiliate_clicks_ref_country_idx
  on affiliate_clicks (referral_code, country_code)
  where referral_code is not null;

create index if not exists leads_ref_country_idx
  on leads (referral_code, country_code)
  where referral_code is not null;
