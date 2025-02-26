/*
 * @Author: jrucker
 * @Description:
 * @Date: 2024/10/25 18:56:51
 * @LastEditors: jrucker
 * @LastEditTime: 2024/11/22 16:50:13
 */
import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'
import { getToken } from '@/utils/auth'
import { userInfo } from '@/api/auth/user'
import { getMenuGrantByRoleId } from '@/api/auth/role'
import { removeToken } from '@/utils/auth'
import { resetRouter } from '@/views/screen/router'
import { ElMessage } from 'element-plus'
import { checkImgExists } from '@/utils'
import { usePermissionStore } from '../permission'
import { store } from '@/views/screen/store'
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
    avatar: 'https://img2.baidu.com/it/u=3924374604,1207041510&fm=26&fmt=auto',
    roleId: '',
    roleName: '', // 岗位名称
    loadUserInfo: false // 第一次加载用户信息
  })

  const getUserInfo = async () => {
    const { data, retCode, retMsg } = await userInfo()
    if (retCode !== 200) return ElMessage.error(retMsg)
    state.name = data?.account || ''
    const exist = await checkImgExists(data?.headUrl)
    if (exist) {
      state.avatar = data?.headUrl || ''
    }
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

  return { ...toRefs(state), getUserInfo, getMenu, loginOut, resetToken }
})

export function useUserStoreHook() {
  return useUserStore(store)
}
