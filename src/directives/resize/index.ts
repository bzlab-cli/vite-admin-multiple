/**
 * @Author: jrucker
 * @Description 拖拽改变容器尺寸
 * @Date: 2022/12/09 11:22
 * @Last Modified by: jrucker
 * @Last Modified time: 2022/12/09 11:22
 */

const _onMouseDown = Symbol('_onMouseDown')
const _onMouseMove = Symbol('_onMouseMove')
const _onMouseUp = Symbol('_onMouseUp')

class DockingPanelResize {
  container: any
  iniUpdate: boolean
  iniPanelSize: any
  iniMousePosition: { x: number; y: number }
  resizeOverlay: any
  constructor(options) {
    this.container = options.container || '' // 绑定拖拽的容器

    this.iniUpdate = false
    this.iniPanelSize = this.container.getBoundingClientRect()
    this.iniMousePosition = { x: 0, y: 0 }

    this.resizeOverlay = null

    this[_onMouseDown] = this.onMouseDown.bind(this)
    this[_onMouseMove] = this.onMouseMove.bind(this)
    this[_onMouseUp] = this.onMouseUp.bind(this)

    this.initializeResizeHandlers()
  }

  /*初始化*/
  initializeResizeHandlers() {
    const footer = document.createElement('div')
    footer.classList.add('move-resize-footer')

    const resize = document.createElement('div')
    resize.classList.add('move-resize-resize')
    footer.appendChild(resize)

    const styles = {
      left: 0,
      top: 0,
      width: '100vw',
      height: '100vh',
      position: 'fixed',
      cursor: 'pointer',
      zIndex: 999,
      backgroundColor: 'transparent'
    }

    this.resizeOverlay = document.createElement('div')
    Object.keys(styles).forEach(key => (this.resizeOverlay.style[key] = styles[key]))
    resize.addEventListener('touchstart', this[_onMouseDown])
    resize.addEventListener('mousedown', this[_onMouseDown])
    this.container.style.resize = 'none'
    this.container.appendChild(footer)
  }

  /*鼠标按下事件*/
  onMouseDown(event) {
    this.iniUpdate = true
    this.iniPanelSize = this.container.getBoundingClientRect()
    document.body.appendChild(this.resizeOverlay)
    document.addEventListener('touchmove', this[_onMouseMove])
    document.addEventListener('touchcancel', this[_onMouseUp])
    document.addEventListener('touchend', this[_onMouseUp])
    document.addEventListener('mousemove', this[_onMouseMove])
    document.addEventListener('mouseup', this[_onMouseUp])
    event.preventDefault()
    event.stopPropagation()
  }

  /*鼠标弹起事件*/
  onMouseUp(event) {
    if (document.body.contains(this.resizeOverlay)) {
      document.body.removeChild(this.resizeOverlay)
      document.removeEventListener('touchmove', this[_onMouseMove])
      document.removeEventListener('touchcancel', this[_onMouseUp])
      document.removeEventListener('touchend', this[_onMouseUp])
      document.removeEventListener('mousemove', this[_onMouseMove])
      document.removeEventListener('mouseup', this[_onMouseUp])
      event.preventDefault()
      event.stopPropagation()
    }
  }

  /*鼠标移动事件*/
  onMouseMove(event) {
    if (event.type === 'touchmove') {
      event.canvasX = event.touches[0].screenX
      event.canvasY = event.touches[0].screenY
    }
    if (this.iniUpdate) {
      this.iniUpdate = false
      this.iniMousePosition.x = event.canvasX || event.clientX
      this.iniMousePosition.y = event.canvasY || event.clientY
    }

    const dx = (event.canvasX || event.clientX) - this.iniMousePosition.x
    const dy = (event.canvasY || event.clientY) - this.iniMousePosition.y
    const width = parseInt(this.iniPanelSize.width + dx)
    const height = parseInt(this.iniPanelSize.height + dy)

    this.container.style.width = width + 'px'
    this.container.style.height = height + 'px'
    if (width >= 0 && height >= 0) {
      this.onResize && this.onResize(width, height)
    }

    event.preventDefault()
    event.stopPropagation()
  }

  /*拖拽回调*/
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onResize(width, height) {}
}

let dockingPanelResize = null as any

const directive = {
  mounted: function (el, { value }) {
    if (!el) return
    const options = { container: el }
    dockingPanelResize = new DockingPanelResize(options)
    if (value) {
      const onMoveResize = value
      dockingPanelResize.onResize = function (width, height) {
        onMoveResize.call(this, { width, height })
      }
    }
  },
  unmounted: function () {
    dockingPanelResize = null
  }
}

export default directive
