/*
 * @Description: 登录路由
 * @Author: jrucker
 * @Date: 2021-10-21 18:04:55
 * @LastEditors: jrucker
 * @LastEditTime: 2024/12/19 13:43:55
 */
import { RouteRecordRaw } from 'vue-router'
const LayoutRouter: Array<RouteRecordRaw> = [
  {
    path: '/layout',
    component: () => import('@/layout/admin/index.vue'),
    name: 'layout',
    meta: {
      hidden: true
    }
  }
]
export default LayoutRouter
