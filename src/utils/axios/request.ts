/*
 * @Author: jrucker
 * @Description:
 * @Date: 2021/10/25 18:56:51
 * @LastEditors: jrucker
 * @LastEditTime: 2023/08/16 13:43:46
 */

import type { AxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import axios from 'axios'
import { ElMessage } from 'element-plus'

declare module 'axios' {
  export interface AxiosRequestConfig {
    token?: boolean
  }
}

export class Request {
  private axiosInstance: AxiosInstance
  private options: AxiosRequestConfig

  constructor(options: AxiosRequestConfig) {
    this.options = options
    // 创建axios实例
    this.axiosInstance = axios.create(options)
    this.setupInterceptors()
  }

  getAxios(): AxiosInstance {
    return this.axiosInstance
  }

  // 设置header
  setHeader(headers: any): void {
    if (!this.axiosInstance) return
    Object.assign(this.axiosInstance.defaults.headers, headers)
  }

  // 拦截器配置
  private setupInterceptors() {
    // 请求拦截器配置处理
    this.axiosInstance.interceptors.request.use(
      (request: AxiosRequestConfig) => {
        const userStore = bz.store
        const token = userStore.user.token
        const hasReqToken = typeof request.token !== 'undefined'
        if (!hasReqToken) {
          if (token) request.headers['token'] = token
        } else {
          if (request.token) request.headers['token'] = token
        }

        return request
      },
      (e: AxiosError) => {
        Promise.reject(e)
      }
    )

    // 响应结果拦截器处理
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse<any>) => {
        const res = response.data
        if (res.retCode === 200) {
          return response
        }
        ElMessage.error(res.retMsg || '服务器响应失败，请重试')
        return Promise.reject(response)
      },
      (e: AxiosError) => {
        const status = e?.response?.status
        const userStore = bz.store
        if (status === 500) {
          ElMessage.error('登录已失效，请重新登录')
          userStore.user.resetToken().then(() => {
            window.location.href = '/'
          })
        }
        if (status === 502) {
          ElMessage.error('服务器响应失败，请重试')
        }
        return Promise.reject(e)
      }
    )
  }

  // 发送请求
  request<T>(config: AxiosRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request(config)
        .then((res: AxiosResponse<IResponseModel<any>>) => {
          resolve(res.data as unknown as Promise<T>)
        })
        .catch((e: Error) => {
          reject(e)
        })
    })
  }
}
