import { Table } from '@/interface/table'
import { reactive, onMounted, toRefs, computed } from 'vue'
import { paginationParams } from '@/constant/layout'

export const useTable = (
  api: (params: any) => Promise<any>,
  initParam: object = {},
  filterSearchFields: string[] = [],
  pagination,
  dataCallBack?: (data: any) => any
) => {
  const state = reactive<Table.TableStateProps>({
    tableData: [],
    paginationParams,
    searchParams: {},
    searchInitParams: {},
    totalParam: {}
  })

  onMounted(() => {
    handleReset()
  })

  const pageParams = computed(() => {
    return {
      pageNum: state.paginationParams.pageNum,
      pageSize: state.paginationParams.pageSize
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
      state.paginationParams.total = data.total || 0
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
    state.paginationParams.pageNum = 1
    updatedTotalParam()
    getTableList()
  }

  // 表格数据重置
  const handleReset = () => {
    state.paginationParams.pageNum = 1
    state.searchParams = {}
    Object.keys(state.searchInitParams).forEach(key => {
      state.searchParams[key] = state.searchInitParams[key]
    })
    updatedTotalParam()
    getTableList()
  }

  const handleSizeChange = (val: number) => {
    state.paginationParams.pageNum = 1
    state.paginationParams.pageSize = val
    getTableList()
  }

  const handleCurrentChange = (val: number) => {
    state.paginationParams.pageNum = val
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
