<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import '@/utils/flexible'
import { useStore } from '@/views/screen/store'

export default defineComponent({
  components: {
    ElConfigProvider
  },
  setup() {
    const store = useStore()
    ;(window as any).store = store

    return {
      locale: zhCn
    }
  }
})
</script>
<style lang="scss">
.page-content {
  box-sizing: border-box;
  height: 100%;
}
</style>
