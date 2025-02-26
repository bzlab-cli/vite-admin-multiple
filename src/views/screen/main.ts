/*
 * @Author: jrucker
 * @Description:
 * @Date: 2024/10/25 18:56:51
 * @LastEditors: jrucker
 * @LastEditTime: 2024/02/14 15:21:29
 */

import { createApp, Directive } from 'vue'
import App from './app.vue'
import router from './router'
import { store } from './store'
import { loadAllPlugins } from '@/plugins'
import '@/assets/iconfont/iconfont.css'
import '@/styles/index.scss'
import 'normalize.css'
import * as directives from '@/directives'
import './permission'
import 'virtual:svg-icons-register'
// 引入外部字体
import '@/assets/fonts/font.css'

const app = createApp(App)
// 加载所有插件
loadAllPlugins(app)

// 自定义指令
Object.keys(directives).forEach(key => {
  app.directive(key, (directives as { [key: string]: Directive })[key])
})
app.use(store).use(router).mount('#app')
