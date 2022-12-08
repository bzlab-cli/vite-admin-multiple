# bz-tree-filter

目录筛选组件

### 参数及事件列表

```
:requestApi="requestApi"
:data="data"
:dataCallback="dataCallback"
:expandAll="expandAll"
:initParam="initParam"
:hideTitle="hideTitle"
:hideSearch="hideSearch"
:hideParentLabel="hideParentLabel"
:initFetch="initFetch"
:title="title"
:id="id"
:label="label"
:children="children"
:parentLabel="parentLabel"
:checkbox="checkbox"
:selectId="selectId"
:selectIds="selectIds"
@change="change" // 目录点击回调
@success="success" // 接口成功回调
```

## 文档

### props 配置项

```
interface TreeFilterProps {
  requestApi?: (data?: any) => Promise<any> // 请求接口数据
  data?: { [key: string]: any }[] // 外部传入数据，不通过接口
  dataCallback?: any // 返回数据二次处理
  expandAll?: boolean // 展开所有
  initParam?: any // 初始化请求参数
  hideTitle?: boolean // 隐藏标题
  hideSearch?: boolean // 隐藏搜索框
  hideParentLabel?: boolean // 隐藏顶层标签
  initFetch?: boolean // 初始化请求数据
  title?: string // 标题
  id?: string // 显示的id，默认为id
  label?: string // 显示的label，默认为label
  children?: string // 子级属性，默认为children
  parentLabel?: string // 顶层目录数据，默认为全部
  checkbox?: boolean // 是否为多选，默认为false
  selectId?: undefined | string // 默认选中单行值
  selectIds?: string[] // 默认选中复选框值
}
```

| 序号 | 参数 | 说明 | 默认值 |
| ---- | ---- | ---- | ---- |
| 1 | requestApi | 请求数据接口 | Promise |
| 2 | data | 外部传入数据，不通过接口 | [] |
| 3 | dataCallback | 返回数据二次处理 | function(data) |
| 4 | expandAll | 展开所有 | true |
| 5 | initParam | 初始化请求参数 | {} |
| 6 | hideTitle | 隐藏标题 | false |
| 7 | hideSearch | 隐藏搜索框 | false |
| 8 | hideParentLabel | 隐藏顶层标签 | false |
| 9 | initFetch | 初始化请求数据 | true |
| 10 | title | 标题 | '' |
| 11 | id | 显示的id | 'id' |
| 12 | label | 显示的label | label |
| 13 | children | 子级属性 | children |
| 14 | parentLabel | 顶层目录数据 | 全部 |
| 15 | checkbox | 是否为多选 | false |
| 16 | selectId | 默认选中单行值 | '' |
| 17 | selectIds | 默认选中复选框值 | [] |

### ref 事件
| 序号 | 事件名 | 说明 | 回调参数 |
| ---- | ---- | ---- | ---- |
| 1 | treeRef | 目录Ref | - |
| 2 | treeData | 目录数据 | - |
| 3 | getTreeList | 触发获取目录数据 | function() |
| 4 | getSelection | 获取选中集合 | [] |
| 5 | getSelectionKeys | 获取选中键值集合 | [] |
| 6 | clearSelection | 清除选中 | function() |

### 例子

```
<div class="main-box">
  <bz-tree-filter
    ref="bzTreeFilterRef"
    title="文件目录"
    label="folderName"
    children="childs"
    id="fileId"
    parentLabel="文件目录"
    :requestApi="getTreeList"
    :initParam="initTreeParam"
    :selectId="selectId"
    :dataCallback="treeDataCallback"
    @change="changeTreeFilter"
    @success="treeFilterSuccess"
  /></bz-tree-filter>
  <div class="table-box">....</div>
</div>

<script lang="tsx" setup>
import { ref, reactive } from 'vue'

const selectId = ref('')
const selectIds = ref([])
const initTreeParam = reactive({
  parentFileId: 0
})

const treeDataCallback = data => {
  return data
}

const changeTreeFilter = (val, selection) => {
  bzTableRef.value.searchParams.pageNum = 1
  initParam.parentFileId = val.fileId
  bzTableRef.value.getTableList()
}

const treeFilterSuccess = val => {
  bzTableRef.value.searchParams.pageNum = 1
  initParam.parentFileId = val[0].fileId
  bzTableRef.value.getTableList()
}
</script>
```
