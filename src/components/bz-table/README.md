# bz-table

表格组件

### 参数及事件列表

```
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
```

## 文档

### props 配置项
| 序号 | 参数 | 说明 | 默认值 |
| ---- | ---- | ---- | ---- |
| 1 | searchColumns | 搜索配置项 | [] |
| 2 | filterSearchFields | 搜索项请求参数过滤 | [] |
| 3 | columns | 列配置项 | [] |
| 4 | requestApi | 请求数据接口 | - |
| 5 | dataCallback | 返回数据二次处理 | function(data) |
| 6 | hideSearch | 隐藏搜索 | false |
| 7 | pagination | 显示分页 | true |
| 8 | initParam | 初始化请求参数 | {} |
| 9 | border | 显示表格边框 | false |
| 10 | toolButton | 显示功能按钮 | true |
| 11 | selectId | 当表格数据多选时，指定的id | id |
| 12 | searchCol | 表格搜索项配置 | () => ({ xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }) |

### ref 事件
| 序号 | 事件名 | 说明 | 回调参数 |
| ---- | ---- | ---- | ---- |
| 1 | tableRef | 表格Ref | - |
| 2 | tableData | 表格数据 | - |
| 3 | searchParams | 搜索参数 | - |
| 4 | paginationParams | 分页参数 | - |
| 5 | getTableList | 触发获取表格数据 | function() |
| 6 | clearSelection | 清除选中 | function() |

### slot
| 序号 | 名字 | 说明 |
| ---- | ---- | ---- |
| 1 | tableHeader | 表格头工具列 |
| 2 | operation | 操作列 |

### 例子

```
<bz-table
  ref="bzTableRef"
  :searchColumns="searchColumns"
  :columns="columns"
  :requestApi="getRoleList"
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
import bzTable from '@/components/bz-table/index.vue'
import { getRoleList } from '@/api/auth/role'
import { getRoleSelect2 } from '@/api/auth/role'
import { majorList } from '@/constant/major'

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
]

const columns: ColumnProps[] = [
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
    fieldNames: { label: 'name', value: 'value' },
    fieldRowNames: { name: 'name', value: 'value', rowKey: 'professional' }
  },
  {
    label: '操作',
    prop: 'operation',
    fixed: 'right'
  }
]
</script>
```
