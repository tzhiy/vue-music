import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import lazyPlugin from 'vue3-lazy'
// 全局引入 v-loading 指令
import loadingDirective from './components/base/loading/directive'

// 全局引入样式文件
import '@/assets/scss/index.scss'

// 使用 vue3-lazy 设置懒加载的默认加载图片
// 使用 directive 注册自定义指令
createApp(App).use(store).use(router).use(lazyPlugin, {
  loading: require('@/assets/images/default.png')
}).directive('loading', loadingDirective).mount('#app')
