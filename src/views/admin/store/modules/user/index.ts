/*
 * @Author: jrucker
 * @Description:
 * @Date: 2021/10/25 18:56:51
 * @LastEditors: jrucker
 * @LastEditTime: 2023/06/12 17:18:43
 */
import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'
import { getToken } from '@/utils/auth'
import { login as fetchLogin, userInfo } from '@/api/auth/user'
import { getMenuGrantByRoleId } from '@/api/auth/role'
import { removeToken, setToken } from '@/utils/auth'
import { resetRouter } from '@/views/admin/router'
import { ElMessage } from 'element-plus'
import { usePermissionStore } from '../permission'
import { store } from '@/views/admin/store'
export interface UserState {
  token: string
  name: string
  avatar: string
  userId: string
  roleId: string
  roleName: string
  loadUserInfo: boolean
}

export const useUserStore = defineStore('user', () => {
  const permissionStore = usePermissionStore()
  const state = reactive<UserState>({
    token: getToken() || '',
    userId: '',
    name: '',
    avatar: '',
    roleId: '',
    roleName: '', // 岗位名称
    loadUserInfo: false // 第一次加载用户信息
  })

  const login = async (userInfo: { account: string; password: string }) => {
    const { account, password } = userInfo
    const { data, retCode, retMsg } = await fetchLogin({ account: account.trim(), password })
    if (retCode !== 200) return ElMessage.error(retMsg)
    if (data?.token) {
      setToken(data.token)
      state.token = data.token
    }
  }

  const getUserInfo = async () => {
    const { data, retCode, retMsg } = await userInfo()
    if (retCode !== 200) return ElMessage.error(retMsg)
    state.name = data?.account || ''
    state.avatar = data?.headUrl || '/images/avatar/default.png'
    state.userId = data?.userId || ''
    state.roleId = data?.roleId || ''
    state.roleName = data?.roleName || ''
    state.loadUserInfo = true
  }

  const getMenu = async () => {
    const { data, retCode, retMsg } = await getMenuGrantByRoleId({ roleId: state.roleId })
    if (retCode !== 200) return ElMessage.error(retMsg)
    permissionStore.setRoutes(data)
  }

  const loginOut = () => {
    removeToken()
    state.token = ''
    state.userId = ''
    state.loadUserInfo = false
    resetRouter()
  }

  const resetToken = () => {
    return new Promise(resolve => {
      removeToken()
      state.token = ''
      state.userId = ''
      state.loadUserInfo = false
      resolve('done')
    })
  }

  return { ...toRefs(state), login, getUserInfo, getMenu, loginOut, resetToken }
})

export function useUserStoreHook() {
  return useUserStore(store)
}
