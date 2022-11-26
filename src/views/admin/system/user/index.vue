<template>
  <div class="table-box">
    <bz-table
      ref="bzTableRef"
      :searchColumns="searchColumns"
      :filterSearchField="filterSearchField"
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
import { IMajorSchema, majorList } from '@/constant/major'
import { getUserList } from '@/api/auth/user'
import { getRoleSelect2 } from '@/api/auth/role'

const bzTableRef = ref()

;(window as any).bzTableRef = bzTableRef
// const roleList = ref([])

const initParam = reactive({
  type: 1
})

const filterSearchField = ['orgName']

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
      el: 'el-input',
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
      el: 'el-input',
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
      el: 'el-select',
      defaultValue: 'sub_ad',
      props: {
        placeholder: '请选择角色',
        clearable: true
      }
    }
  },
  {
    prop: 'orgName',
    label: '组织',
    enum: [{ roleName: '111', id: '55' }],
    fieldNames: { label: 'roleName', value: 'id' },
    search: {
      el: 'el-date-picker',
      // key: 'test11',
      // defaultValue: '55',
      // defaultValue: ['2022-11-12 11:35:00', '2022-12-12 11:35:00'],
      props: {
        type: 'datetimerange',
        'value-format': 'YYYY-MM-DD',
        placeholder: '请选择组织',
        clearable: true
      },
      event: {
        change: scope => {
          console.log('555-change', scope)

          bzTableRef.value.searchParams.startTime = scope[0]
          bzTableRef.value.searchParams.endTime = scope[1]

          console.log('bzTableRef.value.searchParams', bzTableRef.value.searchParams)
        }
      }
    }
  },
  {
    prop: 'forbiddenStatus',
    label: '状态',
    search: {
      el: 'el-select',
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
    label: '用户名'
  },

  { prop: 'phone', label: '手机号' },
  { prop: 'email', label: '邮箱' },
  { prop: 'createTime', label: '创建时间' },
  {
    prop: 'roleName',
    label: '角色',
    enum: getRoleSelect2,
    fieldNames: { label: 'roleName', value: 'id' }
  },
  {
    prop: 'orgName',
    label: '组织',
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
