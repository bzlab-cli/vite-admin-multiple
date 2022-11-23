<template>
  <search-form
    :search="search"
    :reset="reset"
    :searchParam="searchParam"
    :columns="searchColumns"
    :colConfig="searchCol"
    v-show="isShowSearch"
  />

  <!-- 表格内容 card -->
  <div class="card table">
    <!-- 表格头部 操作按钮 -->
    <div class="table-header">
      <div class="header-button-lf">
        <slot
          name="tableHeader"
          :selectedListIds="selectedListIds"
          :selectList="selectedList"
          :isSelected="isSelected"
        />
      </div>
      <div class="header-button-ri" v-if="toolButton">
        <el-button icon="Refresh" circle @click="getTableList" />
        <el-button icon="Operation" circle v-if="columns.length" @click="openColSetting" />
        <el-button icon="Search" circle v-if="searchColumns.length" @click="isShowSearch = !isShowSearch" />
      </div>
    </div>
    <!-- 表格主体 -->
    <el-table
      ref="tableRef"
      v-bind="$attrs"
      :data="tableData"
      :border="border"
      :row-key="getRowKeys"
      @selection-change="selectionChange"
    >
      <!-- 默认插槽 -->
      <slot />
      <template v-for="item in tableColumns" :key="item">
        <!-- selection || index -->
        <el-table-column
          v-bind="item"
          :align="item.align ?? 'center'"
          :reserve-selection="item.type == 'selection'"
          v-if="item.type == 'selection' || item.type == 'index'"
        />
        <!-- expand 支持 tsx 语法 && 作用域插槽 (tsx > slot) -->
        <el-table-column v-bind="item" :align="item.align ?? 'center'" v-if="item.type == 'expand'" v-slot="scope">
          <component :is="item.render" :row="scope.row" v-if="item.render" />
          <slot :name="item.type" :row="scope.row" v-else />
        </el-table-column>
        <!-- other 循环递归 -->
        <table-column v-if="!item.type && item.prop && item.isShow" :column="item">
          <template v-for="slot in Object.keys($slots)" #[slot]="scope">
            <slot :name="slot" :row="scope.row" />
          </template>
        </table-column>
      </template>
      <!-- 无数据 -->
      <template #empty>
        <div class="table-empty">
          <img src="@/assets/images/notData.png" alt="notData" />
          <div>暂无数据</div>
        </div>
      </template>
    </el-table>
    <!-- 分页组件 -->
    <pagination
      v-if="pagination"
      :pageTable="pageTable"
      :handleSizeChange="handleSizeChange"
      :handleCurrentChange="handleCurrentChange"
    />
  </div>
  <!-- 列设置 -->
  <col-setting v-if="toolButton" ref="colRef" v-model:colSetting="colSetting" />
</template>

<script setup lang="ts">
import { ref, watch, provide } from 'vue'
import { useTable } from '@/hooks/useTable'
import { useSelection } from '@/hooks/useSelection'
import { BreakPoint } from '@/components/Grid/interface'
import { ColumnProps } from '@/components/ProTable/interface'
import { ElTable, TableProps } from 'element-plus'
import searchForm from '@/components/search-form/index.vue'
import pagination from './components/pagination.vue'
import ColSetting from './components/col-setting.vue'
import tableColumn from './components/table-column.vue'

const tableRef = ref<InstanceType<typeof ElTable>>()

const isShowSearch = ref<boolean>(true)

interface ProTableProps extends Partial<Omit<TableProps<any>, 'data'>> {
  columns: ColumnProps[] // 列配置项
  requestApi: (params: any) => Promise<any> // 请求表格数据的api ==> 必传
  dataCallback?: (data: any) => any // 返回数据的回调函数，可以对数据进行处理 ==> 非必传
  title?: string // 表格标题，目前只在打印的时候用到 ==> 非必传
  pagination?: boolean // 是否需要分页组件 ==> 非必传（默认为true）
  initParam?: any // 初始化请求参数 ==> 非必传（默认为{}，必须是 reactive 包裹的）
  border?: boolean // 是否带有纵向边框 ==> 非必传（默认为true）
  toolButton?: boolean // 是否显示表格功能按钮 ==> 非必传（默认为true）
  selectId?: string // 当表格数据多选时，所指定的 id ==> 非必传（默认为 id）
  searchCol?: number | Record<BreakPoint, number> // 表格搜索项 每列占比配置 ==> 非必传 { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }
}

// 接受父组件参数，配置默认值
const props = withDefaults(defineProps<ProTableProps>(), {
  columns: () => [],
  pagination: true,
  initParam: {},
  border: true,
  toolButton: true,
  selectId: 'id',
  searchCol: () => ({ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 })
})

// 表格多选 Hooks
const { selectionChange, getRowKeys, selectedList, selectedListIds, isSelected } = useSelection(props.selectId)

// 表格操作 Hooks
const {
  tableData,
  pageTable,
  searchParam,
  searchInitParam,
  getTableList,
  search,
  reset,
  handleSizeChange,
  handleCurrentChange
} = useTable(props.requestApi, props.initParam, props.pagination, props.dataCallback)

// 清空选中数据列表
const clearSelection = () => tableRef.value!.clearSelection()

// 监听页面 initParam 改化，重新获取表格数据
watch(
  () => props.initParam,
  () => {
    getTableList()
  },
  { deep: true }
)

// 接收 columns 并设置为响应式
const tableColumns = ref<ColumnProps[]>(props.columns)

// 定义 enumMap 存储 enum 值（避免异步请求无法格式化单元格内容 || 无法填充搜索下拉选择）
const enumMap = ref(new Map<string, { [key: string]: any }[]>())
provide('enumMap', enumMap)

// 扁平化 columns && 处理 tableColumns 数据
const flatColumnsFunc = (columns: ColumnProps[], flatArr: ColumnProps[] = []) => {
  columns.forEach(async col => {
    if (col._children?.length) flatArr.push(...flatColumnsFunc(col._children))
    flatArr.push(col)

    // 给每一项 column 添加 isShow && isFilterEnum 属性
    col.isShow = col.isShow ?? true
    col.isFilterEnum = col.isFilterEnum ?? true

    if (!col.enum) return
    // 如果当前 enum 为后台数据需要请求数据，则调用该请求接口，并存储到 enumMap
    if (typeof col.enum !== 'function') return enumMap.value.set(col.prop!, col.enum)
    const { data } = await col.enum()
    enumMap.value.set(col.prop!, data)
  })
  return flatArr.filter(item => !item._children?.length)
}

// 扁平 columns
const flatColumns = ref<ColumnProps[]>()
flatColumns.value = flatColumnsFunc(tableColumns.value)

// 过滤需要搜索的配置项 && 处理搜索排序
const searchColumns = flatColumns.value
  .filter(item => item.search?.el)
  .sort((a, b) => (b.search?.order ?? 0) - (a.search?.order ?? 0))

// 设置搜索表单的默认值
searchColumns.forEach(column => {
  if (column.search?.defaultValue !== undefined && column.search?.defaultValue !== null) {
    searchInitParam.value[column.search.key ?? column.prop!] = column.search?.defaultValue
  }
})

// 列设置
const colRef = ref()
// 过滤掉不需要设置显隐的列（页面直接隐藏的列不需要列设置）
//@ts-ignore
const colSetting = tableColumns.value!.filter((item: ColumnProps) => {
  return (
    item.isShow &&
    item.type !== 'selection' &&
    item.type !== 'index' &&
    item.type !== 'expand' &&
    item.prop !== 'operation'
  )
})
const openColSetting = () => {
  colRef.value.openColSetting()
}

defineExpose({ element: tableRef, tableData, searchParam, pageTable, getTableList, clearSelection })
</script>
