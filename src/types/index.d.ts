/*
 * @Author: jrucker
 * @Description: 类型声明
 * @Date: 2021/10/25 18:56:51
 * @LastEditors: jrucker
 * @LastEditTime: 2022/12/19 15:26:56
 */

declare module '*.png'
declare module '*.jpg'
declare module '*.gif' {
  const src: string
  export default src
}
