import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'en-US',
  title: 'treemate',
  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
    },
  },
  themeConfig: {
    search:{
      provider:'local',
    },
    sidebar:{
      'zh':[
        {
          text: '介绍',
          items:[
            { text: '介绍', link: '/zh/guide' },
          ]
        }
      ],
      '/':[
        {
          text: 'Guide',
          items:[
            { text: 'Guide', link: '/guide' },
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/07akioni/treemate' },
    ],
  }
})