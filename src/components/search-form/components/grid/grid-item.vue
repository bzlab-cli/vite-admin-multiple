<template>
  <div :style="style" v-show="isShow">
    <slot />
  </div>
</template>
<script lang="ts" setup name="grid-item">
import { computed, inject, Ref, ref, useAttrs, watch } from 'vue'
import { BreakPoint, Responsive } from '@/interface/grid'

type Props = {
  offset?: number
  span?: number
  suffix?: boolean
  xs?: Responsive
  sm?: Responsive
  md?: Responsive
  lg?: Responsive
  xl?: Responsive
}

const props = withDefaults(defineProps<Props>(), {
  offset: 0,
  span: 1,
  suffix: false,
  xs: undefined,
  sm: undefined,
  md: undefined,
  lg: undefined,
  xl: undefined
})

const attrs = useAttrs() as any
const isShow = ref(true)

const breakPoint = inject<Ref<BreakPoint>>('breakPoint', ref('xl'))
const shouldHiddenIndex = inject<Ref<number>>('shouldHiddenIndex', ref(-1))
watch(
  () => [shouldHiddenIndex.value, breakPoint.value],
  n => {
    if (attrs.index) {
      isShow.value = !(n[0] !== -1 && parseInt(attrs.index) >= n[0])
    }
  },
  { immediate: true }
)

const gap = inject('gap', 0)
const cols = inject<Ref<number>>('cols', ref(4))
const style = computed(() => {
  let span = props[breakPoint.value]?.span ?? props.span
  let offset = props[breakPoint.value]?.offset ?? props.offset
  if (props.suffix) {
    return {
      gridColumnStart: cols.value - span - offset + 1,
      gridColumnEnd: `span ${span + offset}`,
      marginLeft: offset !== 0 ? `calc(((100% + ${gap}px) / ${span + offset}) * ${offset})` : 'unset'
    }
  }
  return {
    gridColumn: `span ${span + offset > cols.value ? cols.value : span + offset}/span ${
      span + offset > cols.value ? cols.value : span + offset
    }`,
    marginLeft: offset !== 0 ? `calc(((100% + ${gap}px) / ${span + offset}) * ${offset})` : 'unset'
  }
})
</script>
