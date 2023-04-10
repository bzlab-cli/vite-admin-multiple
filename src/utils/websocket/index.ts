/*
 * @Author: jrucker
 * @Description: websocket
 * @Date: 2022/07/11 15:56:51
 * @LastEditors: jrucker
 * @LastEditTime: 2023/04/10 15:13:09
 * @Examples:
 * ```
 * // 初始化
 * const webSocket = new ConnectWebSocket(url)
 * // 接收消息
 * function messageHandler(payload) {
 *  if (!payload) return
 * }
 * webSocket?.registerMessageHandler(messageHandler)
 * webSocket?.initSocket()
 * // 发送消息
 * webSocket.sendMessage(val)
 * ```
 */
import ReconnectingWebSocket from 'reconnecting-websocket'

export interface MessageHandler {
  (data: { [key: string]: any }): void
}

class ConnectWebSocket {
  _url: string
  _socket: ReconnectingWebSocket | null
  _hasInit: boolean
  _messageHandler: MessageHandler | null
  _state: string
  _pingTime: number
  _pingInterval: any

  constructor(url: string) {
    this._url = url
    this._socket = null
    this._hasInit = false
    this._messageHandler = null
    this._state = 'ping'
    this._pingTime = 10000 // 心跳时长
    this._pingInterval = null
  }

  initSocket() {
    if (this._hasInit) return
    if (!this._url) return

    // 自动重连
    this._socket = new ReconnectingWebSocket(this._url, [], {
      maxReconnectionDelay: 20000, // 断开后最大的重连时间： 20s，每多一次重连，会增加 1.3 倍，5 * 1.3 * 1.3 * 1.3...
      minReconnectionDelay: 5000, // 断开后最短的重连时间： 5s
      maxRetries: 5
    })

    this._hasInit = true

    this._socket.addEventListener('open', this._onOpen.bind(this))
    this._socket.addEventListener('close', this._onClose.bind(this))
    this._socket.addEventListener('error', this._onError.bind(this))
    this._socket.addEventListener('message', this._onMessage.bind(this))
  }

  _onOpen() {
    console.log('连接成功')
    this.sendHeart()
  }

  _onClose() {
    console.log('连接已断开')
  }

  _onError(err) {
    console.error('连接error', err)
  }

  registerMessageHandler(messageHandler: MessageHandler) {
    this._messageHandler = messageHandler
  }

  _onMessage(msg: MessageEvent) {
    if (msg.data === 'pong') return
    const data = JSON.parse(msg.data)
    this._messageHandler && this._messageHandler(data)
  }

  sendMessage = (msg: any): void => {
    this._socket?.send(JSON.stringify(msg))
  }

  sendHeart() {
    this._state = 'ping'
    const pingHandler = () => {
      if (this._socket?.readyState === 1) this._socket?.send('ping')
    }
    this._pingInterval = setInterval(pingHandler, this._pingTime)
  }

  close() {
    clearInterval(this._pingInterval)
    this._socket?.close()
  }
}

export default ConnectWebSocket
