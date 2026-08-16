-- SEO / GEO 財經資訊文章
create table if not exists blog_posts (
  slug text primary key,
  title text not null,
  excerpt text not null default '',
  meta_description text not null default '',
  keywords text[] not null default '{}',
  category text not null default 'guide',
  body text not null default '',
  faq jsonb not null default '[]'::jsonb,
  reading_minutes integer not null default 5,
  is_active boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table blog_posts enable row level security;

create policy "Public read active blog posts"
  on blog_posts for select
  using (is_active = true and published_at <= now());

create policy "Admin read all blog posts"
  on blog_posts for select
  using (public.is_admin());

create policy "Admin write blog posts"
  on blog_posts for all
  using (public.is_admin())
  with check (public.is_admin());

create index if not exists blog_posts_published_idx
  on blog_posts (published_at desc)
  where is_active = true;
