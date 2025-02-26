/*
 * @Author: jrucker
 * @Description:
 * @Date: 2024/10/25 18:56:51
 * @LastEditors: jrucker
 * @LastEditTime: 2024/08/16 13:45:27
 */
import { createPinia } from 'pinia'
import { useAppStore } from './modules/app'
import { usePermissionStore } from './modules/permission'
import { useUserStore } from './modules/user'

export const store = createPinia()

export function useStore() {
  return {
    app: useAppStore(),
    permission: usePermissionStore(),
    user: useUserStore()
  }
}
