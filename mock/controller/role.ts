/*
 * @Author: jrucker
 * @Description:
 * @Date: 2024/10/25 18:56:51
 * @LastEditors: jrucker
 * @LastEditTime: 2025/03/05 17:42:52
 */

import { prefix, get } from '../decorator/request'
import { menuGrantByRole } from '../data/role'

@prefix('/business-web')
export default class User {
  @get('/role/getRoleSelect2')
  async getRoleSelect2() {
    return [
      {
        "id": "a67a454f-4d1a-49ca-99fa-8c2c351e0ff6",
        "roleName": "管理员",
        "roleType": 6
      },
      {
          "id": "376e7028-7515-4469-a7e8-3ec6436e7d72",
          "roleName": "用户",
          "roleType": 6
      },
      {
          "id": "d4095624-1ea4-4a48-871a-e0ec85e1e08c",
          "roleName": "测试",
          "roleType": 6
      }
    ]
  }

  @get('/role/getRoleList')
  getRoleList() {
    return {
      "total": 4,
      "list": [
          {
              "roleId": "0ff84a5b-a989-4ba8-b200-accb37439c5b",
              "roleType": 6,
              "roleName": "test",
              "remarks": "",
              "memberNum": 0,
              "forbiddenStatus": 1
          },
          {
              "roleId": "d4095624-1ea4-4a48-871a-e0ec85e1e08c",
              "roleType": 6,
              "roleName": "测试",
              "remarks": "",
              "memberNum": 6,
              "forbiddenStatus": 1
          },
          {
              "roleId": "376e7028-7515-4469-a7e8-3ec6436e7d72",
              "roleType": 6,
              "roleName": "用户",
              "remarks": "",
              "memberNum": 21,
              "forbiddenStatus": 1
          },
          {
              "roleId": "a67a454f-4d1a-49ca-99fa-8c2c351e0ff6",
              "roleType": 6,
              "roleName": "管理员",
              "remarks": "管理员角色-勿动",
              "memberNum": 31,
              "forbiddenStatus": 1
          }
      ],
      "pageNum": 1,
      "pageSize": 4,
      "size": 4,
      "startRow": 0,
      "endRow": 3,
      "pages": 1,
      "prePage": 0,
      "nextPage": 0,
      "isFirstPage": true,
      "isLastPage": true,
      "hasPreviousPage": false,
      "hasNextPage": false,
      "navigatePages": 8,
      "navigatepageNums": [
          1
      ],
      "navigateFirstPage": 1,
      "navigateLastPage": 1
    }
  }

  @get('/role/getMenuGrantByRoleId')
  getMenuGrantByRoleId() {
    return menuGrantByRole
  }

  @get('/role/roleMenuDetail')
  roleMenuDetail() {
    return menuGrantByRole
  }

  @get('/role/roleDetail')
  roleDetail() {
    return {
      "roleName": "test",
      "roleType": 6,
      "remarks": "",
      "memberNum": 0
    }
  }
}
