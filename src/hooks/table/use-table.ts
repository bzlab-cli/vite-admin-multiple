import { Table } from '@/interface/table'
import { reactive, onMounted, toRefs, computed } from 'vue'

export const useTable = (
  api: (params: any) => Promise<any>,
  initParam: object = {},
  filterSearchFields: string[] = [],
  pagination,
  dataCallBack?: (data: any) => any
) => {
  const state = reactive<Table.TableStateProps>({
    tableData: [],
    pageTable: {
      pageNum: 1,
      pageSize: 10,
      total: 0,
      pageSizes: [10, 25, 50, 100],
      background: true,
      layout: 'total, prev, pager, next, jumper'
    },
    searchParams: {},
    searchInitParams: {},
    totalParam: {}
  })

  onMounted(() => {
    handleReset()
  })

  const pageParams = computed(() => {
    return {
      pageNum: state.pageTable.pageNum,
      pageSize: state.pageTable.pageSize
    }
  })

  // 获取表格数据
  const getTableList = async () => {
    try {
      Object.assign(state.totalParam, initParam, pagination ? pageParams.value : {})
      Object.keys(state.totalParam).forEach(key => {
        if (filterSearchFields.includes(key)) delete state.totalParam[key]
      })
      let { data } = await api(state.totalParam)
      dataCallBack && (data = dataCallBack(data))
      state.tableData = data.list || []
      state.pageTable.total = data.total || 0
    } catch (error) {
      console.log(error)
    }
  }

  // 更新查询参数
  const updatedTotalParam = () => {
    state.totalParam = {}
    const nowSearchParams: { [key: string]: any } = {}
    for (const key in state.searchParams) {
      if (state.searchParams[key] || state.searchParams[key] === false || state.searchParams[key] === 0) {
        nowSearchParams[key] = state.searchParams[key]
      }
    }
    Object.assign(state.totalParam, nowSearchParams, pagination ? pageParams.value : {})
  }

  // 查询
  const handleSearch = () => {
    state.pageTable.pageNum = 1
    updatedTotalParam()
    getTableList()
  }

  // 表格数据重置
  const handleReset = () => {
    state.pageTable.pageNum = 1
    state.searchParams = {}
    Object.keys(state.searchInitParams).forEach(key => {
      state.searchParams[key] = state.searchInitParams[key]
    })
    updatedTotalParam()
    getTableList()
  }

  const handleSizeChange = (val: number) => {
    state.pageTable.pageNum = 1
    state.pageTable.pageSize = val
    getTableList()
  }

  const handleCurrentChange = (val: number) => {
    state.pageTable.pageNum = val
    getTableList()
  }

  return {
    ...toRefs(state),
    getTableList,
    handleSearch,
    handleReset,
    handleSizeChange,
    handleCurrentChange
  }
}
