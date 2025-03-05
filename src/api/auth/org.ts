/*
 * @Author: jrucker
 * @Description:
 * @Date: 2024/11/09 12:01:44
 * @LastEditors: jrucker
 * @LastEditTime: 2025/03/05 15:51:45
 */

import axios from '@/utils/axios'

// 创建组织
export const addOrg = (data: any) => {
  return axios.request<IResponseModel<any>>({
    url: 'org/addOrg',
    method: 'post',
    data
  })
}

// 查看组织详情
export const getOrgDetail = (data: any) => {
  return axios.request<IResponseModel<any>>({
    // baseURL: import.meta.env.VITE_APP_MOCK_API,
    url: 'org/getOrgDetail',
    method: 'get',
    params: data
  })
}

// 查询组织列表
export const getOrgList = (data: any) => {
  return axios.request<IResponseModel<any>>({
    baseURL: import.meta.env.VITE_APP_MOCK_API,
    url: 'org/getOrgList',
    method: 'get',
    params: data
  })
}

// 系统组织下拉搜索
export const getOrgSelect2 = (data: any) => {
  return axios.request<IResponseModel<any>>({
    baseURL: import.meta.env.VITE_APP_MOCK_API,
    url: 'org/getOrgSelect2',
    method: 'get',
    params: data
  })
}

// 获取组织树
export const getOrgTree = (data: any) => {
  return axios.request<IResponseModel<any>>({
    baseURL: import.meta.env.VITE_APP_MOCK_API,
    url: 'org/getOrgTree',
    method: 'get',
    params: data
  })
}

// 修改组织
export const updateOrg = (data: any) => {
  return axios.request<IResponseModel<any>>({
    url: 'org/updateOrg',
    method: 'put',
    data
  })
}

// 删除组织
export const deleteOrg = (data: any) => {
  return axios.request<IResponseModel<any>>({
    url: `org/deleteOrg/${data.id}`,
    method: 'post'
  })
}
