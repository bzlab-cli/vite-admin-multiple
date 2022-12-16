<template>
  <el-breadcrumb class="app-breadcrumb" separator-icon="ArrowRight">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
        <span v-if="item.redirect === 'noredirect' || index === breadcrumbs.length - 1" class="no-redirect">
          {{ item.meta.title }}
        </span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, reactive, toRefs, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { compile } from 'path-to-regexp'
import { usePermissionStore } from '@/views/admin/store/modules/permission'
import { getAllBreadcrumbList } from '@/utils/permission'

export default defineComponent({
  setup() {
    const router = useRouter()
    const currentRoute = useRoute()
    const permissionStore = usePermissionStore() as any
    const pathCompile = (path: string) => {
      const { params } = currentRoute
      const toPath = compile(path)
      return toPath(params)
    }

    const state = reactive({
      breadcrumbs: [] as any,
      getBreadcrumb: () => {
        const matched = currentRoute.matched[currentRoute.matched.length - 1].path
        const breadcrumbList = getAllBreadcrumbList(permissionStore.routes)
        const matchedList = breadcrumbList[matched]
        if (matchedList?.length > 1) {
          const last = matchedList[matchedList.length - 1]
          const lastSecond = matchedList[matchedList.length - 2]
          if (last?.meta?.hidden) {
            permissionStore.setActiveMenu(lastSecond?.path)
          } else {
            permissionStore.setActiveMenu(last?.path)
          }
        }

        state.breadcrumbs = computed(() => matchedList)
      },
      handleLink(item: any) {
        const { redirect, path } = item
        if (redirect) {
          router.push(redirect).catch(err => {
            console.warn(err)
          })
          return
        }
        router.push(pathCompile(path)).catch(err => {
          console.warn(err)
        })
      }
    })

    watch(
      () => currentRoute.path,
      path => {
        if (path.startsWith('/redirect/')) {
          return
        }
        permissionStore.setActiveMenu('')
        state.getBreadcrumb()
      }
    )

    onBeforeMount(() => {
      state.getBreadcrumb()
    })

    return {
      ...toRefs(state)
    }
  }
})
</script>

<style lang="scss" scoped>
.el-breadcrumb__inner,
.el-breadcrumb__inner a {
  font-weight: 400 !important;
}

.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
