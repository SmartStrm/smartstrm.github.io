import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import VitePressMermaid from '../plugins/vitepress-mermaid/index.vue'
import './styles.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('vitepress-mermaid', VitePressMermaid)
  },
} satisfies Theme