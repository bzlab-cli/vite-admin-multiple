/*
 * @Author: jrucker
 * @Description:
 * @Date: 2024/10/25 18:56:51
 * @LastEditors: jrucker
 * @LastEditTime: 2025/03/05 17:25:46
 */

import { Random } from 'mockjs'
import { post, prefix, get, put, del } from '../decorator/request'
import user from '../data/user'
import { randomImage } from '../utils'

export interface TestModel {
  id: number
  status: string
  title: string
  abstractContent: string
  sourceURL: string
  imageURL: string
  platforms: string[]
  disableComment: boolean
  author: string
  importance: number
  type: string
  views: number
  createDate: string
}

const testList: TestModel[] = []
const testCount = 100

for (let i = 0; i < testCount; i++) {
  testList.push({
    id: i,
    status: Random.pick(['published', 'draft']),
    title: Random.title(6, 10),
    abstractContent: Random.sentence(2),
    sourceURL: Random.url(),
    imageURL: randomImage(200, 200),
    platforms: [Random.pick(['a-platform', 'b-platform', 'c-platform'])],
    disableComment: Random.boolean(),
    author: Random.name(),
    importance: Random.integer(1, 3),
    type: Random.pick(['CN', 'US', 'JP', 'EU']),
    views: Random.integer(300, 500),
    createDate: Random.datetime()
  })
}
@prefix('/business-web')
export default class User {
  @post('/testList')
  async testList(ctx: any) {
    const { importance, type, title, page = 1, limit = 20, sort } = ctx.request.body
    let mockList = testList.filter(item => {
      if (importance && item.importance !== +importance) return false
      if (type && item.type !== type) return false
      if (title && item.title.indexOf(title as string) < 0) return false
      return true
    })

    if (sort === '-id') {
      mockList = mockList.reverse()
    }
    const pageList = mockList.filter(
      (_, index) => index < (limit as number) * (page as number) && index >= (limit as number) * ((page as number) - 1)
    )
    return {
      total: mockList.length,
      items: pageList
    }
  }

  @get('/getTest')
  async getTest(ctx: any) {
    const { id } = ctx.query
    for (const test of testList) {
      if (test.id.toString() === id) {
        return test
      }
    }
    return {
      retCode: 500,
      retMsg: '网络错误'
    }
  }

  @post('/user/login')
  async login() {
    return {
      userId: '1ee3d49b-aa78-4846-a1b7-76044d097c8e',
      userName: 'admin',
      token: 'e9579a38-5585-46f7-9036-d3d5c95b1d94',
      roleId: 'ad',
      orgId: 0,
      headUrl: ''
    }
    // return ctx.throw(401)
  }

  @get('/user/getUserByToken')
  async getUserInfo() {
    return user
  }

  @get('/user/getUserList')
  async getUserList() {
    return {
      "total": 2,
      "list": [
          {
              "userId": "a138a1c5-6bdc-420c-b1f7-784e51429998",
              "userName": "管理员1",
              "phone": "15012345678",
              "orgId": "cb1b3179-2f18-4212-ada5-dec89050cf38",
              "org": "项目部",
              "postStation": "1",
              "role": "管理员",
              "forbiddenStatus": 1,
              "headUrl": "",
              "idCard": ""
          },
          {
              "userId": "eff85def-f1c0-4435-9479-885451faa57a",
              "userName": "管理员2",
              "phone": "18888888883",
              "orgId": "4f28a30c-874a-47c2-9eaa-4dd7774e8318",
              "org": "工程部",
              "postStation": "管理人员",
              "role": "管理员",
              "forbiddenStatus": 1,
              "headUrl": "",
              "idCard": ""
          }
      ],
      "pageNum": 1,
      "pageSize": 10,
      "size": 10,
      "startRow": 1,
      "endRow": 10,
      "pages": 2,
      "prePage": 0,
      "nextPage": 2,
      "isFirstPage": true,
      "isLastPage": false,
      "hasPreviousPage": false,
      "hasNextPage": true,
      "navigatePages": 8,
      "navigatepageNums": [
          1,
          2
      ],
      "navigateFirstPage": 1,
      "navigateLastPage": 2
    }
  }

  @get('/user/getUser')
  getUser() {
    return {
      "userId": "a138a1c5-6bdc-420c-b1f7-784e51429998",
      "userName": "管理员1",
      "roleId": "a67a454f-4d1a-49ca-99fa-8c2c351e0ff6",
      "roleName": "管理员",
      "orgId": "d070d5b6-d019-4856-a50e-f011eceb7051",
      "orgName": "某某有限公司",
      "phone": "13575356945",
      "remarks": ""
    } as any
  }

  @put('/user/resetPassword/:id')
  resetPassword() {
    return null as any
  }

  @del('/user/deleteUser')
  deleteUser() {
    return null as any
  }

  @get('/user/getTreeList')
  getTreeList() {
    return [
      {
        fileId: '0',
        folderName: '全部文件',
        isChild: true,
        suffix: null,
        isFolder: null,
        dwgConversionState: null,
        childs: [
          {
            fileId: 'f152f1ae-a1aa-4888-bd1e-6487b270035f',
            folderName: '智慧工地图纸汇总',
            isChild: true,
            suffix: ' ',
            isFolder: true,
            dwgConversionState: null,
            childs: [
              {
                fileId: '1b7214d6-414e-4f8d-997b-1ef29d40fbe8',
                folderName: '暖通',
                isChild: true,
                suffix: '',
                isFolder: true,
                dwgConversionState: null,
                childs: [
                  {
                    fileId: 'a36bdee5-8aa8-43d5-b6be-9afbc70499ff',
                    folderName: '地上CAD',
                    isChild: false,
                    suffix: '',
                    isFolder: true,
                    dwgConversionState: null,
                    childs: []
                  },
                  {
                    fileId: 'b6930066-174a-428d-8e21-bab4b2af3e99',
                    folderName: '地下室CAD',
                    isChild: false,
                    suffix: '',
                    isFolder: true,
                    dwgConversionState: null,
                    childs: []
                  }
                ]
              }
            ]
          }
        ]
      }
    ] as any
  }
}
