/*
 * @Author: jrucker
 * @Description:
 * @Date: 2021/11/25 00:01:20
 * @LastEditors: jrucker
 * @LastEditTime: 2023/02/14 11:58:21
 */

import { App } from 'vue'
import SvgIcon from './index.vue'

SvgIcon.install = (app: App): void => {
  app.component(SvgIcon.name, SvgIcon)
}

export default SvgIcon
