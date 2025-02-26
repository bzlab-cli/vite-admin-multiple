/*
 * @Description: 权限
 * @Author: jrucker
 * @Date: 2020-12-26 13:45:52
 * @LastEditors: jrucker
 * @LastEditTime: 2024/05/31 09:43:18
 */

import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'
import { RouteRecordRaw } from 'vue-router'
import { store } from '@/views/screen/store'
import { constantRoutes, asyncRoutes } from '@/views/screen/router'
import { filter } from '@/utils'
import { filterAsyncRouter } from '@/utils/permission'
import Layout from '@/layout/screen/index.vue'
export interface PermissionState {
  accessedCodes: string[]
  routes: RouteRecordRaw[]
  dynamicRoutes: RouteRecordRaw[]
}

const hasPermission = (roles: string[], route: RouteRecordRaw) => {
  if (route.meta && route.meta.roles) {
    return roles.some(role => {
      if (route.meta?.roles !== undefined) {
        return route.meta.roles.includes(role)
      }
    })
  }
  return true
}

export const filterAsyncRoutes = (routes: RouteRecordRaw[], roles: string[]) => {
  const res: RouteRecordRaw[] = []
  routes.forEach(route => {
    const r = { ...route }
    if (hasPermission(roles, r)) {
      if (r.children) {
        r.children = filterAsyncRoutes(r.children, roles)
      }
      res.push(r)
    }
  })
  return res
}

export const usePermissionStore = defineStore('permission', () => {
  const state = reactive<PermissionState>({
    accessedCodes: [],
    routes: [],
    dynamicRoutes: []
  })

  const setRoutes = (routes: any[]) => {
    const accessedCodes: any = []
    filter(routes, item => {
      if (item.menuType === 3 && item.grantFlag) {
        accessedCodes.push(item.menuCode)
      }
      return true
    })

    const filterRoutes = filter(routes, item => {
      return item.menuType !== 3 && item.grantFlag
    })
    const accessedRoutes = filterAsyncRouter(filterRoutes, Layout)
    accessedRoutes.push({ path: '/:pathMatch(.*)', redirect: '/404', meta: { hidden: true } })

    state.routes = constantRoutes.concat(asyncRoutes) // 路由菜单
    state.dynamicRoutes = asyncRoutes // 动态路由
    state.accessedCodes = accessedCodes // 按钮权限

    console.log('routes', state.routes)
    console.log('dynamicRoutes', state.dynamicRoutes)
    console.log('asyncRoutes', asyncRoutes)
  }

  return { ...toRefs(state), setRoutes }
})

export function usePermissionStoreHook() {
  return usePermissionStore(store)
}
