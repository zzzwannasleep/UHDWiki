# 快速开始

## 0) 准备环境

- 安装 Node.js（建议 20+，最低 18+）
- 确认已安装 `npm`（Node 自带）

```powershell
node --version
npm --version
```

## 1) 安装依赖

在仓库根目录执行：

```powershell
npm install
```

## 2) 本地预览

```powershell
npm run docs:dev
```

然后在浏览器打开终端输出的本地地址（通常是 `http://localhost:5173/`）。

## 3) 新增页面

1. 在 `docs/` 下创建 Markdown 文件，例如：`docs/guide/new-page.md`
2. 在 `docs/.vitepress/config.mts` 中添加导航条目（`nav` / `sidebar`），例如：

```ts
// docs/.vitepress/config.mts
// sidebar: { "/guide/": [ { items: [ { text: "新页面", link: "/guide/new-page" } ] } ] }
```

## 4) 构建静态站点

```powershell
npm run docs:build
```

构建产物输出到 `docs/.vitepress/dist/`（已在 `.gitignore` 里忽略）。
