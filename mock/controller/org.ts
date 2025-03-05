/*
 * @Author: jrucker
 * @Description:
 * @Date: 2024/10/25 18:56:51
 * @LastEditors: jrucker
 * @LastEditTime: 2025/03/05 17:02:12
 */

import { prefix, get } from '../decorator/request'
import { getOrgList, getOrgTree } from '../data/org'

@prefix('/business-web')
export default class User {
  @get('/org/getOrgList')
  async getOrgList() {
    return getOrgList
  }

  @get('/org/getOrgTree')
  async getOrgTree() {
    return getOrgTree
  }

  @get('/org/getOrgSelect2')
  async getOrgSelect2() {
    return [
      {
          "key": "d070d5b6-d019-4856-a50e-f011eceb7051",
          "value": "某某有限公司"
      },
      {
          "key": "cb1b3179-2f18-4212-ada5-dec89050cf38",
          "value": "项目部"
      },
      {
          "key": "22c33393-2f2d-4d3f-a752-0f9936c53c64",
          "value": "工程部"
      },
      {
          "key": "4f274e73-921f-4cb7-ab22-6604efe8bcb1",
          "value": "通风科"
      }
    ]
  }
}
