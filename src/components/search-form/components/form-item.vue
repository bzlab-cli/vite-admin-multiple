<template>
  <component class="bz-search-form" v-if="column.render" :is="column.render(column)" />
  <component
    v-if="!column.render"
    :is="column.search?.el"
    v-bind="column.search?.props"
    v-model="searchParams[column.search?.key]"
    v-on="column.search?.event"
    :data="column.search?.el === 'el-tree-select' ? treeSelectColumnEnum : []"
    :placeholder="placeholder(column)"
    :clearable="clearable(column)"
    class="bz-search-form"
  >
    <template v-if="column.search?.el === 'el-select'">
      <component
        :is="`el-option`"
        v-for="(col, index) in selectColumnEnum"
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
import { forEachTree } from '@/utils'

interface SearchFormItem {
  column: SearchColumnProps
  searchParams: { [key: string]: any }
}
const props = defineProps<SearchFormItem>()
const searchEnumMap = inject('searchEnumMap', ref(new Map()))
const enumMap = inject('enumMap', ref(new Map()))

;(window as any).searchEnumMap = searchEnumMap
;(window as any).enumMap = enumMap

const selectColumnEnum = computed(() => {
  if (!searchEnumMap.value.get(props.column.prop)) return []
  return searchEnumMap.value.get(props.column.prop)
})

const treeSelectColumnEnum = computed(() => {
  if (!searchEnumMap.value.get(props.column.prop)) return []
  let columnValue = searchEnumMap.value.get(props.column.prop)
  forEachTree(columnValue, item => {
    item.label = item[fieldNames().label]
    item.value = item[fieldNames().value]
    const children = item[fieldNames().children]
    if (children) {
      item.children = children
    }
  })

  return columnValue
})

const fieldNames = () => {
  return {
    label: props.column.fieldNames?.label ?? 'label',
    value: props.column.fieldNames?.value ?? 'value',
    children: props.column.fieldNames?.children ?? 'children'
  }
}

const placeholder = (column: SearchColumnProps) => {
  return column.search?.props?.placeholder ?? (column.search?.el === 'el-input' ? '请输入' : '请选择')
}

// 清除按钮
const clearable = (column: SearchColumnProps) => {
  return (
    column.search?.props?.clearable ?? (column.search?.defaultValue == null || column.search?.defaultValue == undefined)
  )
}
</script>

<style lang="scss">
.bz-search-form .el-tree-node__content {
  height: 34px !important;
  .el-tree-node__expand-icon {
    margin-left: 0;
  }
}
</style>
