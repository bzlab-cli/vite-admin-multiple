import mitt from 'mitt'
import fitUtil from '@/utils/fit-util'

export default function loadComponent(app: any) {
  app.eventBus = mitt()
  app.provide('fitUtil', fitUtil)
}
