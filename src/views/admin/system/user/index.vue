<template>
  <div class="table-box">
    <bz-table
      ref="bzTableRef"
      :searchColumns="searchColumns"
      :filterSearchFields="filterSearchFields"
      :columns="columns"
      :requestApi="getUserList"
      :initParam="initParam"
      :dataCallback="dataCallback"
    >
      <template #tableHeader>
        <el-button type="primary" @click="handleAddUser('新增用户')">新增用户</el-button>
      </template>
      <template #forbiddenStatus="scope">
        <el-switch
          :class="scope.row.forbiddenStatus ? 'el-switch__active' : 'el-switch__inactive'"
          :inactive-text="scope.row.forbiddenStatus ? '启用' : '禁用'"
          @change="handleSwitch(scope.row)"
          :active-value="1"
          :inactive-value="0"
          inactive-color="#ff4949"
          v-model="scope.row.forbiddenStatus"
        />
      </template>
      <template #operation="scope">
        <el-button size="small" type="primary" link @click="handleAddUser('修改用户', scope.row)">修改</el-button>
        <el-button size="small" type="primary" link @click="handleResetPwd(scope.row)">重置密码</el-button>
        <el-button size="small" type="danger" link @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </bz-table>
  </div>
</template>

<script lang="tsx" setup name="user">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { ColumnProps } from '@/interface/table'
import { useConfirm } from '@/hooks/handle/use-handle'
import { getUserList, resetPassword, deleteUser, updateUserForbiddenStatus } from '@/api/auth/user'
import { getRoleSelect2 } from '@/api/auth/role'
import { getOrgSelect2 } from '@/api/auth/org'
import { statusList } from '@/constant/user'
import addUser from './components/add-user.vue'
import { dynamic } from '@bzlab/bz-core'

const bzTableRef = ref()
const initParam = reactive({})
const filterSearchFields = ['orgName']

const handleAddUser = (title, rowData) => {
  const params = {
    id: 'addUser', // 组件id
    el: '#app', // 挂载节点
    data: {
      title,
      rowData,
      isAdd: title === '新增用户',
      callback: () => bzTableRef.value.getTableList()
    },
    render: addUser
  }
  dynamic.show(params)
}

const handleResetPwd = async row => {
  const message = `确认重置密码?`
  await useConfirm(resetPassword, { userId: row.userId }, message)
  bzTableRef.value.getTableList()
}

const handleSwitch = async row => {
  if (!row.userId) return
  const { retCode, retMsg } = await updateUserForbiddenStatus({ userId: row.userId })
  if (retCode !== 200) return ElMessage.warning(retMsg)
  ElMessage.success('操作成功')
  bzTableRef.value.getTableList()
}

const handleDelete = async row => {
  const message = `确认删除?`
  await useConfirm(deleteUser, { userId: row.userId }, message)
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
    label: '姓名',
    prop: 'userName',
    search: {
      el: 'el-input',
      props: {
        placeholder: '请输入姓名',
        clearable: true
      }
    }
  },
  {
    label: '手机号',
    prop: 'phone',
    search: {
      el: 'el-input',
      props: {
        placeholder: '请输入手机号',
        clearable: true
      }
    }
  },
  {
    label: '角色',
    prop: 'roleName',
    enum: getRoleSelect2,
    fieldNames: { label: 'roleName', value: 'id' },
    search: {
      el: 'el-select',
      key: 'eqRoleId',
      props: {
        placeholder: '请选择角色',
        clearable: true
      }
    }
  },
  {
    label: '组织',
    prop: 'orgId',
    enum: getOrgSelect2,
    fieldNames: { label: 'value', value: 'key' },
    search: {
      el: 'el-select',
      key: 'orgId',
      props: {
        placeholder: '请选择组织',
        clearable: true
      }
    }
  },
  {
    label: '状态',
    prop: 'forbiddenStatus',
    enum: statusList,
    fieldNames: { label: 'name', value: 'id' },
    search: {
      el: 'el-select',
      key: 'forbiddenStatus',
      props: {
        placeholder: '请选择状态',
        clearable: true
      }
    }
  }
]

const columns: ColumnProps[] = [
  {
    label: '姓名',
    prop: 'userName'
  },

  {
    label: '手机号',
    prop: 'phone'
  },
  {
    label: '角色',
    prop: 'role'
  },
  {
    label: '组织',
    prop: 'org'
  },
  {
    label: '状态',
    prop: 'forbiddenStatus'
  },
  {
    label: '备注',
    prop: 'remarks'
  },
  {
    label: '操作',
    prop: 'operation',
    fixed: 'right',
    width: 210
  }
]
</script>
