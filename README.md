# VCG Web — 創健佳商業事務所

香港私人貸款及中小企融資配對平台（Next.js 16 + Supabase + Cloudflare R2）。

## 功能概覽

- 私人貸款比較、中小企八成信貸擔保問卷、政府基金（ESS / BUD / EMF）資格自測
- 會員中心、Lead 文件上傳（R2）
- 推廣夥伴（Affiliate）計劃及自助後台
- 管理後台（Leads、產品、活動、Analytics、Affiliate 審核）

## 本地開發

```bash
npm install
cp .env.local.example .env.local
# 編輯 .env.local 填入 Supabase / R2 等金鑰
npm run dev
```

開啟 [http://localhost:3001](http://localhost:3001)（請在 `.env.local` 設定 `NEXT_PUBLIC_SITE_URL=http://localhost:3001`）。

## 環境變數

複製 `.env.local.example` 並填寫：

| 變數 | 必填 | 說明 |
|------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | 是 | Supabase 專案 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 是 | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | 是 | 伺服器端 API / Admin |
| `NEXT_PUBLIC_SITE_URL` | 生產必填 | 正式域名 |
| `R2_*` | 文件上傳 | Cloudflare R2 |
| `RESEND_API_KEY` | 可選 | 新 Lead / Affiliate 電郵通知 |
| `TURNSTILE_*` | 生產建議 | Cloudflare Turnstile 防 spam |

## Supabase Migration

在 Supabase SQL Editor **依序**執行：

```
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_update_sme_campaign.sql
supabase/migrations/003_profiles.sql
supabase/migrations/004_profile_phone_sync.sql
supabase/migrations/005_admin_role.sql
supabase/migrations/006_media_assets.sql
supabase/migrations/007_affiliate_referrals.sql
supabase/migrations/008_affiliate_portal.sql
supabase/migrations/009_profiles_role_security.sql
```

## R2 設定

```bash
node scripts/test-r2.mjs          # 測試連線
node scripts/configure-r2-cors.mjs # 瀏覽器直傳 CORS
```

## PWA（可安裝到手機主畫面）

本站已設定 Progressive Web App：

- `app/manifest.ts` — 應用名稱、圖示、快捷方式
- `public/sw.js` — 離線快取與離線頁
- 手機可「加入主畫面」像 App 一樣開啟

**正式上線必須 HTTPS**（Vercel 預設已支援）。本地測試安裝需用：

```bash
npm run dev -- --experimental-https
```

或在 Chrome DevTools → Application → Manifest 檢查設定。

## 部署（Vercel 建議）

1. 連接 GitHub repo
2. 設定所有 `.env.local.example` 中的生產環境變數
3. 確認 `NEXT_PUBLIC_SITE_URL` 為正式域名
4. 執行上述 Supabase migrations

## 指令

```bash
npm run dev      # 開發伺服器
npm run build    # 生產建置
npm run lint     # ESLint
```

## 管理員

- 預設 admin email：`vcgrouphk@gmail.com`（見 migration 005 或 `ADMIN_EMAILS`）
- 後台：`/admin`

## 法律頁面

- `/privacy` — 私隱政策
- `/disclaimer` — 免責聲明
- `/partner/terms` — 推廣夥伴條款
