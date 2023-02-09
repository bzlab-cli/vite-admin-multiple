/*
 * @Author: jrucker
 * @Description: 类型声明
 * @Date: 2021/10/25 18:56:51
 * @LastEditors: jrucker
 * @LastEditTime: 2023/02/01 09:54:07
 */

declare module '*.png'
declare module '*.jpg'
declare module '*.gif' {
  const src: string
  export default src
}

declare module '*.module.scss' {
  const classes: CSSModuleClasses
  export default classes
}
