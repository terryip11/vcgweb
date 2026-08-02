-- VCG Affiliate Platform — Initial Schema

create extension if not exists "uuid-ossp";

create type loan_category as enum (
  'personal',
  'sme',
  'owner',
  'tax',
  'business'
);

create table products (
  id text primary key,
  name text not null,
  provider text not null,
  category loan_category not null default 'personal',
  tagline text not null default '',
  apr numeric(5, 2) not null,
  monthly_flat numeric(5, 2),
  max_amount integer not null,
  max_term_months integer not null,
  features text[] not null default '{}',
  badges text[] not null default '{}',
  exclusive_offer text,
  apply_url text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table campaigns (
  id text primary key,
  title text not null,
  subtitle text not null default '',
  cta_text text not null default '立即申請',
  cta_href text not null default '#compare',
  badge text,
  expires_at date,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table leads (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text not null,
  email text,
  loan_amount integer,
  loan_category loan_category,
  product_id text references products(id) on delete set null,
  source text default 'website',
  status text not null default 'new',
  notes text,
  created_at timestamptz not null default now()
);

create table affiliate_clicks (
  id uuid primary key default uuid_generate_v4(),
  product_id text references products(id) on delete set null,
  campaign_id text references campaigns(id) on delete set null,
  source text default 'website',
  referrer text,
  created_at timestamptz not null default now()
);

alter table products enable row level security;
alter table campaigns enable row level security;
alter table leads enable row level security;
alter table affiliate_clicks enable row level security;

create policy "Public read products"
  on products for select
  using (is_active = true);

create policy "Public read campaigns"
  on campaigns for select
  using (is_active = true);

create policy "Anyone can insert leads"
  on leads for insert
  with check (true);

create policy "Anyone can insert clicks"
  on affiliate_clicks for insert
  with check (true);

-- Seed data
insert into products (id, name, provider, category, tagline, apr, monthly_flat, max_amount, max_term_months, features, badges, exclusive_offer, is_featured, sort_order) values
  ('welend-tax', 'WeLend 稅季貸款', 'WeLend', 'tax', '稅季專享低息 · A.I. 全自動批核', 2.78, null, 1500000, 60, array['大額貸款達月薪 25 倍', '全程網上處理，無須露面'], array['限時', '稅季專享'], 'VCG 客戶專享免手續費諮詢', true, 1),
  ('ua-asia', 'UA 亞洲聯合財務', 'UA 亞洲聯合財務', 'business', '小商務貸款 · 生意周轉更靈活', 1.68, null, 2000000, 60, array['免文件', '特快批核 · 即日放款'], array['最低 APR', '免文件'], 'VCG 獨家配對 · 特快審批通道', true, 2),
  ('public-finance', '大眾財務個人貸款', '大眾財務', 'personal', '生活開支更從容 · 隨借隨還', 4.75, 0.18, 800000, 60, array['快速批核', '隨借隨還超方便'], array['熱門'], null, false, 3),
  ('ok-finance', 'OK 財務小額貸款', 'OK 財務', 'personal', '緊急用錢不用愁 · 特低利息', 3.84, null, 800000, 72, array['還款期長達 72 個月'], array['小額首選'], null, false, 4),
  ('promise-credit', '安信信貸個人貸款', '安信信貸', 'personal', '快速批核 · 無抵押 · 即日放款', 4.75, null, 800000, 72, array['毋須入息證明', '免手續費'], array['免入息'], null, false, 5),
  ('dah-sing', '大新銀行中小企貸款', '大新銀行', 'sme', '營商資金周轉 · 專人跟進', 4.61, 0.11, 2000000, 60, array['最快 24 小時極速批核'], array['24小時批核'], null, true, 6);

insert into campaigns (id, title, subtitle, cta_text, cta_href, badge, expires_at, sort_order) values
  ('tax-season-2026', '稅季貸款限時優惠', 'WeLend 稅季專享 APR 低至 2.78%，VCG 客戶經本網申請享免手續費諮詢及專人跟進', '立即比較稅季貸款', '/compare', '限時', '2026-04-30', 1),
  ('sme-guarantee-2026', '政府中小企融資 · 八成信貸擔保', '八成信貸擔保計劃，最高貸款額 HK$1,800 萬，年利率 3-5%，申請期延長至 2028 年 3 月 31 日', '查看政府融資方案', '/sme', '政府擔保', '2028-03-31', 2),
  ('owner-enterprise', '獨家「業主 + 企業」聯動方案', '免抵押業主貸款最高達物業估值 80%，業主與企業貸款靈活配對', '了解業主貸款', '/owner', 'VCG 獨家', null, 3);
