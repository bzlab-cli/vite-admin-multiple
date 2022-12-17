/*
 * @Description:
 * @Author: jrucker
 * @Date: 2021/11/08 11:32:52
 * @LastEditors: jrucker
 * @LastEditTime: 2022/12/17 23:04:56
 */

import { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/admin/index.vue'

const permissionRouter: Array<RouteRecordRaw> = [
  {
    path: '/system',
    component: Layout,
    redirect: 'noredirect',
    meta: {
      title: '系统管理',
      icon: 'Menu'
    },
    children: [
      {
        path: '/system/user',
        component: () => import('@/views/admin/system/user/index.vue'),
        name: 'system-user',
        meta: {
          title: '用户管理',
          icon: 'Menu'
        },
        children: [
          {
            path: '/system/user/detail',
            component: () => import('@/views/admin/system/role/index.vue'),
            name: 'system-user-detail',
            meta: {
              title: '用户详情',
              icon: 'Menu',
              hidden: true
            }
          }
        ]
      },
      {
        path: '/system/role',
        component: () => import('@/views/admin/system/role/index.vue'),
        name: 'system-role',
        meta: {
          title: '角色管理',
          icon: 'Menu'
        }
      },
      {
        path: '/system/menu',
        component: () => import('@/views/admin/system/menu/index.vue'),
        name: 'system-menu',
        meta: {
          title: '菜单管理',
          icon: 'Menu'
        }
      },
      {
        path: '/system/org',
        component: () => import('@/views/admin/system/org/index.vue'),
        name: 'system-org',
        meta: {
          title: '组织管理',
          icon: 'Menu'
        }
      }
    ]
  }
]

export default permissionRouter
