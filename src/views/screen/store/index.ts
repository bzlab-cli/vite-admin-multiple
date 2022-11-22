/*
 * @Author: jrucker
 * @Description:
 * @Date: 2021/10/25 18:56:51
 * @LastEditors: jrucker
 * @LastEditTime: 2022/11/22 16:39:03
 */
import { createPinia } from 'pinia'

export const store = createPinia()

export function useStore() {
  return store
}
