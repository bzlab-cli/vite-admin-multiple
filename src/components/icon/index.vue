<template>
  <ElIcon :size="size">
    <component :is="icon" />
  </ElIcon>
</template>

<script lang="ts" setup name="Icon">
defineProps({
  icon: {
    type: String,
    default: ''
  },
  size: {
    type: Number,
    default: 18
  }
})
</script>
