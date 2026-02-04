# 常见问题

## `npm` / `node` 命令不存在

请先安装 Node.js（建议 20+，最低 18+），并重新打开终端后确认：

```powershell
node --version
npm --version
```

## 依赖安装很慢 / 失败

你可以切换网络、配置代理，或使用适合你网络环境的镜像源。

## GitHub Pages 打开后样式丢失（资源 404）

这通常是 **站点 base 路径** 没配对：

- 没有自定义域名时（项目页）：一般需要 `base=/UHDWiki/`
- 使用自定义域名时：一般需要 `base=/`

本仓库的 GitHub Actions 会根据是否存在 `docs/public/CNAME` 自动选择：

- 有 `docs/public/CNAME`：使用 `base=/`
- 没有 `docs/public/CNAME`：使用 `base=/UHDWiki/`

如果你启用了自定义域名，建议新增文件 `docs/public/CNAME`，内容为你的域名（例如 `wiki.example.com`）。

