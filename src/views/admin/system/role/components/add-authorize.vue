<template>
  <el-dialog custom-class="add-authorize" v-model="dialogVisible" width="500px" @close="onDestroy">
    <el-form label-width="80px">
      <el-form-item label="权限" prop="role" style="width: 100%">
        <el-card shadow="never" style="width: 100%" :body-style="{ padding: 0, height: '400px' }">
          <el-scrollbar>
            <el-tree
              class="menu-tree"
              ref="tree"
              :data="menuList"
              node-key="id"
              default-expand-all
              :props="{ label: 'name' }"
              empty-text="暂无数据"
              show-checkbox
              :check-strictly="true"
              highlight-current
            >
              <template v-slot="{ data }">
                <span :data-roleId="data.id" :class="{ ve_tree_item: data.type == 2 }">{{ data.name }}</span>
              </template>
            </el-tree>
          </el-scrollbar>
        </el-card>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onDestroy">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, useAttrs } from 'vue'
import { getMenuGrantByRoleId, roleMenuGrant } from '@/api/auth/role'
import { ElMessage } from 'element-plus'
import { forEachTree } from '@/utils'

interface DialogProps {
  title?: string
  rowData?: any
  callback?: () => Promise<any>
}

defineProps(['onDestroy'])

const { rowData, callback } = useAttrs() as DialogProps
const dialogVisible = ref(true)

const tree = ref(null)
const menuList: any = ref([])

const queryMenuList = async () => {
  let { data, retCode, retMsg } = await getMenuGrantByRoleId({ roleId: rowData.id })
  if (retCode !== 200) return ElMessage.warning(retMsg)
  let list = data || []
  let menuIds: string[] = []
  let childrenName = 'childTreeList'
  forEachTree(list, item => {
    if (item[childrenName]) {
      item.name = item.menuName
      item.children = item[childrenName]
      if (item.grantFlag) {
        menuIds.push(item.id)
      }
    }
  })

  menuList.value = list
  ;(tree.value as any).setCheckedKeys(menuIds)
}

const onMounted = async () => {
  await queryMenuList()
}

onMounted()

const handleSubmit = async () => {
  let checkedNodes = (tree.value as any).getCheckedNodes(false, true)
  let menuIds = checkedNodes.filter(t => t.menuType === 3).map(t => t.id)
  let params = {
    menuIdList: menuIds,
    roleId: rowData.id
  }
  let { retCode, retMsg } = await roleMenuGrant(params)
  if (retCode !== 200) return ElMessage.warning(retMsg)
  ElMessage.success('授权成功')
  callback!()
}
</script>
