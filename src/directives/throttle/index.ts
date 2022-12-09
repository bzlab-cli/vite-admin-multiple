/*
 *流指令，每隔几秒后执行
 *使用方法 v-throttle="debounceClick"
 */
import type { Directive, DirectiveBinding } from 'vue'

interface ElType extends HTMLElement {
  __handleClick__: () => any
  disabled: boolean
}

export const throttle: Directive = {
  mounted(el: ElType, binding: DirectiveBinding) {
    if (typeof binding.value !== 'function') {
      throw 'callback must be a function'
    }
    let timer: NodeJS.Timeout | null = null
    el.__handleClick__ = function () {
      if (timer) {
        clearTimeout(timer)
      }
      if (!el.disabled) {
        el.disabled = true
        binding.value()
        timer = setTimeout(() => {
          el.disabled = false
        }, 1000)
      }
    }
    el.addEventListener('click', el.__handleClick__)
  },
  beforeUnmount(el: ElType) {
    el.removeEventListener('click', el.__handleClick__)
  }
}
