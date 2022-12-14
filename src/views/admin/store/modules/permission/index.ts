/*
 * @Description: 权限
 * @Author: jrucker
 * @Date: 2020-12-26 13:45:52
 * @LastEditors: jrucker
 * @LastEditTime: 2022/12/17 22:22:00
 */

import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'
import { RouteRecordRaw } from 'vue-router'
import { store } from '@/views/admin/store'
import { constantRoutes, asyncRoutes } from '@/views/admin/router'
import { filter } from '@/utils'
import { filterAsyncRouter, flatRoutes } from '@/utils/permission'
import Layout from '@/layout/admin/index.vue'
import { useTagsStore } from '../tags'
export interface PermissionState {
  accessedCodes: string[]
  routes: RouteRecordRaw[]
  dynamicRoutes: RouteRecordRaw[]
  activeMenu: string
}

const hasPermission = (roles: string[], route: RouteRecordRaw) => {
  if (route.meta && route.meta.roles) {
    return roles.some(role => {
      if (route.meta?.roles !== undefined) {
        return route.meta.roles.includes(role)
      }
    })
  } else {
    return true
  }
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
  const tagsStore = useTagsStore()
  const state = reactive<PermissionState>({
    accessedCodes: [],
    routes: [],
    dynamicRoutes: [],
    activeMenu: ''
  })

  const setActiveMenu = val => {
    state.activeMenu = val
  }

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
    const cachedViews = [] as any
    filter(routes, item => {
      const cache = item.menuType !== 3 && item.cache === 1
      if (cache) {
        cachedViews.push(item.menuRoute)
      }
      return cache
    })
    const accessedRoutes = filterAsyncRouter(filterRoutes, Layout)
    accessedRoutes.push({ path: '/:pathMatch(.*)', redirect: '/404', meta: { hidden: true } })

    // state.routes = constantRoutes.concat(accessedRoutes) // 路由菜单
    // state.dynamicRoutes = flatRoutes(accessedRoutes) // 动态路由
    state.routes = constantRoutes.concat(asyncRoutes) // 本地路由菜单
    state.dynamicRoutes = flatRoutes(asyncRoutes) // 本地动态路由

    state.accessedCodes = accessedCodes // 按钮权限
    tagsStore.addCacheView(cachedViews) // 缓存路由

    console.log('routes', state.routes)
    console.log('dynamicRoutes', state.dynamicRoutes)
    console.log('asyncRoutes', asyncRoutes)
  }

  return { ...toRefs(state), setActiveMenu, setRoutes }
})

export function usePermissionStoreHook() {
  return usePermissionStore(store)
}
