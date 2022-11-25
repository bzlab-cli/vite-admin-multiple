export namespace Table {
  export interface PageTable {
    pageNum: number
    pageSize: number
    total: number
  }
  export interface TableStateProps {
    tableData: any[]
    pageTable: PageTable
    searchParam: {
      [key: string]: any
    }
    searchInitParam: {
      [key: string]: any
    }
    totalParam: {
      [key: string]: any
    }
  }
}

export namespace HandleData {
  export type MessageType = '' | 'success' | 'warning' | 'info' | 'error'
}
