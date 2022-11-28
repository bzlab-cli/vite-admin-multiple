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
        <el-button type="primary">新增用户</el-button>
      </template>
      <!-- <template #operation="scope">
        <el-button size="small" type="primary" link class="ml5" @click="onOpenEditUser(scope.row)">修改</el-button>
        <el-button
          size="small"
          type="primary"
          link
          class="ml5"
          @click="onRowEnableChange(scope.row, scope.row.forbiddenStatus == 1 ? 0 : 1)"
        >
          {{ scope.row.forbiddenStatus == 1 ? '禁用' : '启用' }}
        </el-button>
        <el-button size="small" type="primary" link class="ml5" @click="handleResetPassword(scope.row)">
          重置密码
        </el-button>
        <el-button size="small" type="primary" link class="ml5" @click="onRowDel(scope.row)">删除</el-button>
      </template> -->
    </bz-table>
  </div>
</template>

<script lang="tsx" setup name="user">
import { ref, reactive } from 'vue'
// import { ElMessage } from 'element-plus'
import { ColumnProps } from '@/interface/table'
// import { useHandleData } from '@/hooks/table/use-handle-data'
import bzTable from '@/components/bz-table/index.vue'
import { majorList } from '@/constant/major'
import { getUserList } from '@/api/auth/user'
import { getRoleSelect2 } from '@/api/auth/role'
import { getOrgList } from '@/api/auth/org'
import { statusList } from '@/constant/user'

const bzTableRef = ref()

;(window as any).bzTableRef = bzTableRef

const initParam = reactive({})

const filterSearchFields = ['orgName']

const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total
  }
}

const searchColumns = [
  {
    label: '用户名',
    prop: 'userName',
    search: {
      el: 'el-input',
      props: {
        placeholder: '请输入用户名',
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
    prop: 'orgName',
    enum: getOrgList,
    fieldNames: { label: 'orgName', value: 'id', children: 'childTreeList' },
    search: {
      el: 'el-tree-select',
      key: 'eqOrgId',
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
    label: '用户名',
    prop: 'userName'
  },

  {
    label: '手机号',
    prop: 'phone'
  },
  {
    label: '邮箱',
    prop: 'email'
  },
  {
    label: '创建时间',
    prop: 'createTime'
  },
  {
    label: '角色',
    prop: 'roleName',
    filterEnum: true,
    fieldRowNames: { name: 'roleName', value: 'id', rowKey: 'roleId' }
  },
  {
    label: '组织',
    prop: 'orgName',
    render: ({ row }) => {
      return <span>{row.roleId === 'ad' ? '-' : row.orgName}</span>
    }
  },
  {
    label: '专业',
    prop: 'professional',
    enum: majorList,
    filterEnum: true,
    fieldNames: { label: 'name', value: 'value' },
    fieldRowNames: { name: 'name', value: 'value', rowKey: 'professional' }
  },
  {
    label: '状态',
    prop: 'forbiddenStatus',
    render: ({ row }) => {
      return (
        <el-tag type={row.forbiddenStatus == 1 ? '' : 'danger'}>{row.forbiddenStatus == 1 ? '启用' : '禁用'}</el-tag>
      )
    }
  },
  {
    label: '备注',
    prop: 'remarks'
  },
  {
    label: '操作',
    prop: 'operation',
    fixed: 'right',
    width: 190
  }
]
</script>
