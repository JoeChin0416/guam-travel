# 關島家庭旅遊 App (Guam Vacation 2026)

這是一個專為 2026 年關島家庭旅行設計的行程管理 App，支援行程規劃、記帳分攤、購物清單與行前準備檢查。

## 🌟 專案特色

*   **Google 登入驗證**：安全性高，不用記額外密碼。
*   **Email 白名單機制**：只有受邀的親友 (在名單內的 Email) 才能登入使用。
*   **完全免費部署**：前端使用 GitHub Pages，後端使用 Firebase Free Plan。

---

## ⚙️ 安裝與設定 (Setup)

### 1. 建立專案
如果您是從零開始，請確保您的電腦已安裝 Node.js，並建立 React 專案：
```bash
npx create-react-app guam-trip --template typescript
cd guam-trip
npm install firebase lucide-react
```
*將本專案的程式碼 (src 資料夾內容) 複製到您的專案中。*

### 2. 設定 Firebase
1.  前往 [Firebase Console](https://console.firebase.google.com/) 建立新專案。
2.  **Authentication**: 開啟 "Google" 登入供應商。
3.  **Firestore Database**: 建立資料庫。
4.  **專案設定**: 取得 SDK 設定檔 (API Key 等)。
5.  在專案根目錄建立 `.env` 檔案，填入金鑰 (請參考下方範例)。

### 3. 設定白名單 (重要！)
**在首次部署前，您必須將自己的 Email 加入白名單，否則連您自己都無法登入！**

開啟 `constants.ts`，修改 `INITIAL_MEMBERS`：

```typescript
export const INITIAL_MEMBERS: Member[] = [
    { id: '1', name: '您的名字', email: 'your.email@gmail.com' }, // <--- 修改這裡
    { id: '2', name: '親友A', email: 'friend@gmail.com' },
];
```

---

## 🚀 部署到 GitHub Pages (Deployment)

React 網站無法直接拖曳 `.tsx` 檔案上傳，必須經過「編譯 (Build)」成瀏覽器看得懂的 HTML/JS 檔案。

### 步驟一：準備 GitHub Repo
1.  在 GitHub 建立一個 Public Repository (例如 `guam-trip`)。
2.  在您的 `package.json` 中新增 `homepage` 欄位：
    ```json
    "homepage": "https://<您的GitHub帳號>.github.io/guam-trip",
    ```

### 步驟二：設定部署指令
在 `package.json` 的 `scripts` 區塊中加入：
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build",
  // ... 其他指令
}
```
並安裝部署工具：
```bash
npm install gh-pages --save-dev
```

### 步驟三：設定 Firebase 授權網域 (必做)
為了讓 Google 登入能運作，需授權 GitHub Pages 網址：
1.  Firebase Console -> Authentication -> Settings -> Authorized domains。
2.  新增網域：`<您的帳號>.github.io`。

### 步驟四：編譯並部署
在終端機執行：
```bash
npm run deploy
```
*此指令會自動編譯程式碼，並將生成的網頁上傳到 GitHub 的 `gh-pages` 分支。*

---

## ❓ 常見問題

**Q: 我部署後打開網頁是一片白？**
A: 請檢查 `package.json` 中的 `homepage` 網址是否正確，必須與您的 GitHub Pages 網址完全一致。

**Q: 登入時顯示 "Auth domain not authorized"？**
A: 請回到 Firebase Console 的 Authentication 設定，確認已將 `xxx.github.io` 加入授權網域。

**Q: 登入後顯示 "不在邀請名單中"？**
A: 代表您登入的 Email 沒有在 `constants.ts` 的 `INITIAL_MEMBERS` 裡，或者 Firestore 資料庫中的 `members` 集合裡沒有您的資料。請確認 Email 拼寫正確。
