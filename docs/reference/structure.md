# 目录结构

默认约定如下（可按需调整）：

```
.
├─ docs/                 # Wiki 内容（Markdown）
│  ├─ .vitepress/         # VitePress 配置
│  ├─ index.md            # 首页
│  ├─ guide/              # 指南/教程
│  └─ reference/          # 参考/FAQ
├─ package.json           # Node 依赖与脚本
└─ .github/workflows/     # CI/CD（自动构建部署）
```

## 重要文件

- `docs/.vitepress/config.mts`：控制站点配置（导航、侧边栏、搜索等）
- `docs/`：内容目录，放 Markdown 页面
