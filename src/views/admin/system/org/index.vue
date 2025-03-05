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
        <el-button size="small" type="danger" link @click="handleDeleteOrg(scope.row)">删除</el-button>
      </template>
    </bz-table>
  </div>
</template>

<script lang="tsx" setup>
import { ref } from 'vue'
import addOrg from './components/add-org.vue'
import { getOrgList, deleteOrg } from '@/api/auth/org'
import { ColumnProps } from '@/interface/table'
import { dynamic } from '@bzlab/bz-core'
import { useConfirm } from '@/hooks/handle/use-handle'

const bzTableRef = ref()

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

const handleDeleteOrg = async row => {
  const message = `确认删除此组织?`
  await useConfirm(deleteOrg, { id: row.id }, message)
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
    label: '用户数',
    prop: 'userCount'
  },
  {
    label: '排序',
    prop: 'orgSort'
  },
  {
    label: '创建时间',
    prop: 'updateTime'
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
