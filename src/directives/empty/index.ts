import { Directive, createApp } from 'vue'
import Empty from './empty'

const { name } = Empty

function append(el: any) {
  el.appendChild(el[name].$el)
}
function remove(el: any) {
  el.removeChild(el[name].$el)
}

export const empty: Directive = {
  mounted(el, { value }) {
    const app = createApp(Empty)
    const instance = app.mount(document.createElement('div'))
    el[name] = instance
    if (value) {
      append(el)
    }
  },
  updated(el, { value, oldValue }) {
    if (!value && oldValue) {
      remove(el)
    }
  }
}
