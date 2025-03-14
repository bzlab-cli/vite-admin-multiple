<template>
  <div :class="{ 'has-logo': showLogo }" class="sideWrap">
    <SidebarLogo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :collapse="!isCollapse"
        :unique-opened="false"
        :default-active="activeMenu"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in menuList"
          :key="route.path"
          :item="route"
          :base-path="route.path"
          :is-collapse="isCollapse"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch, ref, reactive } from 'vue'
import SidebarItem from './sidebar-item.vue'
import SidebarLogo from './sidebar-logo.vue'
import { useAppStore } from '@/views/admin/store/modules/app'
import { usePermissionStore } from '@/views/admin/store/modules/permission'
import { useSettingsStore } from '@/views/admin/store/modules/settings'
import { useRoute } from 'vue-router'
import { getShowMenuList } from '@/utils/permission'

export default defineComponent({
  components: {
    SidebarItem,
    SidebarLogo
  },
  setup() {
    const variables = reactive(__SCSS_VARS__)
    const appStore = useAppStore()
    const permissionStore = usePermissionStore() as any
    const settingsStore = useSettingsStore()
    const route = useRoute()
    const sidebar = computed(() => {
      return appStore.sidebar
    })
    const routes = computed(() => {
      return permissionStore.routes
    })

    const activeMenu = ref()
    const menuList = computed(() => getShowMenuList(permissionStore.routes))
    const showLogo = computed(() => {
      return settingsStore.showSidebarLogo
    })

    const menuActiveTextColor = computed(() => {
      if (settingsStore.sidebarTextTheme) {
        return '#57CAEB'
        // return settingsStore.theme
      }
      return variables.menuActiveText
    })

    const isCollapse = computed(() => {
      return sidebar.value.opened
    })

    watch(
      () => route,
      val => {
        activeMenu.value = val.path
      }
    )

    watch(
      () => permissionStore.activeMenu,
      val => {
        activeMenu.value = val
      }
    )

    return {
      sidebar,
      routes,
      menuList,
      showLogo,
      menuActiveTextColor,
      variables,
      activeMenu,
      isCollapse
    }
  }
})
</script>

<style lang="scss" scoped>
.sidebar-container {
  .el-menu {
    border: none;
  }
  .horizontal-collapse-transition {
    transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
  }
  :deep(.scrollbar-wrapper) {
    height: calc(100% - 50px);
  }

  .el-scrollbar__view {
    height: 100%;
  }

  .el-scrollbar__bar {
    &.is-vertical {
      right: 0px;
    }

    &.is-horizontal {
      display: none;
    }
  }
}
</style>
