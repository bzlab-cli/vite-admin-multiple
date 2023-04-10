/*
 * @Author: jrucker
 * @Description: 全局状态管理
 * @Date: 2023/04/10 13:30:51
 * @LastEditors: jrucker
 * @LastEditTime: 2023/04/10 13:52:47
 * @example:
 * ```js
 * eventBus.on('test', (payload) => {}) // 监听
 * eventBus.emit('test', val) // 触发
 * eventBus.off('test', (payload) => {}) // 销毁
 * eventBus.all.clear() // 清除全部
 * ```
 */
import mitt, { Emitter } from 'mitt'
const emitter: Emitter<any> = mitt<any>()

export default emitter
