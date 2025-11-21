# RAD Studio · Behance Showcase (Next.js)

现代化、前后端分离的作品集站点：Next.js + 自建 API 代理 Behance。样式重构为设计工作室风格，所有 UI 文案集中在 `content/strings/zh.json` 方便多语言扩展。

## 主要特性
- Next.js（Pages Router）+ React 组件化，适配 Vercel 一键部署。
- API Routes 代理 Behance：`/api/behance`、`/api/behance/projects/[id]`，纯 JSON，无前端耦合。
- 统一头部/页脚组件，作品列表、详情、关于、联系页面样式一致。
- 文案集中管理：`content/strings/zh.json`，后续可添加多语文件并按需切换。
- 设计更新：深色渐变背景、强调色、统一排版与卡片网格。

## 开发
```bash
npm install
npm run dev
```
本地默认使用 `config/config.js` 中的 `behance.clientId` 和 `behance.defaultUser`，也可设置环境变量：
- `BEHANCE_CLIENT_ID`（必填，上线请用环境变量）
- `NEXT_PUBLIC_BEHANCE_USER`（前端默认用户，可选）

## 生产 / Vercel
1. 在 Vercel 项目环境变量中配置 `BEHANCE_CLIENT_ID` 与可选的 `NEXT_PUBLIC_BEHANCE_USER`。
2. 直接 `vercel` 或推送到绑定分支，Vercel 会自动构建 Next.js 并生成 Serverless API。

## 项目结构（核心）
- `pages/`：Next 页（`index`, `about`, `contact`, `project/[id]`）与 API 路由。
- `components/`：头部、页脚、作品卡片、模块渲染等。
- `content/strings/zh.json`：所有 UI 文案字典。
- `styles/`：全局样式与组件样式。
- `config/config.js`：后端默认配置（Behance clientId / default user）。

## 可继续优化
- 增加多语言切换（按需加载其他语言 JSON）。
- 加入 SWR/React Query 做缓存与错误重试。
- 为作品详情添加骨架屏、懒加载与占位图优化。
