/**
 * @Author: jrucker
 * @Description 拖拽容器
 * @Date: 2022/12/09 11:22
 * @Last Modified by: jrucker
 * @Last Modified time: 2022/12/09 11:22
 */

const _onMouseDown = Symbol('_onMouseDown')
const _onMouseMove = Symbol('_onMouseMove')
const _onMouseUp = Symbol('_onMouseUp')

class DockingPanel {
  listeners: any[]
  viewer: any
  mover: any
  container: any
  x: number
  y: number
  lastX: number
  lastY: number
  startX: number
  startY: number
  deltaX: number
  deltaY: number
  kMinWidth: number
  kMinHeight: number
  constructor(options) {
    this.listeners = [] // 一些监听事件
    this.viewer = options.viewer || '' // viewer观察者
    this.mover = options.mover || '' // 绑定拖拽的元素
    this.container = options.container || '' // 绑定拖拽的容器
    this.listeners = []
    this.x = 0
    this.y = 0
    this.lastX = 0
    this.lastY = 0
    this.startX = 0
    this.startY = 0
    this.deltaX = 0
    this.deltaY = 0
    this.kMinWidth = 100
    this.kMinHeight = 100
    this[_onMouseDown] = this.onMouseDown.bind(this)
    this[_onMouseMove] = this.onMouseMove.bind(this)
    this[_onMouseUp] = this.onMouseUp.bind(this)
    this.initializeMoveHandlers()
  }

  /*初始化拖拽*/
  initializeMoveHandlers() {
    this.addEventListener(this.mover, 'mousedown', this[_onMouseDown])
    this.addEventListener(this.mover, 'touchstart', this[_onMouseDown])
  }

  /*鼠标按下事件*/
  onMouseDown(event) {
    if (event.type === 'touchstart') {
      event.screenX = event.touches[0].screenX
      event.screenY = event.touches[0].screenY
    }
    this.lastX = event.screenX
    this.lastY = event.screenY
    this.deltaX = 0
    this.deltaY = 0
    this.startX = this.container.offsetLeft
    this.startY = this.container.offsetTop
    window.addEventListener('mousemove', this[_onMouseMove], false)
    window.addEventListener('mouseup', this[_onMouseUp], false)
    window.addEventListener('touchmove', this[_onMouseMove], false)
    window.addEventListener('touchend', this[_onMouseUp], false)
    event.preventDefault()
    this.onStartMove(event, this.startX, this.startY)
  }

  /*鼠标弹起事件*/
  onMouseUp(event) {
    window.removeEventListener('mousemove', this[_onMouseMove])
    window.removeEventListener('mouseup', this[_onMouseUp])
    window.removeEventListener('touchmove', this[_onMouseMove])
    window.removeEventListener('touchend', this[_onMouseUp])
    this.onEndMove(event, this.x, this.y)
  }

  /*鼠标移动事件*/
  onMouseMove(event) {
    const minWidth = this.container.style.minWidth ? parseInt(this.container.style.minWidth) : this.kMinWidth
    const minHeight = this.container.style.minHeight ? parseInt(this.container.style.minHeight) : this.kMinHeight
    const parentRect = this.getContainerBoundingRect()

    if (
      this.container.style.maxWidth &&
      parseInt(this.container.style.width) > parseInt(this.container.style.maxWidth)
    ) {
      this.container.style.width = this.container.style.maxWidth
    }
    if (
      this.container.style.maxHeight &&
      parseInt(this.container.style.height) > parseInt(this.container.style.maxHeight)
    ) {
      this.container.style.height = this.container.style.maxHeight
    }

    if (parseInt(this.container.style.width) < minWidth) {
      this.container.style.width = minWidth + 'px'
    }
    if (parseInt(this.container.style.height) < minHeight) {
      this.container.style.height = minHeight + 'px'
    }
    if (event.type === 'touchmove') {
      event.screenX = event.touches[0].screenX
      event.screenY = event.touches[0].screenY
    }

    this.deltaX += event.screenX - this.lastX
    this.deltaY += event.screenY - this.lastY
    this.x = this.startX + this.deltaX
    this.y = this.startY + this.deltaY

    let wi = parseInt(this.container.style.width)
    let hi = parseInt(this.container.style.height)
    if (isNaN(wi)) {
      wi = this.container.getBoundingClientRect().width
    }
    if (isNaN(hi)) {
      hi = this.container.getBoundingClientRect().height
    }

    /*检测左上边界值*/
    if (this.x < 5) this.x = 0
    if (this.y < 5) this.y = 0

    this.container.dockRight = false
    this.container.dockBottom = false

    /*检测下右边界值*/
    if (parentRect.width - 5 < this.x + wi) {
      this.x = parentRect.width - wi
      this.container.dockRight = true
    }

    if (parentRect.height - 5 < this.y + hi) {
      this.y = parentRect.height - hi
      this.container.dockBottom = true
    }

    this.container.style.left = this.x + 'px'
    this.container.style.top = this.y + 'px'
    this.container.style.maxWidth = parentRect.width - this.x + 'px'
    this.container.style.maxHeight = parentRect.height - this.y + 'px'
    this.lastX = event.screenX
    this.lastY = event.screenY
    this.onMove(event, this.x, this.y)
  }

  /*获取边界值*/
  getContainerBoundingRect() {
    return this.viewer.getBoundingClientRect()
  }

  /*监听事件*/
  addEventListener(target, eventId, callback) {
    target.addEventListener(eventId, callback)
    this.listeners.push({ target: target, eventId: eventId, callback: callback })
  }

  /*移除事件监听*/
  removeEventListener(target, eventId, callback) {
    for (let i = 0; i < this.listeners.length; ++i) {
      const listener = this.listeners[i]
      if (listener.target === target && listener.eventId === eventId && listener.callback === callback) {
        target.removeEventListener(eventId, callback)
        this.listeners.splice(i, 1)
        return true
      }
    }
    return false
  }

  /*开始拖拽回调*/
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onStartMove(event, startX, startY) {}

  /*正在拖拽回调*/
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMove(event, currentX, currentY) {}

  /*拖拽结束回调*/
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onEndMove(event, endX, endY) {}
}

let dockingPanel = null as any

const directive = {
  mounted: function (el, { value }) {
    if (!el) return
    el.style.opacity = 0
    const mover =
      value && typeof value.move !== 'undefined' ? el.querySelector(value.move) : el.querySelector('#v-move-mover')

    const viewer =
      value && typeof value.viewer !== 'undefined'
        ? document.querySelector(value.viewer)
        : document.querySelector('#wy-model')

    const options = {
      viewer: viewer,
      mover: mover,
      container: el
    }

    dockingPanel = new DockingPanel(options)
    mover.style.cursor = 'move'

    if (value && value.onStartMove) {
      dockingPanel.onStartMove = function (event, startX, startY) {
        value.onStartMove.call(this, 'onStartMove', { event, startX, startY })
      }
    }

    if (value && value.onMove) {
      dockingPanel.onMove = function (event, currentX, currentY) {
        value.onMove.call(this, 'onMove', { event, currentX, currentY })
      }
    }

    if (value && value.onEndMove) {
      dockingPanel.onEndMove = function (event, endX, endY) {
        value.onEndMove.call(this, 'onEndMove', { event, endX, endY })
      }
    }

    const viewer_height = dockingPanel.getContainerBoundingRect().height
    let el_height = el.clientHeight

    let timer = null as any
    timer = setInterval(() => {
      if (el_height === el.clientHeight) {
        const DEFAULT = {
          right: '20px',
          top: `${(viewer_height - el.clientHeight) / 2}px`
        }
        const styles = Object.assign({}, DEFAULT, value && value.style ? value.style : {})
        Object.keys(styles).forEach(key => (el.style[key] = styles[key]))

        el.style.opacity = 1
        clearInterval(timer)
      } else {
        el_height = el.clientHeight
      }
    }, 50)
  },
  unmounted: function () {
    dockingPanel = null
  }
}

export default directive
