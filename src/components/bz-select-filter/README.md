# bz-select-filter

分类筛选组件

### 参数及事件列表

```
:data="data"
:initParam="initParam"
@change="change" // 点击回调
```

## 文档

### props 配置项

```
interface optionsProps {
  value: string
  label: string
  icon?: string
}

interface DataProps {
  title: string // 标题
  key: string // 筛选项key值
  multiple?: boolean // 是否多选
  options: optionsProps[] // 筛选数据
}

interface FilterProps {
  data?: DataProps[] // 传入数据
  initParam?: any // 初始化默认参数
}
```

| 序号 | 参数 | 说明 | 默认值 |
| ---- | ---- | ---- | ---- |
| 1 | data | 传入数据 | [] |
| 2 | initParam | 初始化默认参数 | {} |

### 例子

```
<div class="select-filter-box">
  <bz-select-filter 
    :data="selectFilterData" 
    :initParam="selectFilterValues" 
    @change="changeSelectFilter"
  ></bz-select-filter>
</div>

<script lang="tsx" setup>
import { ref, reactive } from 'vue'

const selectFilterData = [
  {
    title: '用户状态',
    key: 'status',
    options: [
      {
        label: '全部',
        value: ''
      },
      {
        label: '测试',
        value: '1',
        icon: 'User'
      }
    ]
  },
  {
    title: '用户角色',
    key: 'role',
    multiple: true,
    options: [
      {
        label: '全部',
        value: ''
      },
      {
        label: '管理员',
        value: '1'
      }
    ]
  }
]

const selectFilterValues = ref({ status: '1', role: ['1'] })

const changeSelectFilter = (val: any) => {
  bzTableRef.value.searchParams.pageNum = 1
  selectFilterValues.value = { ...val, status: val.status.join('') }
  bzTableRef.value.getTableList()
}
</script>
```
