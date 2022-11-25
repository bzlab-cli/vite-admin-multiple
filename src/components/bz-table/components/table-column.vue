<template>
  <component :is="renderLoop(column)" />
</template>

<script lang="tsx" setup>
import { useSlots } from 'vue'
import { ElTableColumn } from 'element-plus'
import { formatValue } from '@/utils'
import { ColumnProps } from '@/components/bz-table/interface'

const slots = useSlots()

defineProps<{ column: ColumnProps }>()

const renderCellData = (item: ColumnProps, scope: any) => {
  return formatValue(scope.row[item.prop!])
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
