import { defineConfig } from 'vitepress'
import footnote from 'markdown-it-footnote'
import llmstxt from 'vitepress-plugin-llms'
import { mermaidPlugin } from './plugins/vitepress-mermaid'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    plugins: [
      llmstxt({
        ignoreFiles: [
          'help/open-source-software-notice.md'
        ]
      })
    ],
    server: {
      host: '0.0.0.0',
    }
  },
  sitemap: {
    hostname: 'https://smartstrm.github.io'
  },
  markdown: {
    config: (md) => {
      md.use(footnote)
      md.use(mermaidPlugin)
    }
  },
  title: "SmartStrm",
  description: "SmartStrm 用户文档 - 一个媒体库 STRM 文件生成工具",
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  lang: 'zh-CN',
  cleanUrls: true,
  rewrites: {
    "help/changelog.md": "changelog.md"
  },
  themeConfig: {
    logo: '/icon.svg',
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: 'algolia',
      options: {
        appId: 'TJNGE094S4',
        apiKey: '5fb52936d39c71feb19bb1b4322b70d0',
        indexName: 'smartstrm.github.io',
        mode: 'auto',
        askAi: {
          assistantId: 'sUOZ1ZDbGjGA',
          sidePanel: {
            panel: {
              variant: 'floating',
              side: 'right',
              width: '480px',
              expandedWidth: '680px',
              suggestedQuestions: true
            }
          }
        },
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索',
                buttonAriaLabel: '搜索'
              },
              modal: {
                searchBox: {
                  clearButtonTitle: '清除',
                  clearButtonAriaLabel: '清除查询',
                  closeButtonText: '关闭',
                  closeButtonAriaLabel: '关闭',
                  placeholderText: '搜索文档或向 AI 提问',
                  placeholderTextAskAi: '再问一个问题...',
                  placeholderTextAskAiStreaming: '正在回答...',
                  searchInputLabel: '搜索',
                  backToKeywordSearchButtonText: '返回关键词搜索',
                  backToKeywordSearchButtonAriaLabel: '返回关键词搜索',
                  newConversationPlaceholder: '提问',
                  conversationHistoryTitle: '我的对话历史',
                  startNewConversationText: '开始新的对话',
                  viewConversationHistoryText: '对话历史',
                  threadDepthErrorPlaceholder: '对话已达上限'
                },
                newConversation: {
                  newConversationTitle: '我今天能帮你什么？',
                  newConversationDescription: '我会搜索你的文档，快速帮你找到设置指南、功能细节和故障排除提示。'
                },
                footer: {
                  selectText: '选择',
                  submitQuestionText: '提交问题',
                  selectKeyAriaLabel: '回车键',
                  navigateText: '导航',
                  navigateUpKeyAriaLabel: '向上箭头',
                  navigateDownKeyAriaLabel: '向下箭头',
                  closeText: '关闭',
                  backToSearchText: '返回搜索',
                  closeKeyAriaLabel: 'Esc 键',
                  poweredByText: '提供支持'
                },
                errorScreen: {
                  titleText: '无法获取结果',
                  helpText: '你可能需要检查网络连接。'
                },
                startScreen: {
                  recentSearchesTitle: '最近',
                  noRecentSearchesText: '暂无最近搜索',
                  saveRecentSearchButtonTitle: '保存此搜索',
                  removeRecentSearchButtonTitle: '从历史记录中移除此搜索',
                  favoriteSearchesTitle: '收藏',
                  removeFavoriteSearchButtonTitle: '从收藏中移除此搜索',
                  recentConversationsTitle: '最近对话',
                  removeRecentConversationButtonTitle: '从历史记录中移除此对话'
                },
                noResultsScreen: {
                  noResultsText: '未找到相关结果',
                  suggestedQueryText: '尝试搜索',
                  reportMissingResultsText: '认为此查询应该有结果？',
                  reportMissingResultsLinkText: '告诉我们。'
                },
                resultsScreen: {
                  askAiPlaceholder: '询问 AI：',
                  noResultsAskAiPlaceholder: '文档里没找到？让 Ask AI 帮忙：'
                },
                askAiScreen: {
                  disclaimerText: '回答由 AI 生成，可能会出错。请核实。',
                  relatedSourcesText: '相关来源',
                  thinkingText: '思考中...',
                  copyButtonText: '复制',
                  copyButtonCopiedText: '已复制！',
                  copyButtonTitle: '复制',
                  likeButtonTitle: '喜欢',
                  dislikeButtonTitle: '不喜欢',
                  thanksForFeedbackText: '感谢你的反馈！',
                  preToolCallText: '搜索中...',
                  duringToolCallText: '搜索中...',
                  afterToolCallText: '已搜索',
                  stoppedStreamingText: '你已停止此回复',
                  errorTitleText: '聊天错误',
                  threadDepthExceededMessage: '为保持回答准确，此对话已关闭。',
                  startNewConversationButtonText: '开始新的对话'
                }
              }
            },
            askAi: {
              sidePanel: {
                button: {
                  translations: {
                    buttonText: '询问 AI',
                    buttonAriaLabel: '询问 AI'
                  }
                },
                panel: {
                  translations: {
                    header: {
                      title: '询问 AI',
                      conversationHistoryTitle: '我的对话历史',
                      newConversationText: '开始新的对话',
                      viewConversationHistoryText: '对话历史'
                    },
                    promptForm: {
                      promptPlaceholderText: '提问',
                      promptAnsweringText: '正在回答...',
                      promptAskAnotherQuestionText: '再问一个问题',
                      promptDisclaimerText: '回答由 AI 生成，可能会出错。',
                      promptLabelText: '按回车发送，Shift+回车换行。',
                      promptAriaLabelText: '问题输入'
                    },
                    conversationScreen: {
                      preToolCallText: '搜索中...',
                      searchingText: '搜索中...',
                      toolCallResultText: '已搜索',
                      conversationDisclaimer: '回答由 AI 生成，可能会出错。请核实。',
                      reasoningText: '推理中...',
                      thinkingText: '思考中...',
                      relatedSourcesText: '相关来源',
                      stoppedStreamingText: '你已停止此回复',
                      copyButtonText: '复制',
                      copyButtonCopiedText: '已复制！',
                      likeButtonTitle: '喜欢',
                      dislikeButtonTitle: '不喜欢',
                      thanksForFeedbackText: '感谢你的反馈！',
                      errorTitleText: '聊天错误'
                    },
                    newConversationScreen: {
                      titleText: '我今天能帮你什么？',
                      introductionText: '我会搜索你的文档，快速帮你找到设置指南、功能细节和故障排除提示。'
                    },
                    logo: {
                      poweredByText: '提供支持'
                    }
                  }
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
            link: '/changelog'
          },
          {
            text: 'GitHub',
            link: 'https://github.com/Cp0204/SmartStrm'
          },
          {
            text: 'Docker',
            link: 'https://hub.docker.com/r/cp0204/SmartStrm'
          },
          {
            text: '问题反馈',
            link: 'https://github.com/Cp0204/SmartStrm/issues'
          },
        ]
      },
      { text: 'Pro', link: 'https://licenserver.0x69.win/store/smartstrm' }
    ],
    sidebar: [
      {
        text: '快速入门',
        items: [
          { text: '项目介绍', link: '/guide/what-is' },
          { text: '快速部署', link: '/guide/deploy' },
          { text: '开始使用', link: '/guide/usage' },
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
          { text: '资源与技巧', link: '/help/resource' },
          { text: '常见问题', link: '/help/faq' },
          { text: '许可说明', link: '/help/license' },
          { text: '关于', link: '/help/about' },
        ]
      }
    ],

    socialLinks: [
      // { icon: 'docker', link: 'https://hub.docker.com/r/Cp0204/SmartStrm' },
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
