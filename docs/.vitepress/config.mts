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
          items: [
            { text: "Hills", link: "/guide/mobile/hills" },
            { text: "Vidhub", link: "/guide/mobile/vidhub" },
            { text: "Lenna", link: "/guide/mobile/lenna" },
            { text: "Forward", link: "/guide/mobile/forward" },
            { text: "Yamby", link: "/guide/mobile/yamby" }
          ]
        },
        {
          text: "PC端",
          items: [
            { text: "小幻影视", link: "/guide/pc/xiaohuan-yingshi" },
            { text: "Hills Lite", link: "/guide/pc/hills-lite" }
          ]
        },
        {
          text: "技能包",
          items: [
            { text: "重置流量", link: "/guide/skill-pack" },
            { text: "绑定邮箱", link: "/guide/skill-pack/bind-email" },
            { text: "绑定TG", link: "/guide/skill-pack/bind-tg" },
            { text: "套餐导购", link: "/guide/skill-pack/plan-guide" },
            { text: "修改密码", link: "/guide/skill-pack/change-password" },
            { text: "兑换码的创建与使用", link: "/guide/skill-pack/redeem-codes" },
            { text: "剧集申请", link: "/guide/skill-pack/request-series" },
            { text: "洗版申请", link: "/guide/skill-pack/request-remux" },
            { text: "追新申请", link: "/guide/skill-pack/request-new" }
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
