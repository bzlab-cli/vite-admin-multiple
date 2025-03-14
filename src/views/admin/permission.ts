/*
 * @Author: jrucker
 * @Description: 权限
 * @Date: 2024/10/25 18:56:51
 * @LastEditors: jrucker
 * @LastEditTime: 2024/01/09 16:50:11
 */

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import router from './router'
import { RouteLocationNormalized } from 'vue-router'
import { ElMessage } from 'element-plus'
import { whiteList, whiteNameList } from '@/config/whitelist'
import { useUserStore } from './store/modules/user'
import { usePermissionStore } from './store/modules/permission'
import { routeListener } from '@/utils/permission'

NProgress.configure({ showSpinner: false })

router.beforeEach(async (to: RouteLocationNormalized, _: RouteLocationNormalized, next: any) => {
  NProgress.start()
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()

  if (whiteList.indexOf(to.path) !== -1 || whiteNameList.indexOf(to.name as string) !== -1) {
    return next()
  }
  routeListener()
  if (userStore.token) {
    if (!userStore.loadUserInfo) {
      try {
        await userStore.getUserInfo()
        await userStore.getMenu()
        permissionStore.dynamicRoutes.forEach((route: any) => {
          router.addRoute('layout', route)
        })
        next({ ...to, replace: true })
      } catch (err) {
        console.error(err)
        userStore.resetToken().then(() => {
          ElMessage.error('登录已失效，请重新登录')
          next(`/login`)
          NProgress.done()
        })
      }
    } else {
      next()
    }
  } else {
    next(`/login`)
    NProgress.done()
  }
})

router.afterEach((to: RouteLocationNormalized) => {
  NProgress.done()
  document.title = to.meta.title as string
})
