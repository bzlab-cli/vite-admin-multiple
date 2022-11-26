<template>
  <search-form
    :handle-search="handleSearch"
    :handle-reset="handleReset"
    :searchParams="searchParams"
    :columns="flatSearchColumns"
    :colConfig="searchCol"
    v-show="!hideSearch"
  />
  <div class="bz-table">
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
      </div>
    </div>
    <el-table
      ref="tableRef"
      v-bind="$attrs"
      :data="tableData"
      :border="border"
      :row-key="getRowKeys"
      @selection-change="selectionChange"
    >
      <slot />
      <template v-for="item in tableColumns" :key="item">
        <el-table-column
          v-bind="item"
          :align="item.align ?? 'center'"
          :reserve-selection="item.type == 'selection'"
          v-if="item.type == 'selection' || item.type == 'index'"
        />
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
      :pageTable="pageTable"
      :handleSizeChange="handleSizeChange"
      :handleCurrentChange="handleCurrentChange"
    />
  </div>
  <column-setting v-if="toolButton" ref="colRef" v-model:colSetting="colSetting" />
</template>

<script lang="ts" setup>
import { ref, watch, provide } from 'vue'
import { useTable } from '@/hooks/table/use-table'
import { useSelection } from '@/hooks/table/use-selection'
import { ColumnProps, SearchColumnProps } from '@/interface/table'
import { ElTable, TableProps } from 'element-plus'
import searchForm from '@/components/search-form/index.vue'
import bzPagination from './components/pagination.vue'
import columnSetting from './components/column-setting.vue'
import tableColumn from './components/table-column.vue'
import type { BreakPoint } from '@/interface/grid'

const tableRef = ref<InstanceType<typeof ElTable>>()

interface ProTableProps extends Partial<Omit<TableProps<any>, 'data'>> {
  searchColumns: SearchColumnProps[]
  columns: ColumnProps[] // 列配置项
  requestApi: (params: any) => Promise<any> // 请求数据接口
  dataCallback?: (data: any) => any // 返回数据二次处理
  hideSearch: boolean
  pagination?: boolean // 是否需要分页组件
  initParam?: any // 初始化请求参数
  border?: boolean // 是否带有纵向边框
  toolButton?: boolean // 是否显示功能按钮
  selectId?: string // 当表格数据多选时，指定的id
  searchCol?: number | Record<BreakPoint, number> // 表格搜索项配置
}

// 默认配置
const props = withDefaults(defineProps<ProTableProps>(), {
  searchColumns: () => [],
  columns: () => [],
  pagination: true,
  hideSearch: false,
  initParam: {},
  border: false,
  toolButton: true,
  selectId: 'id',
  searchCol: () => ({ xs: 2, sm: 3, md: 4, lg: 5, xl: 6 })
})

// 表格多选
const { selectionChange, getRowKeys, selectedList, selectedListIds, isSelected } = useSelection(props.selectId)

// 表格操作
const {
  tableData,
  pageTable,
  searchParams,
  searchInitParams,
  getTableList,
  handleSearch,
  handleReset,
  handleSizeChange,
  handleCurrentChange
} = useTable(props.requestApi, props.initParam, props.pagination, props.dataCallback)

// 清空选中数据
const clearSelection = () => tableRef.value!.clearSelection()

watch(
  () => props.initParam,
  () => {
    getTableList()
  },
  { deep: true }
)

const tableColumns = ref<ColumnProps[]>(props.columns)

const enumMap = ref(new Map<string, { [key: string]: any }[]>())
provide('enumMap', enumMap)

const flatTableColumnsFunc = (columns: ColumnProps[], flatArr: ColumnProps[] = []) => {
  columns.forEach(async col => {
    if (col._children?.length) flatArr.push(...flatTableColumnsFunc(col._children))
    flatArr.push(col)
    col.isShow = col.isShow ?? true
  })
  return flatArr.filter(item => !item._children?.length)
}

flatTableColumnsFunc(tableColumns.value as ColumnProps[])

const flatSearchColumnsFunc = (columns: SearchColumnProps[]) => {
  columns.forEach(async col => {
    if (!col.enum) return
    if (typeof col.enum !== 'function') return enumMap.value.set(col.prop!, col.enum)
    const { data } = await col.enum()
    enumMap.value.set(col.prop!, data)
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

defineExpose({ element: tableRef, tableData, searchParams, pageTable, getTableList, clearSelection })
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
