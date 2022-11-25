import { Table } from './interface'
import { reactive, onMounted, toRefs, computed } from 'vue'

export const useTable = (
  api: (params: any) => Promise<any>,
  initParam: object = {},
  pagination,
  dataCallBack?: (data: any) => any
) => {
  const state = reactive<Table.TableStateProps>({
    tableData: [],
    pageTable: {
      pageNum: 1,
      pageSize: 10,
      total: 0
    },
    searchParam: {},
    searchInitParam: {},
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
    const nowSearchParam: { [key: string]: any } = {}
    for (const key in state.searchParam) {
      if (state.searchParam[key] || state.searchParam[key] === false || state.searchParam[key] === 0) {
        nowSearchParam[key] = state.searchParam[key]
      }
    }
    Object.assign(state.totalParam, nowSearchParam, pagination ? pageParams.value : {})
  }

  // 表格数据查询
  const handleSearch = () => {
    state.pageTable.pageNum = 1
    updatedTotalParam()
    getTableList()
  }

  // 表格数据重置
  const handleReset = () => {
    state.pageTable.pageNum = 1
    state.searchParam = {}
    Object.keys(state.searchInitParam).forEach(key => {
      state.searchParam[key] = state.searchInitParam[key]
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
