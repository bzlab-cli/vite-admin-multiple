<template>
  <svg :class="svgClass" aria-hidden="true" v-on="$attrs">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
export default defineComponent({
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const iconName = computed(() => {
      return `#icon-${props.iconClass}`
    })

    const svgClass = computed(() => {
      if (props.className) {
        return 'svg-icon ' + props.className
      }
      return 'svg-icon'
    })

    return {
      iconName,
      svgClass
    }
  }
})
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 15px;
  height: 15px;
  vertical-align: middle;
  fill: currentColor;
  overflow: hidden;
}
</style>
