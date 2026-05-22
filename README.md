# Taiwan Basketball Data Frontend

台灣籃球資料網站前端，主要展示 PLG 2025-26 賽季賽程、已完賽比分與單場 box score 數據。專案使用 Next.js App Router、React、TypeScript 與 Chakra UI 建置。

## 功能

- PLG 2025-26 賽季賽程列表
- 依全部賽事、收藏球隊或指定球隊篩選賽程
- 收藏球隊並在頁首顯示球隊 Logo
- 單場賽事詳細頁，包含比分、節次得分、得分分布、團隊數據與球員數據
- 明暗色模式切換
- Google Analytics 追蹤碼設定於根 layout

## 技術棧

- Next.js 16
- React 19
- TypeScript
- Chakra UI
- Zustand
- Framer Motion
- Recharts
- TanStack React Table

## 開始使用

安裝依賴：

```bash
npm install
```

建立環境變數檔案：

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3100
```

啟動開發伺服器：

```bash
npm run dev
```

預設會啟動在 `http://localhost:3000`。

## 可用指令

```bash
npm run dev
```

啟動 Next.js 開發伺服器。

```bash
npm run build
```

建立 production build。

```bash
npm run start
```

啟動 production server，需先執行 `npm run build`。

```bash
npm run lint
```

執行 ESLint 檢查。

## 環境變數

| 變數 | 說明 | 範例 |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | 後端 API base URL | `http://localhost:3100` |

目前前端會呼叫以下 API：

- `GET /api/schedule?leagueCode=PLG&season=2025-26`
- `GET /api/games/:gameId/boxscore`

API 回應格式預期為：

```ts
type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  code?: string;
};
```

## 專案結構

```text
app/                 Next.js App Router 頁面與全域設定
components/          共用 layout、theme 與 UI 元件
features/home/       首頁賽程功能、API 與型別
features/games/      單場賽事詳細數據功能、API 與型別
lib/api/             共用 API client、錯誤與回應型別
stores/              Zustand 狀態管理
data/                本地資料檔
public/              靜態圖片資源
```

## 頁面路由

| 路由 | 說明 |
| --- | --- |
| `/` | 首頁，顯示 PLG 賽程與篩選器 |
| `/home` | 同樣渲染首頁功能 |
| `/games/[gameId]` | 單場賽事 box score 詳細頁 |

## 開發注意事項

- 前端依賴後端 API，開發前需先確認 `NEXT_PUBLIC_API_BASE_URL` 指向可用服務。
- 賽程頁目前固定查詢 `PLG` 與 `2025-26`。
- 單場詳細頁會透過賽程 API 產生已完賽賽事的靜態參數。
- 若要分析 bundle，可設定 `ANALYZE=true` 後執行 build。

