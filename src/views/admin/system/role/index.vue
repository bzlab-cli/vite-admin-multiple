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
      <template #operation="scope">
        <el-button size="small" type="primary" link class="ml5" @click="handleAddAuth('授权', scope.row)">
          授权
        </el-button>
        <el-button size="small" type="primary" link class="ml5" @click="handleAddRole('修改角色', scope.row)">
          修改
        </el-button>
      </template>
    </bz-table>
  </div>
</template>

<script lang="tsx" setup>
import { ref } from 'vue'
import addRole from './components/add-role.vue'
import addAuthorize from './components/add-authorize.vue'
import { getRoleList } from '@/api/auth/role'
import { ColumnProps } from '@/interface/table'
import bzTable from '@/components/bz-table/index.vue'
import { dynamic } from '@bzlab/bz-core'

const bzTableRef = ref()
;(window as any).bzTableRef = bzTableRef

const handleAddRole = (title: string, rowData?) => {
  console.log('rowData', rowData)

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

const handleAddAuth = (title: string, rowData?) => {
  const params = {
    id: 'addAuthorize', // 组件id
    el: '#app', // 挂载节点
    data: {
      title,
      rowData,
      callback: () => bzTableRef.value.getTableList()
    },
    render: addAuthorize
  }
  dynamic.show(params)
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
  { type: 'selection', fixed: 'left', width: 80 },
  {
    label: '角色名称',
    prop: 'roleName'
  },
  {
    label: '状态',
    prop: 'status',
    render: ({ row }) => {
      return <el-tag type={row.status == 0 ? '' : 'danger'}>{row.status == 0 ? '启用' : '禁用'}</el-tag>
    }
  },
  {
    label: '组织',
    prop: 'orgName',
    render: ({ row }) => {
      return <>{<span>{row.orgId === 0 ? '全部' : row.orgName}</span>}</>
    }
  },
  {
    label: '创建时间',
    prop: 'createTime'
  },
  {
    label: '操作',
    prop: 'operation',
    fixed: 'right'
  }
]
</script>
