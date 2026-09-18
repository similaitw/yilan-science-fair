# 宜蘭科展／發明展資料專案

本專案原有宜蘭科展資料分析頁面，並新增 2026 宜蘭縣青少年發明展之研究規劃。

## 2026 發明展主題

### 路面低窪積水自動警示附牌
結合既有「注意路面低窪」警告標誌之免電力可變警示裝置。

- 完整研究說明書：[`docs/invention-lowspot-warning.md`](./docs/invention-lowspot-warning.md)
- 網頁版：部署後請開啟 `/invention/`
- 設計原則：國中生做得出、機構看得懂、數據量得到、問題真實
- 第一代不使用 Arduino、電池或網路，先驗證浮力、槓桿放大、翻牌與自動復歸

## 開發

```bash
npm install
npm run dev
npm run build
```

本專案使用 React + Vite。
