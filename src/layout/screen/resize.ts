/*
 * @Description: 根据大小变化重新布局
 * @Author: jrucker
 * @Date: 2020-12-17 15:37:56
 * @LastEditors: jrucker
 * @LastEditTime: 2022/11/22 16:58:54
 */

import { useAppStore, DeviceType } from '@/views/screen/store/modules/app'
import { computed } from 'vue'

const WIDTH = 992

export default function () {
  const appStore = useAppStore()
  const device = computed(() => {
    return appStore.device
  })

  const isMobile = () => {
    const rect = document.body.getBoundingClientRect()
    return rect.width - 1 < WIDTH
  }

  const resizeMounted = () => {
    if (isMobile()) {
      appStore.toggleDevice(DeviceType.Mobile)
    }
  }

  const resizeHandler = () => {
    if (!document.hidden) {
      appStore.toggleDevice(isMobile() ? DeviceType.Mobile : DeviceType.Desktop)
    }
  }
  const addEventListenerOnResize = () => {
    window.addEventListener('resize', resizeHandler)
  }

  const removeEventListenerResize = () => {
    window.removeEventListener('resize', resizeHandler)
  }

  return {
    device,
    resizeMounted,
    addEventListenerOnResize,
    removeEventListenerResize
  }
}
