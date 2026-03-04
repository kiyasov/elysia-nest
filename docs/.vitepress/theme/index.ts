import DefaultTheme from 'vitepress/theme-without-fonts'
import Layout from './layout.vue'
import '../../tailwind.css'

export default {
    extends: DefaultTheme,
    Layout,
}
