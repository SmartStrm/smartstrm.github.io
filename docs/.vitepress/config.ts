import { defineConfig } from 'vitepress'
import llmstxt from 'vitepress-plugin-llms'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    plugins: [llmstxt({
      ignoreFiles: [
        'help/open-source-software-notice.md'
      ]
    })]
  },
  title: "SmartStrm",
  description: "SmartStrm 用户文档 - 一个媒体库 STRM 文件生成工具",
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  lang: 'zh-CN',
  cleanUrls: true,
  themeConfig: {
    logo: '/icon.svg',
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索',
                buttonAriaLabel: '搜索'
              },
              modal: {
                displayDetails: '显示详细列表',
                resetButtonTitle: '重置搜索',
                backButtonTitle: '关闭搜索',
                noResultsText: '没有结果',
                footer: {
                  selectText: '选择',
                  selectKeyAriaLabel: '输入',
                  navigateText: '导航',
                  navigateUpKeyAriaLabel: '上箭头',
                  navigateDownKeyAriaLabel: '下箭头',
                  closeText: '关闭',
                  closeKeyAriaLabel: 'Esc'
                }
              }
            }
          }
        }
      }
    },
    nav: [
      { text: '指南', link: '/guide/what-is' },
      {
        text: '版本与反馈',
        items: [
          {
            text: '更新日志',
            link: 'https://github.com/Cp0204/SmartStrm/blob/main/VERSION.md'
          },
          {
            text: '问题反馈',
            link: 'https://github.com/Cp0204/SmartStrm/issues'
          }
        ]
      },
      { text: 'Pro', link: 'https://licenserver.0x69.win/store/smartstrm' }
    ],
    sidebar: [
      {
        text: '快速入门',
        items: [
          { text: '项目介绍', link: '/guide/what-is' },
          { text: '快速开始', link: '/guide/usage' },
          { text: '安装部署', link: '/guide/deploy' },
        ]
      },
      {
        text: '功能模块',
        items: [
          { text: '任务管理', link: '/module/tasks' },
          { text: '存储管理', link: '/module/storage' },
          { text: '存储浏览', link: '/module/browser' },
          { text: '插件管理', link: '/module/plugins' },
        ]
      },
      {
        text: '系统设置',
        items: [
          { text: 'STRM 设置', link: '/settings/strm' },
          { text: '影视识别', link: '/settings/manager' },
          { text: '302 代理', link: '/settings/proxy' },
          { text: 'Webhook', link: '/settings/webhook' },
        ]
      },
      {
        text: '帮助支持',
        items: [
          { text: '第三方教程', link: '/help/tutorials' },
          { text: '常见问题', link: '/help/faq' },
          { text: '许可说明', link: '/help/license' },
          { text: '资料资源', link: '/help/resource' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'docker', link: 'https://hub.docker.com/r/Cp0204/SmartStrm' },
      // { icon: 'github', link: 'https://github.com/Cp0204/SmartStrm' },
      { icon: 'telegram', link: 'https://t.me/smartstrm' },
    ],

    footer: {
      message: '',
      copyright: 'Copyright © 2025-2026 Cp0204'
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    outline: {
      level: 'deep',
      label: '页面导航'
    },

    lastUpdated: {
      text: '最后更新于'
    },

    notFound: {
      title: '页面未找到',
      quote: '',
      linkLabel: '前往首页',
      linkText: '回首页'
    },

    langMenuLabel: '多语言',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    skipToContentLabel: '跳转到内容'
  }
})
