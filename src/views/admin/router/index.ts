/*
 * @Description:
 * @Author: jrucker
 * @Date: 2024/10/21 14:13:07
 * @LastEditors: jrucker
 * @LastEditTime: 2024/08/23 13:55:02
 */

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
const constantFiles = import.meta.globEager('./constant-modules/*.ts')
const asyncFiles = import.meta.globEager('./async-modules/*.ts')
let constantModules: Array<RouteRecordRaw> = []
let permissionModules: Array<RouteRecordRaw> = []

Object.keys(constantFiles).forEach(key => {
  constantModules = constantModules.concat(constantFiles[key].default)
})

Object.keys(asyncFiles).forEach(key => {
  permissionModules = permissionModules.concat(asyncFiles[key].default)
})

export const constantRoutes: Array<RouteRecordRaw> = [...constantModules]

export const asyncRoutes: Array<RouteRecordRaw> = [
  ...permissionModules,
  { path: '/:pathMatch(.*)', redirect: '/404', meta: { hidden: true } }
]

export const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes
})

export function resetRouter() {
  const newRouter = router
  ;(router as any).matcher = (newRouter as any).matcher
}

export default router
