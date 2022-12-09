<template>
  <bz-tabs ref="tabsRef" :tabsProps="tabsProps" :columns="tabsColumns" :handle-click="tabsClick" v-if="!hideTabs" />
  <search-form
    ref="searchFormRef"
    :handle-search="handleSearch"
    :handle-reset="handleReset"
    :searchParams="searchParams"
    :columns="flatSearchColumns"
    :colConfig="searchCol"
    v-show="!hideSearch"
  />
  <slot name="extra" />
  <div class="bz-table">
    <div class="table-header" v-if="!hideTableHeader">
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
      </div>
    </div>
    <bz-card
      ref="cardRef"
      :data="tableData"
      :cardGutter="cardGutter"
      :cardSpan="cardSpan"
      :cardShadow="cardShadow"
      :cardClick="cardClick"
      v-if="!hideCard"
    >
      <template #card="scope">
        <slot name="card" :item="scope.item" :index="scope.index" />
      </template>
    </bz-card>
    <el-table
      v-if="!hideTable"
      ref="tableRef"
      v-bind="$attrs"
      :data="tableData"
      :border="border"
      :row-key="getRowKeys"
      v-loading="loading"
      @selection-change="selectionChange"
    >
      <slot />
      <template v-for="item in tableColumns" :key="item">
        <el-table-column
          v-bind="item"
          :align="item.align ?? 'center'"
          :reserve-selection="item.type == 'selection'"
          v-if="item.type == 'selection'"
        />
        <el-table-column v-bind="item" :align="item.align ?? 'center'" v-if="item.type == 'index'">
          <template #default="scope">
            {{ sortNumber(scope) }}
          </template>
        </el-table-column>
        <el-table-column v-bind="item" :align="item.align ?? 'center'" v-if="item.type == 'expand'" v-slot="scope">
          <component :is="item.render" :row="scope.row" v-if="item.render" />
          <slot :name="item.type" :row="scope.row" v-else />
        </el-table-column>
        <table-column v-if="!item.type && item.prop && item.isShow" :column="item">
          <template v-for="slot in Object.keys($slots)" #[slot]="scope">
            <slot :name="slot" :row="scope.row" />
          </template>
        </table-column>
      </template>
      <template #empty>
        <el-empty :image-size="100" description="暂无数据" />
      </template>
    </el-table>
    <bz-pagination
      class="pagination"
      v-if="pagination"
      :paginationParams="paginationParams"
      :handleSizeChange="handleSizeChange"
      :handleCurrentChange="handleCurrentChange"
    />
  </div>
  <column-setting v-if="toolButton" ref="colRef" v-model:colSetting="colSetting" />
</template>

<script lang="ts" setup>
import { ref, provide } from 'vue'
import { useTable } from '@/hooks/table/use-table'
import { useSelection } from '@/hooks/table/use-selection'
import { ColumnProps, SearchColumnProps, TabsProps, TabsColumnsProps } from '@/interface/table'
import { ElTable, TableProps } from 'element-plus'
import bzTabs from '@/components/bz-tabs/index.vue'
import bzCard from '@/components/bz-card/index.vue'
import searchForm from '@/components/search-form/index.vue'
import bzPagination from './components/pagination.vue'
import columnSetting from './components/column-setting.vue'
import tableColumn from './components/table-column.vue'
import type { BreakPoint } from '@/interface/grid'

const tabsRef = ref()
const searchFormRef = ref()
const tableRef = ref<InstanceType<typeof ElTable>>()

interface ProTableProps extends Partial<Omit<TableProps<any>, 'data'>> {
  tabsProps: TabsProps
  tabsColumns: TabsColumnsProps[]
  tabsClick?: (data: any) => any
  cardGutter?: number
  cardSpan?: number
  cardShadow?: string
  cardClick?: (data?: any, index?: number) => any
  searchColumns: SearchColumnProps[]
  filterSearchFields: string[]
  columns: ColumnProps[] // 列配置项
  requestApi: (params: any) => Promise<any> // 请求数据接口
  searchDataCallback?: (data: any) => any // 请求参数二次处理
  dataCallback?: (data: any) => any // 返回数据二次处理
  hideTabs?: boolean // 隐藏tabs
  hideSearch?: boolean // 隐藏搜索
  hideTableHeader?: boolean // 隐藏表格顶部操作
  hideTable?: boolean // 隐藏表格
  hideCard?: boolean // 隐藏卡片布局
  pagination?: boolean // 是否需要分页组件
  initParam?: any // 初始化请求参数
  initFetch?: boolean // 是否初始化请求数据
  border?: boolean // 显示表格边框
  loading?: boolean // 表格加载
  toolButton?: boolean // 显示功能按钮
  selectId?: string // 当表格数据多选时，指定的id
  searchCol?: number | Record<BreakPoint, number> // 表格搜索项配置
}

// 默认配置
const props = withDefaults(defineProps<ProTableProps>(), {
  tabsColumns: () => [],
  tabsClick: () => {},
  cardGutter: 12,
  cardSpan: 6,
  cardShadow: 'hover',
  cardClick: () => {},
  searchColumns: () => [],
  filterSearchFields: () => [],
  columns: () => [],
  hideTabs: true,
  hideSearch: false,
  hideTableHeader: false,
  hideTable: false,
  hideCard: true,
  pagination: true,
  initParam: {},
  initFetch: true,
  border: false,
  loading: true,
  toolButton: true,
  selectId: 'id',
  searchCol: () => ({ xs: 2, sm: 3, md: 4, lg: 5, xl: 6 })
})

const loading = ref<boolean>(props.loading)

// 表格多选
const { selectionChange, getRowKeys, selectedList, selectedListIds, isSelected } = useSelection(props.selectId)

// 表格操作
const {
  tableData,
  paginationParams,
  searchParams,
  searchInitParams,
  sortNumber,
  getTableList,
  handleSearch,
  handleReset,
  handleSizeChange,
  handleCurrentChange
} = useTable(
  props.requestApi,
  props.loading,
  loading,
  props.initParam,
  props.initFetch,
  props.filterSearchFields,
  props.pagination,
  props.searchDataCallback,
  props.dataCallback
)

// 清空选中数据
const clearSelection = () => tableRef.value!.clearSelection()

// watch(
//   () => props.initParam,
//   () => {
//     getTableList()
//   },
//   { deep: true }
// )

const tableColumns = ref<ColumnProps[]>(props.columns)

const searchEnumMap = ref(new Map<string, { [key: string]: any }[]>())
const enumMap = ref(new Map<string, { [key: string]: any }[]>())

provide('searchEnumMap', searchEnumMap)
provide('enumMap', enumMap)

const flatTableColumnsFunc = (columns: ColumnProps[], flatArr: ColumnProps[] = []) => {
  columns.forEach(async col => {
    if (col.children?.length) flatArr.push(...flatTableColumnsFunc(col.children))
    flatArr.push(col)
    col.isShow = col.isShow ?? true
    if (!col.enum) return
    if (typeof col.enum !== 'function') return enumMap.value.set(col.prop!, col.enum)
    const { data } = await col.enum()
    enumMap.value.set(col.prop!, data)
  })
  return flatArr.filter(item => !item.children?.length)
}

flatTableColumnsFunc(tableColumns.value as ColumnProps[])

const flatSearchColumnsFunc = (columns: SearchColumnProps[]) => {
  columns.forEach(async col => {
    if (!col.enum) return
    if (typeof col.enum !== 'function') return searchEnumMap.value.set(col.prop!, col.enum)

    const dataField = col.enumOptions?.data ?? 'data'
    const params = col.enumOptions?.params ?? undefined
    const colEnum = await col.enum(params)
    let enumData = colEnum
    const paths = dataField.split('.') as any[]
    while (paths.length > 0) {
      enumData = enumData[paths.shift()]
    }
    searchEnumMap.value.set(col.prop!, enumData)
  })
  return columns
}

const flatSearchColumns = ref<SearchColumnProps[]>()
flatSearchColumns.value = flatSearchColumnsFunc(props.searchColumns as SearchColumnProps[])

// 设置搜索默认值，指定搜索key
flatSearchColumns.value.forEach(column => {
  if (column.search?.defaultValue !== undefined && column.search?.defaultValue !== null) {
    searchInitParams.value[column.search.key ?? column.prop!] = column.search?.defaultValue
  }
})

const colRef = ref()
// 过滤隐藏列
const colSetting = tableColumns.value!.filter((item: any) => {
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

defineExpose({
  tabsRef,
  searchFormRef,
  tableRef,
  tableData,
  searchParams,
  paginationParams,
  handleReset,
  getTableList,
  clearSelection
})
</script>

<style lang="scss" scoped>
.bz-table {
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 15px;
  overflow-x: hidden;
  background-color: var(--el-fill-color-blank);
  border-radius: 4px;
  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  .pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
  }
}
</style>
