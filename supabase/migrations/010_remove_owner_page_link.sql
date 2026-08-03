-- /owner 頁面已移除，活動連結改指向比較頁
update campaigns
set cta_href = '/compare?category=owner'
where id = 'owner-enterprise';
