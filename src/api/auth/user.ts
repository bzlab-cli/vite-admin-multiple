/*
 * @Author: jrucker
 * @Description:
 * @Date: 2024/10/25 18:56:51
 * @LastEditors: jrucker
 * @LastEditTime: 2025/03/05 17:27:11
 */

import { UserInfoModel } from '@/interface/user'
import axios from '@/utils/axios'
import { LoginModel } from '@/interface/login'

export const login = (userInfo: any) => {
  return axios.request<IResponseModel<LoginModel>>({
    baseURL: import.meta.env.VITE_APP_MOCK_API,
    url: 'user/login',
    method: 'post',
    data: userInfo,
    token: false
  })
}

export const userInfo = () => {
  return axios.request<IResponseModel<UserInfoModel>>({
    baseURL: import.meta.env.VITE_APP_MOCK_API,
    url: 'user/getUserByToken',
    method: 'get'
  })
}

// 查询用户列表
export const getUserList = (data: any) => {
  return axios.request<IResponseModel<any>>({
    baseURL: import.meta.env.VITE_APP_MOCK_API,
    url: 'user/getUserList',
    method: 'get',
    params: data
  })
}

// 创建用户
export const addUser = (data: any) => {
  return axios.request<IResponseModel<any>>({
    url: 'user/user',
    method: 'post',
    data
  })
}

// 修改用户
export const updateUser = (data: any) => {
  return axios.request<IResponseModel<any>>({
    url: 'user/updateUser',
    method: 'put',
    data
  })
}

// 重置密码
export const resetPassword = (data: any) => {
  return axios.request<IResponseModel<any>>({
    baseURL: import.meta.env.VITE_APP_MOCK_API,
    url: `user/resetPassword/${data.userId}`,
    method: 'put'
  })
}

// 获取用户
export const getUser = (data: any) => {
  return axios.request<IResponseModel<any>>({
    baseURL: import.meta.env.VITE_APP_MOCK_API,
    url: `user/getUser`,
    method: 'get',
    params: data
  })
}

// 删除用户
export const deleteUser = (data: any) => {
  return axios.request<IResponseModel<any>>({
    baseURL: import.meta.env.VITE_APP_MOCK_API,
    url: `user/deleteUser`,
    method: 'delete',
    data
  })
}

// 用户禁用
export const updateUserForbiddenStatus = (data: any) => {
  return axios.request<IResponseModel<any>>({
    url: `user/updateUserForbiddenStatus?userId=${data.userId}&forbiddenStatus=${data.forbiddenStatus}`,
    method: 'put'
  })
}

// 用户禁用
export const getGrantProjectByToken = (data?: any) => {
  return axios.request<IResponseModel<any>>({
    url: `thirdUser/getGrantProjectByToken`,
    method: 'get',
    params: data
  })
}

export const getTreeList = (data: any) => {
  return axios.request<IResponseModel<any>>({
    url: `user/getTreeList`,
    method: 'get',
    params: data
  })
}
