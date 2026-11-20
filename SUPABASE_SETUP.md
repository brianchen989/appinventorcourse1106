# Supabase 登入與資料庫設定

網站已加入電子郵件／密碼註冊、登入與登出介面，並以 Supabase Auth 驗證。行程與待辦以登入者的 UUID 分別儲存在 `events`、`tasks` 資料表；SQL 已啟用 Row Level Security (RLS)，只允許使用者讀寫自己的資料。密碼交由 Supabase Auth 雜湊保管，本網站不自行存取或儲存密碼。

## 啟用步驟
1. 在 Supabase 建立一個新專案。
2. 開啟 Dashboard → SQL Editor，執行本資料夾的 `supabase/schema.sql`。
3. 從 Project Settings → API 複製 Project URL 與 Publishable/anon key。不要使用 `service_role` secret。
4. 在 `index.html` 搜尋 `YOUR_SUPABASE_PROJECT_URL` 與 `YOUR_SUPABASE_PUBLISHABLE_KEY`，替換為專案 URL 與公開金鑰。公開金鑰只有在 RLS 正確啟用時才可放在前端。
5. 在 Authentication → URL Configuration 設定本網站的 Site URL 與允許的 Redirect URLs。測試時可使用本機靜態伺服器網址；直接以 `file://` 開啟可能無法正常使用模組載入或驗證回跳。
6. 若採用電子郵件驗證，設定 SMTP／郵件服務，並完成註冊驗證後再登入。

## 資料與安全
- 每個帳號的行程與待辦都帶有 `user_id`，RLS policy 以 `auth.uid()` 強制隔離。
- 刪除 Supabase Auth 使用者時，相關資料會因 `on delete cascade` 一併刪除。
- 前端不得放入 service-role key、資料庫密碼或任何私密金鑰。
- 本次新增程式與 SQL 尚未連接或部署到你的 Supabase 專案；必須先完成以上設定才能真正建立雲端帳號與資料庫。

## 注意
目前首次登入後若帳號沒有資料，程式會將範例行程與待辦寫入該帳號的資料表，以保留示範初始內容。若想從空白資料開始，可在 `index.html` 的 `loadData()` 函式移除 `starterEvents` / `starterTasks` 初始化區段。
