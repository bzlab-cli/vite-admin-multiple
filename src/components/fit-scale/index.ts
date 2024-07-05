let currRenderDom: any = null
let currElRectification: any = ''
let currElRectificationLevel: any = ''
let currElRectificationIsKeepRatio: any = ''
let resizeListener: any = null
let timer: any = null
let currScale: any = 1
let isElRectification = false
const fitScale = {
  isFitScaleRunning: false,
  init(options: any = {}) {
    const {
      dw = 1920,
      dh = 1080,
      el = typeof options === 'string' ? options : 'body',
      resize = true,
      ignore = [],
      transition = 'none',
      delay = 0,
      limit = 0.1
    } = options
    currRenderDom = el
    const dom = document.querySelector(el)
    if (!dom) return console.error(`${el} is not exist`)
    const style = document.createElement('style')
    const ignoreStyle = document.createElement('style')
    style.lang = 'text/css'
    ignoreStyle.lang = 'text/css'
    style.id = 'fit-scale-style'
    ignoreStyle.id = 'ignoreStyle'
    style.innerHTML = `body {overflow: hidden;}`
    const bodyEl: any = document.querySelector('body')
    bodyEl.appendChild(style)
    bodyEl.appendChild(ignoreStyle)
    dom.style.height = `${dh}px`
    dom.style.width = `${dw}px`
    dom.style.transformOrigin = `0 0`
    dom.style.overflow = 'hidden'
    keepFit(dw, dh, dom, ignore, limit)
    resizeListener = () => {
      clearTimeout(timer)
      if (delay != 0) {
        timer = setTimeout(() => {
          keepFit(dw, dh, dom, ignore, limit)
          isElRectification &&
            elRectification(currElRectification, currElRectificationIsKeepRatio, currElRectificationLevel)
        }, delay)
      } else {
        keepFit(dw, dh, dom, ignore, limit)
        isElRectification &&
          elRectification(currElRectification, currElRectificationIsKeepRatio, currElRectificationLevel)
      }
    }
    resize && window.addEventListener('resize', resizeListener)
    this.isFitScaleRunning = true
    setTimeout(() => {
      dom.style.transition = `${transition}s`
    })
  },
  off(el = 'body') {
    try {
      isElRectification = false
      window.removeEventListener('resize', resizeListener)
      ;(document.querySelector('#fit-scale-style') as any).remove()
      const ignoreStyleDOM = document.querySelector('#ignoreStyle')
      ignoreStyleDOM && ignoreStyleDOM.remove()
      document.querySelector(currRenderDom ? currRenderDom : el).style = ''
      isElRectification && offElRectification()
    } catch (error) {
      this.isFitScaleRunning = false
    }
    this.isFitScaleRunning && console.log(`is off`)
  }
}
function elRectification(el, isKeepRatio = true, level = 1) {
  if (!fitScale.isFitScaleRunning) return
  !el && console.error(`bad selector: ${el}`)
  currElRectification = el
  currElRectificationLevel = level
  currElRectificationIsKeepRatio = isKeepRatio
  const currEl = document.querySelectorAll(el)
  if (currEl.length == 0) return
  for (const item of currEl) {
    const rectification = currScale == 1 ? 1 : currScale * level
    if (!isElRectification) {
      item.originalWidth = item.clientWidth
      item.originalHeight = item.clientHeight
    }
    if (isKeepRatio) {
      item.style.width = `${item.originalWidth * rectification}px`
      item.style.height = `${item.originalHeight * rectification}px`
    } else {
      item.style.width = `${100 * rectification}%`
      item.style.height = `${100 * rectification}%`
    }
    item.style.transform = `scale(${1 / currScale})`
    item.style.transformOrigin = `0 0`
  }
  isElRectification = true
}
function offElRectification() {
  if (!currElRectification) return
  for (const item of document.querySelectorAll(currElRectification)) {
    item.style.width = ''
    item.style.height = ''
    item.style.transform = ''
  }
}
function keepFit(dw, dh, dom, ignore, limit) {
  const clientHeight = document.documentElement.clientHeight
  const clientWidth = document.documentElement.clientWidth
  currScale = clientWidth / clientHeight < dw / dh ? clientWidth / dw : clientHeight / dh
  currScale = Math.abs(1 - currScale) > limit ? currScale.toFixed(2) : 1
  const height = Math.round(clientHeight / currScale)
  const width = Math.round(clientWidth / currScale)
  dom.style.height = `${height}px`
  dom.style.width = `${width}px`
  dom.style.transform = `scale(${currScale})`
  const ignoreStyleDOM: any = document.querySelector('#ignoreStyle')
  ignoreStyleDOM.innerHTML = ''
  for (const item of ignore) {
    let itemEl = item.el || item.dom
    typeof item == 'string' && (itemEl = item)
    if (!itemEl) {
      console.error(`bad selector: ${itemEl}`)
      continue
    }
    const realScale = item.scale ? item.scale : 1 / currScale
    const realFontSize = realScale != currScale ? item.fontSize : 'fit-scale'
    const realWidth = realScale != currScale ? item.width : 'fit-scale'
    const realHeight = realScale != currScale ? item.height : 'fit-scale'
    const regex = new RegExp(`${itemEl}(\x20|{)`, 'gm')
    const isIgnored = regex.test(ignoreStyleDOM.innerHTML)
    if (isIgnored) {
      continue
    }
    ignoreStyleDOM.innerHTML += `\n${itemEl} {
      transform: scale(${realScale})!important;
      transform-origin: 0 0;
      width: ${realWidth}!important;
      height: ${realHeight}!important;
    }`
    if (realFontSize) {
      ignoreStyleDOM.innerHTML += `\n${itemEl} div ,${itemEl} span,${itemEl} a,${itemEl} * {
        font-size: ${realFontSize}px;
      }`
    }
  }
}

export { elRectification }
export default fitScale
