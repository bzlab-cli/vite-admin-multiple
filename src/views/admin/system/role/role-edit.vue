<template>
  <div class="role-edit card-detail">
    <el-form class="form-content">
      <el-form-item class="form-item" label="角色名称:">
        <el-input class="ipt" disabled v-model="form.roleName" />
      </el-form-item>
      <el-form-item class="form-item" label="用户数:">
        <el-input class="ipt" disabled v-model="form.memberNum" />
      </el-form-item>
      <el-form-item class="form-item" label="备注:">
        <el-input class="ipt" disabled v-model="form.remarks" />
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="企业权限编辑" name="first">
        <div>权限编辑</div>
      </el-tab-pane>
      <el-tab-pane label="APP权限编辑" name="second">
        <div>APP权限编辑</div>
      </el-tab-pane>
    </el-tabs>
    <div v-show="currentTabs == 'first'">
      <div class="tree-all">
        <el-tree
          ref="choseTreeRef"
          show-checkbox
          default-expand-all
          :data="menuList"
          node-key="id"
          :props="defaultProps"
          expand-on-click-node
        />
      </div>
      <div class="btn-all">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </div>
    <div v-show="currentTabs == 'second'">
      <div class="tree-all">
        <el-tree
          ref="choseTreeRefApp"
          show-checkbox
          default-expand-all
          :data="menuListApp"
          node-key="id"
          :props="defaultProps"
          expand-on-click-node
        />
      </div>
      <div class="btn-all">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getRoleDetail, getRoleAuthDetail, roleMenuGrant } from '@/api/auth/role'

const choseTreeRef = ref()
const choseTreeRefApp = ref()
const activeName = ref('first')
const route = useRoute()
const state: any = reactive({
  currentTabs: 'first',
  defaultProps: {
    children: 'childTreeList',
    label: 'menuName'
  },
  checkedKeys: [],
  roleId: null,
  allMenuList: [],
  menuList: [],
  menuListApp: [],
  form: {
    remarks: '',
    roleName: null,
    roleType: null,
    memberNum: null
  }
})
if (route.query.roleId) {
  state.roleId = route.query?.roleId
  getAllMenuList()
  getDetail()
}
function handleCancel() {
  window.history.back()
}
async function handleSubmit() {
  const getCheckedNodes = ref => [...(ref.value?.getCheckedNodes() || []), ...(ref.value?.getHalfCheckedNodes() || [])]
  const processNodes = nodes =>
    nodes
      .map(m => ({
        menuId: m.menuId ?? m.id ?? ''
      }))
      .filter(x => x.menuId)

  const baseNodes = processNodes(getCheckedNodes(choseTreeRef))
  const appNodes = processNodes(getCheckedNodes(choseTreeRefApp))
  const allNodes = [...baseNodes, ...appNodes]
  if (!allNodes.length) {
    return ElMessage.warning('最少有一项权限')
  }
  const { retCode, retMsg } = await roleMenuGrant({
    roleId: state.roleId,
    menus: Array.from(new Set(allNodes))
  })
  if (retCode != 200) return ElMessage.warning(retMsg)
  ElMessage.success('授权成功')
  window.history.back()
}
let setCheckedKeys = (arr, type) => {
  const checkedArr: string[] = []
  const helper = nodes => {
    if (!Array.isArray(nodes)) return
    for (const item of nodes) {
      if (!item.grantFlag) continue
      const currentTreeRef = type === 'first' ? choseTreeRef.value : choseTreeRefApp.value
      const treeNode = currentTreeRef?.getNode(item.id)
      if (!treeNode) continue
      const isValidLeaf = !treeNode.childNodes?.length
      const shouldPush = type === 'first' ? isValidLeaf : !treeNode.childNodes?.length

      if (shouldPush) {
        checkedArr.push(item.id)
      }

      if (item.childTreeList?.length) {
        helper(item.childTreeList)
      }
    }
  }

  helper(arr)

  const targetTree = type === 'first' ? choseTreeRef.value : choseTreeRefApp.value
  targetTree?.setCheckedKeys(checkedArr)

  // const checkedArr: any = []
  // const helper = function (arr) {
  //   if (!Array.isArray(arr)) {
  //     return []
  //   }
  //   for (const item of arr) {
  //     if (item.grantFlag) {
  //       if (type === 'first') {
  //         if (
  //           choseTreeRef.value.getNode(item.id) &&
  //           (!choseTreeRef.value.getNode(item.id)?.childNodes ||
  //             !choseTreeRef.value.getNode(item.id)?.childNodes.length)
  //         ) {
  //           checkedArr.push(item.id)
  //         }
  //       } else if (type === 'second') {
  //         if (
  //           !choseTreeRefApp.value.getNode(item.id)?.childNodes ||
  //           !choseTreeRefApp.value.getNode(item.id)?.childNodes.length
  //         ) {
  //           checkedArr.push(item.id)
  //         }
  //       }
  //     }
  //     if (item.childTreeList && item.childTreeList.length) {
  //       helper(item.childTreeList)
  //     }
  //   }
  // }
  // helper(arr)
  // if (type === 'first') {
  //   choseTreeRef.value.setCheckedKeys(checkedArr)
  // } else if (type === 'second') {
  //   choseTreeRefApp.value.setCheckedKeys(checkedArr)
  // }
}
async function getDetail() {
  const { retCode, retMsg, data } = await getRoleDetail({
    roleId: state.roleId
  })
  if (retCode != 200) return ElMessage.warning(retMsg)
  if (data) {
    state.form = data
  }
}
async function getAllMenuList() {
  const { retCode, retMsg, data } = await getRoleAuthDetail({
    roleId: state.roleId,
    menuSource: 1
  })
  if (retCode != 200) return ElMessage.warning(retMsg)
  if (data) {
    state.allMenuList = JSON.parse(JSON.stringify(data))
    state.menuList = data
    setTimeout(() => {
      setCheckedKeys(data, 'first')
      setCheckedKeys(data, 'thirdly')
    }, 100)
  }
}

function handleClick(e) {
  state.currentTabs = e.props.name
  setTimeout(() => {
    setCheckedKeys(state.menuList, e.props.name)
  }, 0)
}
const { form, menuList, defaultProps, menuListApp, currentTabs } = toRefs(state)
</script>
<style scoped lang="scss">
.form-content {
  display: flex;
  align-items: center;
  .form-item {
    margin-right: 200px;
    .ipt {
      width: 200px;
    }
  }
}
.all-menu {
  margin-top: 20px;
  .menu-item {
    margin-bottom: 20px;
    .item-top {
      margin-bottom: 10px;
    }
    .menu-button-all {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding-left: 20px;
      .menu-button {
        margin-right: 20px;
      }
    }
  }
}
.btn-all {
  display: flex;
  justify-content: flex-end;
}
.tree-all {
  margin: 20px 0;
}
</style>
