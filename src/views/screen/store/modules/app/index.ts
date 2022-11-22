/*
 * @Author: jrucker
 * @Description:
 * @Date: 2021/10/25 18:56:51
 * @LastEditors: jrucker
 * @LastEditTime: 2022/11/22 16:49:50
 */
import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'
import { store } from '@/views/screen/store'

export enum DeviceType {
  Mobile,
  Desktop
}
export interface AppState {
  device: DeviceType
  size: string
}

export const useAppStore = defineStore('app', () => {
  const state = reactive<AppState>({
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
