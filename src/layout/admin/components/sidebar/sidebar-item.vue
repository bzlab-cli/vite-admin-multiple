<template>
  <div :class="[isCollapse ? 'simple-mode' : 'full-mode', { 'first-level': isFirstLevel }]">
    <el-sub-menu v-if="item.children && item.children.length > 0" :index="resolvePath(item.path)">
      <template #title>
        <el-icon v-if="item?.meta?.icon">
          <component :is="item.meta.icon" />
        </el-icon>
        <span v-if="isCollapse && item?.meta?.title">{{ item.meta.title }}</span>
      </template>
      <template v-if="item.children">
        <sidebar-item
          v-for="child in item.children"
          :key="child.path"
          :item="child"
          :is-collapse="isCollapse"
          :is-first-level="false"
          :base-path="resolvePath(child.path)"
          class="nest-menu"
        />
      </template>
    </el-sub-menu>
    <sidebar-item-link v-else :to="resolvePath(item.path)">
      <el-menu-item :index="resolvePath(item.path)">
        <el-icon v-if="item?.meta?.icon">
          <component :is="item.meta.icon" />
        </el-icon>
        <span v-if="isCollapse && item?.meta?.title">{{ item.meta.title }}</span>
      </el-menu-item>
    </sidebar-item-link>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { RouteRecordRaw } from 'vue-router'
import { isExternal } from '@/utils'
import SidebarItemLink from './sidebar-item-link.vue'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<RouteRecordRaw>,
      required: true
    },
    isCollapse: {
      type: Boolean,
      required: false
    },
    isFirstLevel: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      required: true,
      default: ''
    }
  },
  components: {
    SidebarItemLink
  },
  setup(props) {
    const resolvePath = (routePath: string) => {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(props.basePath)) {
        return props.basePath
      }
      return routePath
    }

    return {
      resolvePath
    }
  }
})
</script>

<style lang="scss" scoped>
.el-submenu.is-active > .el-submenu__title {
  color: $subMenuActiveText !important;
}

.el-menu-item:hover {
  outline: 0 !important;
  color: #409eff !important;
}

.full-mode {
  :deep(.el-sub-menu__icon-arrow) {
    display: none;
  }
  .nest-menu .el-submenu > .el-submenu__title,
  .el-submenu .el-menu-item {
    min-width: $sideBarWidth !important;
    background-color: $subMenuBg !important;

    &:hover {
      background-color: $subMenuHover !important;
    }
  }
  .el-menu-item {
    & > span {
      display: inline-block;
      padding-left: 5px;
    }
  }
}

.simple-mode {
  &.first-level {
    .el-submenu {
      overflow: hidden;

      & > .el-submenu__title {
        padding: 0px !important;

        .el-submenu__icon-arrow {
          display: none;
        }

        & > span {
          visibility: hidden;
        }
      }
    }
  }
}
</style>
