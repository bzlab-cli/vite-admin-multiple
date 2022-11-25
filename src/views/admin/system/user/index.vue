<template>
  <div class="table-box">
    <bz-table
      ref="bzTableRef"
      :searchColumns="searchColumns"
      :columns="columns"
      :requestApi="getUserList"
      :initParam="initParam"
      :dataCallback="dataCallback"
    >
      <template #tableHeader="scope">
        <el-button type="primary">新增用户{{ scope }}</el-button>
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
import { ColumnProps } from '@/components/bz-table/interface'
// import { useHandleData } from '@/hooks/table/use-handle-data'
import bzTable from '@/components/bz-table/index.vue'
import { IMajorSchema, majorList } from '@/constant/major'
import { getUserList } from '@/api/auth/user'
import { getRoleSelect2 } from '@/api/auth/role'

const bzTableRef = ref()
// const roleList = ref([])

const initParam = reactive({
  type: 1
})

const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total
  }
}

// const fetchRoleList = async () => {
//   let { data, retCode, retMsg } = await getRoleSelect2({})
//   if (retCode !== 200) return ElMessage.warning(retMsg)
//   roleList.value = data
// }

// onMounted(() => {
// fetchRoleList()
// })

const searchColumns = [
  {
    prop: 'userName',
    label: '用户名',
    search: {
      el: 'input',
      props: {
        placeholder: '请输入用户名',
        clearable: true
      }
    }
  },
  {
    prop: 'phone',
    label: '手机号',
    search: {
      el: 'input',
      props: {
        placeholder: '请输入手机号',
        clearable: true
      }
    }
  },
  {
    prop: 'roleName',
    label: '角色',
    enum: getRoleSelect2,
    fieldNames: { label: 'roleName', value: 'id' },
    search: {
      el: 'select',
      props: {
        placeholder: '请选择角色',
        clearable: true
      }
    }
  },
  {
    prop: 'orgName',
    label: '组织',
    search: {
      el: 'select',
      props: {
        placeholder: '请选择组织',
        clearable: true
      }
    }
  },
  {
    prop: 'forbiddenStatus',
    label: '状态',
    search: {
      el: 'select',
      props: {
        placeholder: '请选择状态',
        clearable: true
      }
    }
  }
]

const columns: ColumnProps[] = [
  {
    prop: 'userName',
    label: '用户名',
    search: { el: 'input' }
  },

  { prop: 'phone', label: '手机号', search: { el: 'input' } },
  { prop: 'email', label: '邮箱' },
  { prop: 'createTime', label: '创建时间' },
  {
    prop: 'roleName',
    label: '角色',
    enum: getRoleSelect2,
    fieldNames: { label: 'roleName', value: 'id' },
    search: { el: 'select' }
  },
  {
    prop: 'orgName',
    label: '组织',
    search: { el: 'select' },
    render: ({ row }) => {
      return <span>{row.roleId === 'ad' ? '-' : row.orgName}</span>
    }
  },
  {
    prop: 'professional',
    label: '专业',
    render: ({ row }) => {
      return <span>{professionalFilter(row)}</span>
    }
  },
  {
    prop: 'forbiddenStatus',
    label: '状态',
    search: { el: 'select' },
    render: ({ row }) => {
      return (
        <el-tag type={row.forbiddenStatus == 1 ? '' : 'danger'}>{row.forbiddenStatus == 1 ? '启用' : '禁用'}</el-tag>
      )
    }
  },
  { prop: 'remarks', label: '备注' },
  { prop: 'operation', label: '操作', fixed: 'right', width: 190 }
]

function professionalFilter(row) {
  let item = majorList.find(t => t.value !== 0 && t.value === row.professional) as IMajorSchema
  if (item) {
    return item.name
  }
}
</script>
