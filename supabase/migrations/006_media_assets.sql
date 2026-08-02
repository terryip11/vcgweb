-- Cloudflare R2 media assets metadata

create table media_assets (
  id uuid primary key default uuid_generate_v4(),
  object_key text not null unique,
  entity_type text not null
    check (entity_type in ('lead', 'product', 'campaign', 'profile', 'site')),
  entity_id text,
  category text not null,
  original_name text,
  mime_type text not null,
  size_bytes integer not null check (size_bytes > 0),
  is_public boolean not null default false,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index media_assets_entity_idx
  on media_assets (entity_type, entity_id);

alter table products add column if not exists image_url text;
alter table campaigns add column if not exists image_url text;

alter table media_assets enable row level security;

create policy "Admin full access media"
  on media_assets for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Users read own profile media"
  on media_assets for select
  using (entity_type = 'profile' and entity_id = auth.uid()::text);

create policy "Users read own lead media"
  on media_assets for select
  using (
    entity_type = 'lead'
    and exists (
      select 1 from leads
      where leads.id::text = media_assets.entity_id
        and leads.user_id = auth.uid()
    )
  );
