/* eslint-disable */
// @ts-nocheck
import { getGlobalObject, isPlainObject, logger } from '@sentry/utils'

const Vue = (function () {
  function Vue(options) {
    if (options === void 0) {
      options = {}
    }
    this.name = Vue.id
    this._attachProps = true
    this._Vue = options.Vue || getGlobalObject().Vue
    if (options.attachProps === false) {
      this._attachProps = false
    }
  }
  Vue.prototype._formatComponentName = function (vm) {
    if (vm.$root === vm) {
      return 'root instance'
    }
    const name = vm._isVue ? vm.$options.name || vm.$options._componentTag : vm.name
    return (
      (name ? 'component <' + name + '>' : 'anonymous component') +
      (vm._isVue && vm.$options.__file ? ' at ' + vm.$options.__file : '')
    )
  }
  Vue.prototype.setupOnce = function (_, getCurrentHub) {
    const _this = this
    if (!this._Vue || !this._Vue.config) {
      logger.error('VueIntegration is missing a Vue instance')
      return
    }
    const oldOnError = this._Vue.config.errorHandler
    this._Vue.config.errorHandler = function (error, vm, info) {
      console.error(error)
      const metadata = {}
      if (isPlainObject(vm)) {
        metadata.componentName = _this._formatComponentName(vm)
        if (_this._attachProps) {
          metadata.propsData = vm.$options.propsData
        }
      }
      if (info !== void 0) {
        metadata.lifecycleHook = info
      }
      if (getCurrentHub().getIntegration(Vue)) {
        setTimeout(function () {
          getCurrentHub().withScope(function (scope) {
            scope.setContext('vue', metadata)
            getCurrentHub().captureException(error)
          })
        })
      }
      if (typeof oldOnError === 'function') {
        oldOnError.call(_this._Vue, error, vm, info)
      }
    }
  }

  Vue.id = 'Vue'
  return Vue
})()

export { Vue }
