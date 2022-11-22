/*
 * @Author: jrucker
 * @Description: 数据
 * @Date: 2021/10/25 18:56:51
 * @LastEditors: jrucker
 * @LastEditTime: 2022/11/22 16:04:04
 */

interface IUser {
  userId: string
  userName: string
  roleId: string
  roleName: string
  orgId: number
  orgName: number
  headUrl: string
  phone: string
  account: string
  email: string
}

const user: IUser = {
  userId: '1ee3d49b-aa78-4846-a1b7-76044d097c8e',
  userName: 'admin',
  roleId: 'ad',
  roleName: '系统管理员',
  orgId: 0,
  orgName: null,
  headUrl: '',
  phone: '13575356945',
  account: '13575356945',
  email: ''
}

export default user
