/*
 * @Author: jrucker
 * @Description:
 * @Date: 2021/10/25 11:12:57
 * @LastEditors: jrucker
 * @LastEditTime: 2023/06/14 13:42:03
 */

import { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/admin/index.vue'

const DashboardRouter: Array<RouteRecordRaw> = [
  {
    path: '/dashboard',
    component: Layout,
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
