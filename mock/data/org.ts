/*
 * @Author: jrucker
 * @Description: 数据
 * @Date: 2024/10/25 18:56:51
 * @LastEditors: jrucker
 * @LastEditTime: 2025/03/05 17:53:40
 */

export const getOrgList = {
    "total": 1,
    "list": [
      {
        "id": "d070d5b6-d019-4856-a50e-f011eceb7051",
        "parentId": "0",
        "parentOrgName": "-",
        "orgName": "某某有限公司",
        "orgSort": 0,
        "userCount": 1,
        "updateTime": "2025-01-20 11:26:53",
        "list": [],
        "remarks": ""
      }
    ],
    "pageNum": 1,
    "pageSize": 15,
    "size": 1,
    "startRow": 1,
    "endRow": 1,
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
} as any

export const getOrgTree = [
  {
      "id": "d070d5b6-d019-4856-a50e-f011eceb7051",
      "orgName": "某某有限公司",
      "userCount": 10,
      "list": [
          {
              "id": "cb1b3179-2f18-4212-ada5-dec89050cf38",
              "orgName": "项目部",
              "userCount": 8,
              "list": []
          },
          {
              "id": "4f28a30c-874a-47c2-9eaa-4dd7774e8318",
              "orgName": "工程部",
              "userCount": 1,
              "list": [
                {
                  "id": "4f274e73-921f-4cb7-ab22-6604efe8bcb1",
                  "orgName": "通风科",
                  "userCount": 0,
                  "list": [] as any
                }
              ]
          }
      ]
  }
]