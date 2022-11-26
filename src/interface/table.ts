import { InputProps, ElSelect, SwitchProps, TimePickerDefaultProps } from 'element-plus'
import { TimeSelectProps } from 'element-plus/es/components/time-select/src/time-select'

export type BreakPoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type Responsive = {
  span?: number
  offset?: number
}

export interface EnumProps {
  label: string // 选项框显示的文字
  value: any // 选项框值
  disabled?: boolean // 是否禁用此选项
  children?: EnumProps[] // 树形选择
  [key: string]: any
}

export type TypeProp = 'index' | 'selection' | 'expand'

interface Input {
  el: 'el-input'
  props?: Partial<InputProps>
}
interface Select {
  el: 'el-select'
  props?: Partial<typeof ElSelect.__defaults>
}

interface TreeSelect {
  el: 'el-tree-select'
  props?: any
}

interface DatePicker {
  el: 'el-date-picker'
  props?: any
}

interface TimePicker {
  el: 'el-time-picker'
  props?: Partial<TimePickerDefaultProps>
}

interface TimeSelect {
  el: 'el-time-select'
  props?: Partial<TimeSelectProps>
}

interface Switch {
  el: 'el-switch'
  props?: Partial<SwitchProps>
}

export type BaseSearch = {
  key?: string // 指定搜索key
  span?: number // 搜索项占用列数，默认为1
  offset?: number // 搜索字段左偏移列数
  xs: number
  sm: number
  md: number
  lg: number
  xl: number
  defaultValue?: string | number | boolean | any[] // 搜索默认值
}

export type SearchProps = BaseSearch & (Input | Select | DatePicker | TimePicker | TimeSelect | Switch | TreeSelect)

export interface ColumnProps<T = any> {
  isShow?: boolean // 是否显示在表格当中
  enum?: EnumProps[] | ((params?: any) => Promise<any>) // 渲染值的字典
  fieldNames?: { label: string; value: string } // 指定label，value的key值
  headerRender?: (row: ColumnProps) => any // 自定义表头渲染
  render?: (scope: { row: T }) => any // 自定义单元格渲染
  _children?: ColumnProps<T>[] // 多级表头
}

export interface SearchColumnProps {
  render?: (scope?) => any
  label?: boolean // 标签名称
  labelWidth?: boolean // 标签宽度
  prop?: string // 属性名
  enum?: any
  fieldNames?: { label: string; value: string }
  search?: SearchProps | undefined // 搜索项配置
}

export namespace Table {
  export interface PageTable {
    pageNum: number
    pageSize: number
    total: number
    pageSizes?: number[]
    background?: boolean
    layout?: string
  }
  export interface TableStateProps {
    tableData: any[]
    pageTable: PageTable
    searchParams: {
      [key: string]: any
    }
    searchInitParams: {
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
