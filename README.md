# Daymark 日程任務管理網頁

依據本資料夾中的 PRD，使用原生 HTML、CSS 與 JavaScript ES Modules 建立的模組化日程任務管理網頁；不需安裝前端套件。

## 啟動方式

1. 安裝 Node.js 18 或更新版本。
2. 在本資料夾執行 `npm start`，或使用 `node server.cjs`。
3. 用瀏覽器開啟 http://127.0.0.1:4173。

若直接開啟 `index.html`，部分瀏覽器可能限制 ES Modules；建議使用上方本機伺服器方式。

## 模組結構

- `index.html`：頁面入口與應用掛載點
- `server.cjs`：Node.js 內建 HTTP 靜態伺服器
- `src/main.js`：載入樣式並啟動應用
- `src/App.js`：應用狀態、互動事件與資料流程
- `src/components/Sidebar.js`：工作區側欄與月曆
- `src/modules/Header.js`：頂部列、代幣／連續天數、週日期導覽
- `src/modules/Tasks.js`：Past／Now／Complete 三欄、任務卡與子任務
- `src/modules/TaskForm.js`：新增／編輯任務表單與驗證
- `src/modules/Insights.js`：週統計、成就徽章與專注計時器
- `src/utils/tasks.js`：日期處理、任務分組與排序邏輯
- `src/utils/storage.js`：LocalStorage 存取及示範資料
- `src/icons.js`：共用 SVG 圖示
- `src/styles.css`：桌面／平板／手機版響應式樣式

## 已實作功能

- 以日期、時間、重複頻率、描述、代幣獎勵建立／編輯任務。
- 代幣獎勵驗證為大於或等於 0 的整數；未指定截止時間預設 23:59。
- 每個任務最多新增 100 個子任務，並可在卡片中查看及逐項完成。
- 未完成任務依截止日期及時間由早到晚排序，區分 Past 與 Now。
- 完成任務會加上刪除線、移至 Complete 欄並發放代幣；可取消完成，代幣總額同步重算。
- 支援選取日／週、月曆導覽、任務搜尋（Ctrl／⌘ + K）、可收合欄位及新增／編輯／刪除。
- 提供每週完成統計、近期成就與可自訂長度的專注計時器。
- 首次開啟提供示範資料，任務以瀏覽器 LocalStorage 保存。

## PRD 範圍決策

重複選項為不重複、每天、每個平日及每週；此版本先記錄週期設定，不會自動產生下一筆任務，待產品決策後可擴充。時間採瀏覽器所在時區。資料只存在目前瀏覽器，不含登入或雲端同步。完成任務可取消，累積代幣依目前已完成任務獎勵重新計算。完成任務依完成時間由早到晚顯示，因此最新完成者會位於最底部。
