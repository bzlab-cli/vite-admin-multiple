/*
 * @Description:
 * @Author: jrucker
 * @Date: 2021-01-08 19:32:52
 * @LastEditors: jrucker
 * @LastEditTime: 2022/12/14 13:35:13
 */

import { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/screen/index.vue'

const HomeRouter: Array<RouteRecordRaw> = [
  {
    path: '/home',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'index',
        component: () => import('@/views/screen/view/home/index.vue'),
        name: 'home',
        meta: {
          title: '主页',
          icon: 'Menu'
        }
      }
    ]
  }
]

export default HomeRouter
