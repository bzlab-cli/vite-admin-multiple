/*
 * @Author: jrucker
 * @Description:
 * @Date: 2021/10/25 18:56:51
 * @LastEditors: jrucker
 * @LastEditTime: 2023/08/09 15:06:33
 */
import { deepClone } from '@bzlab/bz-core'

/**
 * 加载组件
 * @param {*} view
 * @returns
 */
const modules = import.meta.glob('/src/views/**/*.vue')

/**
 * 过滤显示菜单路由
 * @param {*} routers
 * @param {*} isRewrite
 * @returns
 */
export const filterAsyncRouter = (routers, layout) => {
  // 遍历后台传来的路由字符串，转换为组件对象
  return routers.filter(item => {
    item.path = item.menuUrl
    if (item.menuComponents === 'Layout') {
      item.redirect = 'noredirect'
    }

    item.meta = {
      title: item.menuName,
      icon: item.menuIcon,
      breadcrumb: item.breadcrumb,
      hidden: item.hiddenFlag === 0
    }

    if (item.menuComponents) {
      if (item.menuComponents === 'Layout') {
        item.component = layout
      } else {
        item.name = item.menuRoute
        item.component = modules['/src/views/' + item.menuComponents]
      }
    }

    if (item.childTreeList && item.childTreeList.length) {
      item.children = filterAsyncRouter(item.childTreeList, layout)
    }

    filterProps(item)
    return true
  })
}

/**
 * 过滤不需要的属性
 * @param {*} item
 */
function filterProps(item) {
  const filterPropsList = [
    'childTreeList',
    'id',
    'menuSort',
    'createUser',
    'menuComponents',
    'menuIcon',
    'menuName',
    'menuRoute',
    'menuSource',
    'menuUrl',
    'parentId',
    'remarks',
    'createTime',
    'updateTime',
    'updateUser'
  ]
  filterPropsList.map(name => {
    delete item[name]
  })
}

/**
 * 扁平化路由数组对象
 * @param {Array} menuList
 * @return array
 */
export function flatRoutes(menuList) {
  const newMenuList = deepClone(menuList)
  return newMenuList.reduce((pre, current) => {
    let flatArr = [...pre, current]
    if (current.children) flatArr = [...flatArr, ...flatRoutes(current.children)]
    return flatArr
  }, [])
}

/**
 * 递归过滤需要渲染在左侧菜单的列表
 * @param {Array} menuList
 * @return array
 * */
export function getShowMenuList(menuList) {
  const newMenuList = deepClone(menuList)
  return newMenuList.filter(item => {
    item.children?.length && (item.children = getShowMenuList(item.children))
    return !item.meta?.hidden
  })
}

/**
 * 递归找出所有面包屑
 * @param {Array} menuList
 * @param {Object} result
 * @param {String} path
 * @returns object
 */
export const getAllBreadcrumbList = (menuList, result: { [key: string]: any } = {}, path = []) => {
  for (const item of menuList) {
    result[item.path] = [...path, item]
    if (item.children) getAllBreadcrumbList(item.children, result, result[item.path])
  }
  return result
}

/**
 * @description 过滤出最底层子路由第一条数据
 * @param routes 路由数据
 * @returns
 */
export function getDeepChildNode(routes): any {
  let deepNode = null
  let maxDepth = 0

  function dfs(node, depth) {
    if (!node.children || !node.children.length) {
      if (depth > maxDepth) {
        maxDepth = depth
        deepNode = node
      }
      return
    }
    for (const child of node.children) {
      dfs(child, depth + 1)
    }
  }
  for (const node of routes) {
    dfs(node, 1)
  }

  return deepNode
}

/**
 * @description 添加重定向路由
 * @param routes 路由数据
 * @returns
 */
export function addRedirectRoute(mode, constantRoutes, asyncRoutes, router): any {
  const routes = constantRoutes.concat(asyncRoutes)
  const route = routes.find(item => item.path === '/')
  let showMenus = []
  if (mode === 'admin') {
    showMenus = getShowMenuList(routes) || []
  }
  const node = getDeepChildNode(showMenus)
  if (route) return
  const path = node?.path ?? ''
  const obj = {
    path: '/',
    redirect: path,
    meta: { hidden: true }
  }
  router.addRoute(obj)
  return routes.concat(obj)
}
