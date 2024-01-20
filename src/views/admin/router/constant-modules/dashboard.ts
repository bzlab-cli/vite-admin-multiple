/*
 * @Author: jrucker
 * @Description:
 * @Date: 2021/10/25 11:12:57
 * @LastEditors: jrucker
 * @LastEditTime: 2024/01/20 14:30:17
 */

import { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/admin/index.vue'

const DashboardRouter: Array<RouteRecordRaw> = [
  {
    path: '/dashboard',
    redirect: '/dashboard/index',
    component: Layout,
    meta: {
      title: '首页',
      icon: 'Menu',
      hidden: true
    },
    children: [
      {
        path: '/dashboard/index',
        component: () => import('@/views/admin/dashboard/index.vue'),
        name: 'dashboard-index',
        meta: {
          title: '首页',
          icon: 'Menu',
          hidden: true
        }
      }
    ]
  }
]

export default DashboardRouter
