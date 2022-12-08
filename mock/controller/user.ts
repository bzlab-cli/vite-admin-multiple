/*
 * @Author: jrucker
 * @Description:
 * @Date: 2021/10/25 18:56:51
 * @LastEditors: jrucker
 * @LastEditTime: 2022/12/08 11:43:28
 */

import { Random } from 'mockjs'
import { post, prefix, get } from '../decorator/request'
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

  @get('/user/user')
  async getUserList() {
    return {
      total: 2,
      list: [
        {
          userId: '1ee3d49b-aa78-4846-a1b7-76044d097c8e',
          userName: 'admin',
          roleId: 'ad',
          roleName: '系统管理员',
          orgId: 0,
          orgName: '组织',
          headUrl: null,
          phone: '13575356945',
          account: null,
          email: '',
          state: null,
          userType: null,
          rtcAttributes: null,
          jobNumber: null,
          entryDate: null,
          professional: 1,
          dateOfBirth: null,
          education: null,
          createTime: '2021-11-18 10:24:05',
          remarks: '',
          competenceIds: null,
          forbiddenStatus: 1
        },
        {
          userId: '1ee3d49b-aa78-4846-a1b7-76044d097c8e',
          userName: 'admin2',
          roleId: 'sub_ad',
          roleName: '子管理员',
          orgId: 0,
          orgName: '组织2',
          headUrl: null,
          phone: '13575356945',
          account: null,
          email: '',
          state: null,
          userType: null,
          rtcAttributes: null,
          jobNumber: null,
          entryDate: null,
          professional: '',
          dateOfBirth: null,
          education: null,
          createTime: '2021-11-18 10:24:05',
          remarks: '',
          competenceIds: null,
          forbiddenStatus: 1
        },
      ] as any,
      pageNum: 1,
      pageSize: 10,
      size: 10,
      startRow: 0,
      endRow: 9,
      pages: 1,
      prePage: 0,
      nextPage: 0,
      isFirstPage: true,
      isLastPage: true,
      hasPreviousPage: false,
      hasNextPage: false,
      navigatePages: 8,
      navigatepageNums: [1],
      navigateFirstPage: 1,
      navigateLastPage: 1
    }
  }

  @get('/competence')
  competence() {
    return [
      {
          "id": 1,
          "competenceName": "绩效评审组长",
          "competenceCode": "202",
          "describe": null
      },
      {
          "id": 2,
          "competenceName": "绩效主席",
          "competenceCode": null,
          "describe": null
      },
      {
          "id": 3,
          "competenceName": "绩效评审组员",
          "competenceCode": null,
          "describe": null
      }
    ] as any
  }

  @get('/user/getUser')
  getUser() {
    return {
      "userId": "01b322e7-130d-403f-b010-74bde37a0290",
      "userName": "admin",
      "roleId": "ad",
      "roleName": "系统管理员",
      "orgId": 0,
      "orgName": null,
      "headUrl": "",
      "phone": "13575356945",
      "regId": "",
      "account": "13575356945",
      "email": "",
      "state": null,
      "userType": 0,
      "rtcAttributes": null,
      "jobNumber": null,
      "entryDate": null,
      "professional": null,
      "dateOfBirth": null,
      "education": null,
      "createTime": "2022-09-26 16:49:21",
      "remarks": "",
      "competenceIds": null,
      "forbiddenStatus": 1
    } as any
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
