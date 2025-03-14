/*
 * @Author: jrucker
 * @Description:
 * @Date: 2024/10/25 18:56:51
 * @LastEditors: jrucker
 * @LastEditTime: 2024/12/09 17:45:15
 */

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as Icons from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

export default function loadComponent(app: any) {
  Object.keys(Icons).forEach(key => {
    app.component(key, Icons[key as keyof typeof Icons])
  })
  app.use(ElementPlus, { size: 'medium', locale: zhCn })
}
