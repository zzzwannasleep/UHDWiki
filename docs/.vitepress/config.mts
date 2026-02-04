import { defineConfig } from "vitepress";

const base = process.env.VITEPRESS_BASE ?? "/";

export default defineConfig({
  base,
  lang: "zh-CN",
  title: "UHDWiki",
  description: "UHD 相关知识库",
  head: [
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        href: `${base}UHDblack.png`,
        media: "(prefers-color-scheme: light)"
      }
    ],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        href: `${base}UHDwhite.png`,
        media: "(prefers-color-scheme: dark)"
      }
    ],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        href: `${base}UHDblack.png`
      }
    ]
  ],

  lastUpdated: true,

  themeConfig: {
    nav: [
      { text: "主站", link: "https://www.uhdnow.com" },
      { text: "网页端", link: "https://www.uhdnow.com/browser" }
    ],

    sidebar: {
      "/guide/": [
        {
          text: "指南",
          items: [
            { text: "快速开始", link: "/guide/QuickStart" },
            { text: "写作规范", link: "/guide/writing" }
          ]
        },
        {
          text: "手机端",
          items: [{ text: "总览", link: "/guide/mobile/overview" }]
        },
        {
          text: "PC端",
          items: [
            { text: "小幻影视", link: "/guide/pc/xiaohuan-yingshi" },
            { text: "Hills Lite", link: "/guide/pc/hills-lite" },
            { text: "技能包", link: "/guide/pc/skill-pack" }
          ]
        }
      ],
      "/reference/": [
        {
          text: "参考",
          items: [
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
