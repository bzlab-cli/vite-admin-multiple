<template>
  <component
    v-if="column.search?.el"
    :is="column.search.el"
    v-bind="column.search.props"
    v-model="searchParams[column.search.key ?? column.prop!]"
    :data="column.search?.el === 'el-tree-select' ? columnEnum : []"
    :placeholder="placeholder(column)"
    :clearable="clearable(column)"
    range-separator="至"
    start-placeholder="开始时间"
    end-placeholder="结束时间"
  >
    <template v-if="column.search.el === 'el-select'">
      <component
        :is="`el-option`"
        v-for="(col, index) in columnEnum"
        :key="index"
        :label="col[fieldNames().label]"
        :value="col[fieldNames().value]"
      />
    </template>
    <slot v-else />
  </component>
</template>

<script lang="ts" setup name="search-form-item">
import { SearchColumnProps } from '@/interface/table'
import { computed, inject, ref } from 'vue'

interface SearchFormItem {
  column: SearchColumnProps
  searchParams: { [key: string]: any } // 搜索参数
}
const props = defineProps<SearchFormItem>()

const enumMap = inject('enumMap', ref(new Map()))

;(window as any).enumMap = enumMap

const columnEnum = computed(() => {
  if (!enumMap.value.get(props.column.prop)) return []
  return enumMap.value.get(props.column.prop)
})

const fieldNames = () => {
  return {
    label: props.column.fieldNames?.label ?? 'label',
    value: props.column.fieldNames?.value ?? 'value'
  }
}

// placeholder
const placeholder = (column: SearchColumnProps) => {
  return column.search?.props?.placeholder ?? (column.search?.el === 'el-input' ? '请输入' : '请选择')
}

// 是否有清除按钮
const clearable = (column: SearchColumnProps) => {
  return (
    column.search?.props?.clearable ?? (column.search?.defaultValue == null || column.search?.defaultValue == undefined)
  )
}
</script>
