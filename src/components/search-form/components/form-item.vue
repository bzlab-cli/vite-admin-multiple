<template>
  <component
    v-if="column.search?.el"
    :is="`el-${column.search.el}`"
    v-bind="column.search.props"
    v-model="searchParam[column.search.key ?? column.prop!]"
    :data="column.search?.el === 'tree-select' ? columnEnum : []"
    :placeholder="placeholder(column)"
    :clearable="clearable(column)"
    range-separator="至"
    start-placeholder="开始时间"
    end-placeholder="结束时间"
  >
    <template v-if="column.search.el === 'select'">
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

<script setup lang="ts" name="searchFormItem">
import { SearchColumnProps } from '@/components/bz-table/interface'
import { computed, inject, ref } from 'vue'

interface SearchFormItem {
  column: SearchColumnProps
  searchParam: { [key: string]: any } // 搜索参数
}
const props = defineProps<SearchFormItem>()

// 接受 enumMap
const enumMap = inject('enumMap', ref(new Map()))

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

// 判断 placeholder
const placeholder = (column: SearchColumnProps) => {
  return column.search?.props?.placeholder ?? (column.search?.el === 'input' ? '请输入' : '请选择')
}

// 是否有清除按钮 (当搜索项有默认值时，清除按钮不显示)
const clearable = (column: SearchColumnProps) => {
  return (
    column.search?.props?.clearable ?? (column.search?.defaultValue == null || column.search?.defaultValue == undefined)
  )
}
</script>