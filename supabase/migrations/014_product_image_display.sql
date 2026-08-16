-- 產品 logo 前台顯示尺寸（後台可調）
alter table products
  add column if not exists image_size_preset text not null default 'md'
    check (image_size_preset in ('sm', 'md', 'lg', 'wide', 'tall', 'custom'));

alter table products
  add column if not exists image_display_width integer
    check (image_display_width is null or (image_display_width >= 24 and image_display_width <= 200));

alter table products
  add column if not exists image_display_height integer
    check (image_display_height is null or (image_display_height >= 24 and image_display_height <= 200));

comment on column products.image_size_preset is '前台 logo 顯示預設：sm/md/lg/wide/tall/custom';
comment on column products.image_display_width is '自訂寬度 (px)，preset=custom 時使用';
comment on column products.image_display_height is '自訂高度 (px)，preset=custom 時使用';
