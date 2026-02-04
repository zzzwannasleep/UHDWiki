import { defineConfig } from "vitepress";

const base = process.env.VITEPRESS_BASE ?? "/";

export default defineConfig({
  base,
  lang: "zh-CN",
  title: "UHDWiki",
  description: "UHD 相关知识库",

  lastUpdated: true,

  themeConfig: {
    nav: [
      { text: "指南", link: "/guide/getting-started" },
      { text: "参考", link: "/reference/structure" }
    ],

    sidebar: {
      "/guide/": [
        {
          text: "指南",
          items: [
            { text: "快速开始", link: "/guide/getting-started" },
            { text: "写作规范", link: "/guide/writing" }
          ]
        }
      ],
      "/reference/": [
        {
          text: "参考",
          items: [
            { text: "目录结构", link: "/reference/structure" },
            { text: "常见问题", link: "/reference/faq" }
          ]
        }
      ]
    },

    search: {
      provider: "local"
    }
  }
});

