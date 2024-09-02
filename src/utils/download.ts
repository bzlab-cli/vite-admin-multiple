import {
  downloadAxiosBlobFile as downAxiosBlobFile,
  downloadFetchBlobFile as downFetchBlobFile,
  downloadBlobFile as downBlobFile,
  downloadLinkFile as downLinkFile,
  isArray
} from '@bzlab/bz-core'
import { getToken } from '@/utils/auth'

/**
 * 通过访问Axios接口返回Blob下载文件，可指定文件名，多用于导出，下载模板
 * downloadAxiosBlobFile({ url, name, data: {}, type: 'application/vnd.ms-excel' }) // 下载单个
 * downloadAxiosBlobFile([{ url, name, data: {}, type: 'application/vnd.ms-excel' }]) // 下载多个
 * @param options
 */
export function downloadAxiosBlobFile(options) {
  const headers = { token: getToken() }
  return new Promise(async resolve => {
    if (!isArray(options)) {
      const res = await downAxiosBlobFile({ ...options, headers })
      resolve(res)
    } else {
      options.forEach(item => (item.headers = headers))
      const res = await downAxiosBlobFile(options)
      resolve(res)
    }
  })
}

/**
 * 通过访问fetch接口返回Blob下载文件，可指定文件名，多用于导出，下载模板
 * downloadFetchBlobFile({ url, name, data: {}, type: 'application/vnd.ms-excel' }) // 下载单个
 * downloadFetchBlobFile([{ url, name, data: {}, type: 'application/vnd.ms-excel' }]) // 下载多个
 * @param options
 */
export function downloadFetchBlobFile(options) {
  const headers = { token: getToken() }
  return new Promise(async resolve => {
    if (!isArray(options)) {
      const res = await downFetchBlobFile({ ...options, headers })
      resolve(res)
    } else {
      options.forEach(item => (item.headers = headers))
      const res = await downFetchBlobFile(options)
      resolve(res)
    }
  })
}

/**
 * 将文件URL转成blob下载，可指定文件名，多用于浏览器无法触发自动下载的文件
 * downloadBlobFile({ url, name }) // 下载单个
 * downloadBlobFile([{ url, name }]) // 下载多个
 * @param options
 */
export function downloadBlobFile(options) {
  downBlobFile(options)
}

/**
 * 文件直接下载，无需指定文件名，适用于直接打开地址触发下载文件
 * downloadLinkFile(url) // 下载单个
 * downloadLinkFile([url]) // 下载多个
 * @param options
 */
export function downloadLinkFile(options) {
  downLinkFile(options)
}
