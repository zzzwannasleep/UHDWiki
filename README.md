# UHDWiki

一个基于 **VitePress** 的轻量 Wiki 仓库：内容进 Git，推送到 GitHub 后自动构建并部署为静态站点。

## 本地预览（Windows / PowerShell）

```powershell
npm install
npm run docs:dev
```

## 构建静态站点

```powershell
npm run docs:build
```

构建产物输出到 `docs/.vitepress/dist/`。

## 部署到 GitHub Pages（自动）

已提供工作流：`.github/workflows/pages.yml`。在 GitHub 仓库里启用 Pages，并把 Source 设为 **GitHub Actions**，之后推送到 `main` 会自动构建并部署。

### 自定义域名（配合 Cloudflare）

1. 新增 `docs/public/CNAME`，内容写你的域名（例如 `wiki.example.com`）
2. 在 GitHub 仓库 `Settings → Pages` 里填写同一个域名并启用 HTTPS
3. 在 Cloudflare DNS 把域名解析到 GitHub Pages（按 GitHub Pages 文档配置 CNAME/A 记录）

