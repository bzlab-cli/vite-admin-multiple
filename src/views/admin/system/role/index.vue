<template>
  <div class="table-box">
    <bz-table
      ref="bzTableRef"
      :searchColumns="searchColumns"
      :columns="columns"
      :requestApi="getRoleList"
      :dataCallback="dataCallback"
    >
      <template #tableHeader>
        <el-button type="primary" @click="handleAddRole('新增角色')">新增角色</el-button>
      </template>
      <template #forbiddenStatus="scope">
        <el-switch
          :class="scope.row.forbiddenStatus ? 'el-switch__active' : 'el-switch__inactive'"
          :inactive-text="scope.row.forbiddenStatus ? '启用' : '禁用'"
          @change="handleSwitch(scope.row, $event)"
          :active-value="1"
          :inactive-value="0"
          inactive-color="#ff4949"
          v-model="scope.row.forbiddenStatus"
        />
      </template>
      <template #operation="scope">
        <el-button size="small" type="primary" link @click="handleAddRole('修改角色', scope.row)">修改</el-button>
        <el-button size="small" type="primary" link @click="handleAddAuth(scope.row)">权限编辑</el-button>
        <el-button size="small" type="danger" link @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </bz-table>
  </div>
</template>

<script lang="tsx" setup>
import { ref } from 'vue'
import addRole from './components/add-role.vue'
import { getRoleList, deleteRole, changeRoleStatus } from '@/api/auth/role'
import { ColumnProps } from '@/interface/table'
import { dynamic } from '@bzlab/bz-core'
import { useConfirm } from '@/hooks/handle/use-handle'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const bzTableRef = ref()

const handleAddRole = (title: string, rowData?) => {
  const params = {
    id: 'addRole', // 组件id
    el: '#app', // 挂载节点
    data: {
      title,
      rowData,
      isAdd: title === '新增角色',
      callback: () => bzTableRef.value.getTableList()
    },
    render: addRole
  }
  dynamic.show(params)
}

const handleAddAuth = row => {
  router.push({
    path: '/system/role/auth',
    query: {
      roleId: row.roleId
    }
  })
}

async function handleDelete(row) {
  const message = `确认删除此角色?`
  await useConfirm(deleteRole, { roleId: row.roleId }, message)
  bzTableRef.value.getTableList()
}

async function handleSwitch(row, status?) {
  status
  if (!row.roleId) return
  let { retCode, retMsg } = await changeRoleStatus({ roleId: row.roleId })
  if (retCode !== 200) return ElMessage.warning(retMsg)
  ElMessage.success('操作成功')
  bzTableRef.value.getTableList()
}

const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total
  }
}

const searchColumns = [
  {
    label: '角色名称',
    prop: 'roleName',
    search: {
      el: 'el-input',
      props: {
        placeholder: '请输入角色名称',
        clearable: true
      }
    }
  }
]

const columns: ColumnProps[] = [
  {
    label: '角色名称',
    prop: 'roleName'
  },
  {
    label: '用户数',
    prop: 'memberNum'
  },
  {
    label: '备注',
    prop: 'remarks'
  },
  {
    label: '状态',
    prop: 'forbiddenStatus'
  },
  {
    label: '操作',
    prop: 'operation',
    fixed: 'right'
  }
]
</script>
