/*
 * @Author: jrucker
 * @Description:
 * @Date: 2021/10/25 18:56:51
 * @LastEditors: jrucker
 * @LastEditTime: 2023/08/11 12:04:10
 */
import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'
import { store } from '@/views/screen/store'

export enum DeviceType {
  Mobile,
  Desktop
}
export interface AppState {
  pageType: string
  device: DeviceType
  size: string
}

export const useAppStore = defineStore('app', () => {
  const state = reactive<AppState>({
    pageType: 'screen',
    device: DeviceType.Desktop,
    size: 'medium'
  })

  const toggleDevice = (device: DeviceType) => {
    state.device = device
  }

  return {
    ...toRefs(state),
    toggleDevice
  }
})

export function useAppStoreHook() {
  return useAppStore(store)
}
