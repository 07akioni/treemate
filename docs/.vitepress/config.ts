import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'en-US',
  title: 'treemate',
  locales: {
    '/': {
      lang: 'en-US',
      title: 'treemate',
      description: 'Manipulating tree data structure for user interface'
    },
    '/zh/': {
      lang: 'zh-CN',
      title: 'treemate',
      description: 'Manipulating tree data structure for user interface'
    },
  },
  themeConfig: {
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
    localeLinks: {
      text: '',
      items: [
        { text: 'English', link: '/guide' },
        { text: '简体中文', link: '/zh/guide' },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/07akioni/treemate' },
    ],
  }
})