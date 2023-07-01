import { createApp } from 'vue'
import * as Sentry from '@sentry/browser'
import * as Integrations from '@/utils/sentry/error-handler'
import { ignoreErrors } from '@/constant/sentry'

/**
 * @description 加载sentry
 * @param  {ReturnType<typeofcreateApp>} app 整个应用的实例
 */
export function loadSentry(app: ReturnType<typeof createApp>) {
  const enableSentry = window.sessionStorage.getItem('enableSentry')
  if (import.meta.env.VITE_APP_ENV === 'production' || enableSentry) {
    Sentry.init({
      release: import.meta.env.VITE_APP_ENV + '@0.0.1',
      environment: import.meta.env.VITE_APP_ENV,
      dsn: 'http://47101e7b1bb543cf9a50e755e73264c4@vpn.qimiaowa.com:39000/3',
      integrations: [new Integrations.Vue({ Vue: app, attachProps: true })],
      ignoreErrors
    })
  }
}
