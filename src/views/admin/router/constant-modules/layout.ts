/*
 * @Description: 登录路由
 * @Author: jrucker
 * @Date: 2021-10-21 18:04:55
 * @LastEditors: jrucker
 * @LastEditTime: 2022/12/16 15:49:05
 */
import { RouteRecordRaw } from 'vue-router'
const LoginRouter: Array<RouteRecordRaw> = [
  {
    path: '/layout',
    component: () => import('@/layout/admin/index.vue'),
    name: 'layout',
    meta: {
      hidden: true
    }
  }
]
export default LoginRouter
