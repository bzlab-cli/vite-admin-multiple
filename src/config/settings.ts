/*
 * @Author: jrucker
 * @Description:
 * @Date: 2024/10/25 18:56:51
 * @LastEditors: jrucker
 * @LastEditTime: 2025/02/27 11:34:09
 */
interface LayoutSettings {
  // 后台是否显示权限路由菜单,默认false本地路由
  showAdminAuthMenu: boolean
}

export enum RouterMode {
  Hash = 'hash',
  History = 'history'
}

export class Keys {
  static sidebarStatusKey = 'sidebarStatusKey'
  static tokenKey = 'ks-sass-token'
  static projectId = 'projectId'
}

export enum Settings {
  companyName = '蛙云科技',
  welcomeName = '欢迎登录',
  systemTitle = '协同管理平台',
  logo = '/images/logo/wy-logo.png',
  footer = 'Technology provided by Frog Cloud Technology',
  beian = '浙ICP备16007368号-3',
  packageName = 'ks-sass-admin'
}

export enum Vite {
  port = 8445
}

/**
 * 判断环境添加前缀
 * getEnv(import.meta.env.VITE_APP_ENV)
 * @param val
 * @returns
 */
export function getEnv(val) {
  const envName = __APP_INFO__?.proxy?.env ?? null
  let development = 'ks-sass-dev'
  if (envName === '生产') {
    development = 'ks-sass-prod'
  }
  const obj = {
    development,
    deployment: 'ks-sass-dev',
    test: 'ks-sass-test',
    production: 'ks-sass-prod'
  }
  return obj[val]
}

/**
 * 根据环境判断是否aliyun或ftp上传
 * getUploadEnv(import.meta.env.VITE_APP_ENV)
 * @param val
 * @returns
 */
export function getUploadEnv(val) {
  const uploadType = 'aliyun'
  const envName = __APP_INFO__?.proxy?.env ?? null
  let development = 'ftp'
  if (envName === '生产') {
    development = uploadType
  }
  const obj = {
    development,
    deployment: 'ftp',
    test: 'ftp',
    production: uploadType
  }
  return obj[val]
}

/**
 * 获取oss或ftp文件预览拼接后的地址
 * getOssFtpPrefix(import.meta.env.VITE_APP_ENV, url)
 * @param val
 * @returns
 */
export function getOssFtpPrefix(val, url) {
  const aliyunPrefix = 'https://wayun.oss-cn-hangzhou.aliyuncs.com'
  const envName = __APP_INFO__?.proxy?.env ?? null
  let development = window.location.origin
  if (envName === '生产') {
    development = aliyunPrefix
  }
  const obj = {
    development,
    deployment: window.location.origin,
    test: window.location.origin,
    production: aliyunPrefix
  }
  if (url.includes('aliyuncs.com')) {
    return url
  }
  return obj[val] + url
}

export const layoutSettings: LayoutSettings = {
  // 后台是否显示权限路由菜单,默认false本地路由
  showAdminAuthMenu: false
}
