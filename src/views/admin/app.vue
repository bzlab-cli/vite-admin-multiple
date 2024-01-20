<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { useStore } from '@/views/admin/store'
import { createNamespace } from '@/utils'

export default defineComponent({
  components: {
    ElConfigProvider
  },
  setup() {
    const store = useStore()
    createNamespace(`bz.store`)
    bz.store = store

    return {
      locale: zhCn
    }
  }
})
</script>
<style lang="scss">
.page-content {
  box-sizing: border-box;
  padding: 20px;
  .title {
    font-size: 24px;
    margin-bottom: 20px;
  }
}
</style>
