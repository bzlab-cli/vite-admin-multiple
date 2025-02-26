/*
 * @Description:
 * @Author: jrucker
 * @Date: 2021-01-08 19:32:52
 * @LastEditors: jrucker
 * @LastEditTime: 2024/03/30 09:54:20
 */

import { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/screen/index.vue'

const HomeRouter: Array<RouteRecordRaw> = [
  {
    path: '/home',
    component: Layout,
    children: [
      {
        path: '/home/index',
        component: () => import('@/views/screen/view/home/index.vue'),
        name: 'home-index',
        meta: {
          title: '主页',
          icon: 'Menu'
        }
      }
    ]
  }
]

export default HomeRouter
