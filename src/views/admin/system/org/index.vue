<template>
  <div class="table-box">
    <bz-table
      ref="bzTableRef"
      :searchColumns="searchColumns"
      :columns="columns"
      :requestApi="getOrgList"
      :dataCallback="dataCallback"
    >
      <template #tableHeader>
        <el-button type="primary" @click="handleAddOrg('新增组织')">新增组织</el-button>
      </template>
      <template #operation="scope">
        <el-button size="small" type="primary" link @click="handleAddOrg('修改组织', scope.row)">修改</el-button>
      </template>
    </bz-table>
  </div>
</template>

<script lang="tsx" setup>
import { ref } from 'vue'
import addOrg from './components/add-org.vue'
import { getOrgList } from '@/api/auth/org'
import { ColumnProps } from '@/interface/table'
import bzTable from '@/components/bz-table/index.vue'
import { dynamic } from '@bzlab/bz-core'

const bzTableRef = ref()
;(window as any).bzTableRef = bzTableRef

const handleAddOrg = (title: string, rowData?) => {
  const params = {
    id: 'addOrg', // 组件id
    el: '#app', // 挂载节点
    data: {
      title,
      rowData,
      isAdd: title === '新增组织',
      callback: () => bzTableRef.value.getTableList()
    },
    render: addOrg
  }
  dynamic.show(params)
}

const dataCallback = (data: any) => {
  return {
    list: data,
    total: data.total
  }
}

const searchColumns = [
  {
    label: '组织名称',
    prop: 'orgName',
    search: {
      el: 'el-input',
      props: {
        placeholder: '请输入组织名称',
        clearable: true
      }
    }
  }
]

const columns: ColumnProps[] = [
  {
    label: '组织名称',
    prop: 'orgName'
  },
  {
    label: '排序',
    prop: 'orgSort'
  },
  {
    label: '状态',
    prop: 'status',
    render: ({ row }) => {
      return <el-tag type={row.status == 0 ? '' : 'danger'}>{row.status == 0 ? '启用' : '禁用'}</el-tag>
    }
  },
  {
    label: '创建时间',
    prop: 'createTime'
  },
  {
    label: '备注',
    prop: 'remarks'
  },
  {
    label: '操作',
    prop: 'operation',
    fixed: 'right'
  }
]
</script>
