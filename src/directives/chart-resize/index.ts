/*
 * @Description: 监听绑定的div大小变化，更新图表
 * @Author: jrucker
 * @Date: 2024-07-05 10:39:21
 * @LastEditors: jrucker
 * @LastEditTime: 2024/07/05 11:06:01
 */

import { Directive } from 'vue'
import * as ECharts from 'echarts'
const HANDLER = '_vue_resize_handler'

export const chartResize: Directive = {
  mounted(el, binding) {
    el[HANDLER] = binding.value
      ? binding.value
      : () => {
          const chart = ECharts.getInstanceByDom(el)
          if (!chart) return
          chart.resize()
        }
    window.addEventListener('resize', el[HANDLER])
  },
  unmounted(el) {
    window.removeEventListener('resize', el[HANDLER])
    delete el[HANDLER]
  }
}
