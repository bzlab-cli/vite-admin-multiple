/*
 * @Author: jrucker
 * @Description:
 * @Date: 2024/10/25 18:56:51
 * @LastEditors: jrucker
 * @LastEditTime: 2025/02/27 17:42:16
 */
import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'
import layoutSettings from '@/config/layout'
import { store } from '@/views/admin/store'

export interface SettingsState {
  theme: string
  fixedHeader: boolean
  showTagsView: boolean
  showSidebarLogo: boolean
  sidebarTextTheme: boolean
}

export const useSettingsStore = defineStore('settings', () => {
  const state = reactive<SettingsState>({
    theme: __SCSS_VARS__.theme,
    fixedHeader: layoutSettings.fixedHeader,
    showTagsView: layoutSettings.showTagsView,
    showSidebarLogo: layoutSettings.showSidebarLogo,
    sidebarTextTheme: layoutSettings.sidebarTextTheme
  })

  const changeSetting = payload => {
    const { key, value } = payload
    switch (key) {
      case 'theme':
        state.theme = value
        break
      case 'fixedHeader':
        state.fixedHeader = value
        break
      case 'showSidebarLogo':
        state.showSidebarLogo = value
        break
      case 'showTagsView':
        state.showTagsView = value
        break
      case 'sidebarTextTheme':
        state.sidebarTextTheme = value
        break
      default:
        break
    }
  }

  return { ...toRefs(state), changeSetting }
})

export function useSettingsStoreHook() {
  return useSettingsStore(store)
}
