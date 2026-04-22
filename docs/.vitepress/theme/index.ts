import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import VitePressMermaid from '../plugins/vitepress-mermaid/index.vue'
import WebhookTester from './components/WebhookTester.vue'
import './styles.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('vitepress-mermaid', VitePressMermaid)
    app.component('WebhookTester', WebhookTester)
  },
} satisfies Theme