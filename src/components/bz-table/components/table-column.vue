<template>
  <component :is="renderLoop(column)" />
</template>

<script lang="tsx" setup>
import { inject, ref, useSlots } from 'vue'
import { ElTableColumn } from 'element-plus'
import { formatValue } from '@/utils'
import { ColumnProps } from '@/interface/table'

const slots = useSlots()

defineProps<{ column: ColumnProps }>()

const searchEnumMap = inject('searchEnumMap', ref(new Map()))
const enumMap = inject('enumMap', ref(new Map()))

const filterEnum = (
  row: any,
  enumData: { [key: string]: any } | undefined,
  fieldRowNames?: { [key: string]: any }
): string => {
  const name = fieldRowNames?.name ?? 'name'
  const value = fieldRowNames?.value ?? 'value'
  const rowKey = fieldRowNames?.rowKey ?? 'rowKey'
  const curValue = row[rowKey]

  let filterData: any = {}
  if (Array.isArray(enumData)) filterData = enumData.find((item: any) => item[value] === curValue)
  return filterData ? filterData[name] : '-'
}

const renderCellData = (item: ColumnProps, scope: any) => {
  if (item.enum) {
    return enumMap.value.get(item.prop) && item.filterEnum
      ? filterEnum(scope.row, enumMap.value.get(item.prop)!, item.fieldRowNames)
      : formatValue(scope.row[item.prop!])
  }

  return searchEnumMap.value.get(item.prop) && item.filterEnum
    ? filterEnum(scope.row, searchEnumMap.value.get(item.prop)!, item.fieldRowNames)
    : formatValue(scope.row[item.prop!])
}

const renderLoop = (item: ColumnProps) => {
  return (
    <>
      {item.isShow && (
        <ElTableColumn
          {...item}
          align={item.align ?? 'center'}
          showOverflowTooltip={item.showOverflowTooltip ?? item.prop !== 'operation'}
        >
          {{
            default: (scope: any) => {
              if (item._children) return item._children.map(child => renderLoop(child))
              if (item.render) return item.render(scope)
              if (slots[item.prop!]) return slots[item.prop!]!(scope)
              return renderCellData(item, scope)
            },
            header: () => {
              if (item.headerRender) return item.headerRender(item)
              if (slots[`${item.prop}Header`]) return slots[`${item.prop}Header`]!({ row: item })
              return item.label
            }
          }}
        </ElTableColumn>
      )}
    </>
  )
}
</script>
