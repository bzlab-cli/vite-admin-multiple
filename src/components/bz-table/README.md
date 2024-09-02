# bz-table

表格组件

### 参数及事件列表

```
:tabsProps="tabsProps"
:tabsColumns="tabsColumns"
:tabsClick="handleTabsClick"
:searchColumns="searchColumns"
:filterSearchFields="filterSearchFields"
:columns="columns"
:requestApi="requestApi"
:dataCallback="dataCallback"
:pagination="pagination"
:hideSearch="hideSearch"
:initParam="initParam"
:border="border"
:toolButton="toolButton"
:selectId="selectId"
:searchCol="searchCol"
:gridTemplateColumnsConfig="gridTemplateColumnsConfig"
```

## 文档

### tabs props 配置项

```
interface TabsProps {
  type?: string
  closable?: boolean
  addable?: boolean
  editable?: boolean
  tabPosition?: string
  stretch?: boolean
}

interface TabsColumnsProps {
  label?: string // 标签名称
  prop?: string // 属性名
  active?: boolean // 活动列
  render?: (scope?) => any
}
```

| 序号 | 参数        | 说明     | 默认值         |
| ---- | ----------- | -------- | -------------- |
| 1    | tabsProps   | 额外属性 | -              |
| 2    | tabsColumns | 列配置项 | []             |
| 3    | tabsClick   | 点击回调 | function(data) |

### props 配置项

```
interface SearchColumnProps {
  label?: string // 标签名称
  labelWidth?: boolean // 标签宽度
  prop?: string // 属性名
  enum?: any // 枚举数据
  enumOptions?: {
    data?: string // 当为接口请求时，指定返回值数据字段
    params?: any // 当为接口请求时，传递参数
  }
  fieldNames?: {
    label: string // 枚举字段
    value: string // 枚举值
    children?: string // 子级枚举
  }
  search?: SearchProps | any // 搜索项配置
  render?: (scope?) => any
}
```

| 序号 | 参数                      | 说明                        | 默认值                                             |
| ---- | ------------------------- | --------------------------- | -------------------------------------------------- |
| 1    | searchColumns             | 搜索配置项                  | SearchColumnProps[]                                |
| 2    | filterSearchFields        | 搜索项请求参数过滤          | []                                                 |
| 3    | columns                   | 列配置项                    | []                                                 |
| 4    | requestApi                | 请求数据接口                | -                                                  |
| 5    | searchDataCallback        | 请求参数二次处理            | function(data)                                     |
| 6    | dataCallback              | 返回数据二次处理            | function(data)                                     |
| 7    | hideSearch                | 隐藏搜索                    | false                                              |
| 8    | pagination                | 显示分页                    | true                                               |
| 9    | initParam                 | 初始化请求参数              | {}                                                 |
| 10   | border                    | 显示表格边框                | false                                              |
| 11   | toolButton                | 显示功能按钮                | true                                               |
| 12   | selectId                  | 当表格数据多选时，指定的 id | id                                                 |
| 13   | searchCol                 | 表格搜索项配置              | () => ({ xs: 2, sm: 3, md: 4, lg: 5, xl: 6 })      |
| 14   | gridTemplateColumnsConfig | 自定义搜索列宽度配置        | () => ({ xs: '', sm: '', md: '', lg: '', xl: '' }) |

### ref 事件

| 序号 | 事件名           | 说明             | 回调参数   |
| ---- | ---------------- | ---------------- | ---------- |
| 1    | tableRef         | 表格 Ref         | -          |
| 2    | tableData        | 表格数据         | -          |
| 3    | searchParams     | 搜索参数         | -          |
| 4    | paginationParams | 分页参数         | -          |
| 5    | getTableList     | 触发获取表格数据 | function() |
| 6    | clearSelection   | 清除选中         | function() |
| 7    | getSelection     | 获取选中数据     | function() |

### slot

| 序号 | 名字        | 说明         |
| ---- | ----------- | ------------ |
| 1    | tableHeader | 表格头工具列 |
| 2    | operation   | 操作列       |

### 例子

```
<bz-table
  ref="bzTableRef"
  :initParam="initParam"
  :tabsColumns="tabsColumns"
  :tabsClick="handleTabsClick"
  :searchColumns="searchColumns"
  :columns="columns"
  :requestApi="getRoleList"
  :resetClick="handleResetClick"
  :dataCallback="dataCallback"
>
  <template #tableHeader>
    ...
  </template>
  <template #operation="scope">
    ...
  </template>
</bz-table>

<script lang="tsx" setup>
import { ColumnProps } from '@/interface/table'
import { getRoleList } from '@/api/auth/role'
import { getRoleSelect2 } from '@/api/auth/role'
import { majorList } from '@/constant/major'

const request = reactive({
  url: 'enterpriseInfo/enterpriseInfoSelect2',
  params: { limitCnt: 10, pageNum: 1, pageSize: 10 },
  methods: 'get',
  key: 'enterpriseName',
  requestKey: 'enterpriseName'
})

async function response(item) {
  if (item) {
    bzTableRef.value.searchParams.enterpriseId = item.item.id
  } else {
    bzTableRef.value.searchParams.enterpriseId = null
  }
}

const initParam = ref<any>({
  riskLevel: null
})

const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total
  }
}

const handleResetClick = () => {
  initParam.value.riskLevel = null
  bzTableRef.value.searchInitParams.riskLevel = null
}

const tabsColumns = [
  {
    label: '用户',
    prop: 'user'
  },
  {
    label: '角色',
    prop: 'role'
  }
]

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
    label: '所属集团',
    prop: 'enterpriseName',
    search: {
      el: 'dropdown',
      props: {
        request,
        placeholder: '请选择所属集团'
      },
      event: {
        response
      }
    }
  },
   {
    label: '风险等级',
    prop: 'riskLevel',
    enum: riskList,
    fieldNames: { label: 'label', value: 'value' },
    search: {
      el: 'el-select',
      key: 'riskLevel',
      defaultValue: initParam.value.riskLevel,
      props: {
        placeholder: '请选择',
        clearable: true
      },
      event: {
        clear: () => {
          initParam.value.riskLevel = null
        }
      }
    }
  },
  {
    label: '检查日期',
    prop: 'warningTime',
    search: {
      el: 'el-date-picker',
      props: {
        type: 'daterange',
        'value-format': 'YYYY-MM-DD',
        format: 'YYYY-MM-DD',
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间',
        clearable: true
      },
      event: {
        change: scope => {
          if (scope?.length) {
            bzTableRef.value.searchParams.beginDate = scope[0] + ' 00:00:00'
            bzTableRef.value.searchParams.endDate = scope[1] + ' 23:59:59'
          } else {
            bzTableRef.value.searchParams.beginDate = null
            bzTableRef.value.searchParams.endDate = null
          }
        }
      }
    }
  },
]

const columns: ColumnProps[] = [
  {
    type: 'selection'
  },
  {
    type: "selection",
    fixed: "left",
    width: 80
  },
  {
    label: '角色名称',
    prop: 'roleName'
  },
  {
    label: '角色',
    prop: 'roleName',
    filterEnum: true,
    fieldRowNames: { name: 'roleName', value: 'id', rowKey: 'roleId' }
  },
  {
    label: '专业',
    prop: 'professional',
    enum: majorList,
    filterEnum: true,
    fieldNames: { label: 'label', value: 'value' },
    fieldRowNames: { name: 'label', value: 'value', rowKey: 'professional' }
  },
  {
    label: '操作',
    prop: 'operation',
    fixed: 'right'
  }
]
</script>
```

### 自定义复选框

```
<el-table :data="tableData" style="width: 100%" ref="tableRef" @select-all="selectAll">
  <el-table-column size="small" type="selection" align="center">
    <template #default="scope">
      <el-checkbox v-model="scope.row.checked" @change="select" />
    </template>
  </el-table-column>
  <el-table-column prop="date" label="Date" width="180" />
  <el-table-column prop="name" label="Name" width="180" />
  <el-table-column prop="address" label="Address" />
</el-table>

const tableRef = ref()
const tableData = ref([
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    checked: true
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    checked: true
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    checked: true
  }
])

const selectAll = row => {
  tableData.value.forEach(item => {
    item.checked = !!row[0]
  })
}
const select = () => {
  tableData.value.forEach(item => {
    tableRef.value.toggleRowSelection(item, item.checked)
  })
}

const onLoad = () => {
  const allCheck = tableData.value.every(item => item.checked)
  if (allCheck) tableRef.value.toggleAllSelection()
}
onLoad()
```

### 循环表单校验

```
<el-form ref="formRef" class="form-content" :inline="true" :rules="rules" :model="form">
  <template v-for="(item, idx) in form.mineBoundaryList" :key="idx">
    <el-form-item
      label="经度:"
      :prop="['mineBoundaryList', idx, 'longitude']"
      :rules="rules.longitude"
    >
      <el-input v-model="item.longitude" class="ipt-box" maxlength="15" />
    </el-form-item>
    <el-form-item
      label="纬度:"
      :prop="['mineBoundaryList', idx, 'latitude']"
      :rules="rules.latitude"
    >
      <el-input v-model="item.latitude" class="ipt-box" maxlength="15" />
    </el-form-item>
  </template>
</el-form>

import { ref, reactive, onMounted, toRefs } from 'vue'
const formRef = ref()

const checkPositionCode = /^\d{1,3}(?:\.\d{1,7})?$/ // 三位整数7位小数
const validatePosition = (rule: any, value: string, callback: any) => {
  if (!checkPositionCode.test(value)) {
    callback(new Error(`请输入正确的纬度`))
  } else if (!value) {
    callback(new Error(`请输入纬度`))
  } else {
    callback()
  }
}

const state = reactive({
  form: {
    mineBoundaryList: [],
  }
})

const rules = ref({
  longitude: [{ required: true, message: '请输入经度', trigger: 'blur' }],
  latitude: [{ required: true, validator: validatePosition, trigger: 'blur' }]
})

const { form } = toRefs(state)
```
