/*
 * @Author: jrucker
 * @Description:
 * @Date: 2021/10/25 18:56:51
 * @LastEditors: jrucker
 * @LastEditTime: 2023/06/13 13:56:57
 */

export enum RouterMode {
  Hash = 'hash',
  History = 'history'
}

export class Keys {
  static sidebarStatusKey = 'sidebarStatusKey'
  static tokenKey = 'nzf-token'
  static projectId = 'projectId'
}

export enum Settings {
  title = '管理系统',
  logo = '/images/logo/logo.png'
}

export enum Vite {
  port = 8445
}

export function getEnv(val) {
  const obj = {
    development: 'nzf-dev',
    deployment: 'nzf-dev',
    release: 'nzf-test',
    production: 'nzf-prod'
  }
  return obj[val]
}
