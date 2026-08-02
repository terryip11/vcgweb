-- 更新八成信貸擔保 campaign 到期日（2025 施政報告延長至 2028-03-31）
-- 若你已執行過 001_initial_schema.sql，只需在 Supabase SQL Editor 執行本檔即可。
-- 請勿重新執行 001，否則會因 table 已存在而報錯。

update campaigns
set
  expires_at = '2028-03-31',
  subtitle = '八成信貸擔保計劃，最高貸款額 HK$1,800 萬，年利率 3-5%，申請期延長至 2028 年 3 月 31 日',
  updated_at = now()
where id = 'sme-guarantee-2026';
