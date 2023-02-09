import { Directive, createApp } from 'vue'
import Loading from './loading'

const { name } = Loading
function append(el: any) {
  el.appendChild(el[name].$el)
}
function remove(el: any) {
  el.removeChild(el[name].$el)
}

export const spin: Directive = {
  mounted(el, { value }) {
    const app = createApp(Loading)
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
