/*
 * @Author: jrucker
 * @Description:
 * @Date: 2024/10/25 18:56:51
 * @LastEditors: jrucker
 * @LastEditTime: 2024/11/01 17:12:48
 */

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module '*.gif' {
  export const gif: any
}
