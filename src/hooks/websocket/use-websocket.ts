/*
 * @Author: jrucker
 * @Description: websocket
 * @Date: 2023/04/10 15:16:38
 * @LastEditors: jrucker
 * @LastEditTime: 2023/04/10 15:16:38
 * @Examples:
 * ```
 * import useWebSocket from '@/hooks/websocket/use-websocket'
 * // 接收消息
 * function messageHandler(payload) {
 *  if (!payload) return
 * }
 * useWebSocket(url, messageHandler)
 * ```
 */

import { onMounted, onUnmounted } from 'vue'
import ConnectWebSocket, { MessageHandler } from '@/utils/websocket'

/**
 * 接收message函数
 * @param messageHandler
 */
export default function useConnectWebSocket(url: string, messageHandler: MessageHandler) {
  const webSocket = new ConnectWebSocket(url)

  onMounted(() => {
    webSocket?.registerMessageHandler(messageHandler)
    webSocket?.initSocket()
  })

  onUnmounted(() => {
    webSocket?.close()
  })
}
