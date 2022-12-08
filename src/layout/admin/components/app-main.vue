<template>
  <section class="app-main">
    <router-view :key="key" v-slot="{ Component }">
      <keep-alive :include="cachedViews">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </section>
</template>

<script lang="ts">
import { useTagsStore } from '@/views/admin/store/modules/tags'
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  setup() {
    const tagsStore = useTagsStore()
    const route = useRoute()
    const cachedViews = computed(() => {
      return tagsStore.cachedViews
    })
    const key = () => {
      return route.path
    }
    return {
      cachedViews,
      key
    }
  }
})
</script>

<style lang="scss" scoped>
.app-main {
  height: calc(100vh - $navigationHeight);
  width: 100%;
  position: relative;
  top: $navigationHeight;
  background-color: $bgColor;
  padding: 10px;
  overflow: auto;
  .main-box {
    display: flex;
    width: 100%;
    height: 100%;
    :deep(.table-box) {
      width: calc(100% - 230px);
    }
  }
  :deep(.table-box) {
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }
}
</style>
