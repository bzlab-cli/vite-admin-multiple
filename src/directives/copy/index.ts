/**
 * 复制至剪贴板
 * 接收参数：data需要复制的数据
 * 使用方法v-copy="data"
 */
import type { Directive, DirectiveBinding } from 'vue'
import { ElMessage } from 'element-plus'

interface ElType extends HTMLElement {
  copyData: string | number
  __handleClick__: any
}

function handleClick(this: any) {
  const input = document.createElement('input')
  input.value = this.copyData.toLocaleString()
  document.body.appendChild(input)
  input.select()
  document.execCommand('Copy')
  document.body.removeChild(input)
  ElMessage({
    type: 'success',
    message: '复制成功'
  })
}

export const copy: Directive = {
  mounted(el: ElType, binding: DirectiveBinding) {
    el.copyData = binding.value
    el.addEventListener('click', handleClick)
  },
  updated(el: ElType, binding: DirectiveBinding) {
    el.copyData = binding.value
  },
  beforeUnmount(el: ElType) {
    el.removeEventListener('click', el.__handleClick__)
  }
}
