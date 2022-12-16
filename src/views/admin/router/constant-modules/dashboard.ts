/*
 * @Author: jrucker
 * @Description:
 * @Date: 2021/10/25 11:12:57
 * @LastEditors: jrucker
 * @LastEditTime: 2022/12/16 15:48:55
 */

import { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/admin/index.vue'

const DashboardRouter: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/admin/dashboard/index.vue'),
        name: 'dashboard',
        meta: {
          title: '首页',
          icon: 'Menu'
        }
      }
    ]
  }
]

export default DashboardRouter
