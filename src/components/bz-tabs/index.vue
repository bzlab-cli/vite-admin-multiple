<template>
  <div class="bz-tabs card" v-if="columns.length">
    <el-tabs v-model="activeName" class="bz-tabs-box" v-bind="tabsProps" @tab-click="handleClick">
      <el-tab-pane
        :label="item.label"
        :name="item.prop"
        v-for="(item, index) in columns"
        :key="item.prop"
        :index="index"
      >
        <component :is="renderLoop(item)" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="tsx" setup name="bz-tabs">
import { ref } from 'vue'
import { TabsProps, TabsColumnsProps } from '@/interface/table'

interface TabProps {
  tabsProps?: TabsProps
  columns?: TabsColumnsProps[] // 配置列
  handleClick: (params: any) => void // 点击回调
}

const props = withDefaults(defineProps<TabProps>(), {
  columns: () => []
})

const activeName = ref()
const activeColumn = props.columns.find(item => item.active)

if (props.columns?.length) {
  activeName.value = activeColumn ? activeColumn.prop : props.columns[0].prop
}

const renderLoop = (item: TabsColumnsProps) => {
  return <>{item.render && item.render(item)}</>
}

defineExpose({ activeName })
</script>

<style lang="scss" scoped>
.bz-tabs {
  height: unset;
  padding-top: 5px;
  padding-bottom: 0;
  :deep(.el-tabs__header) {
    margin-bottom: 0;
  }
  :deep(.el-tabs__nav-wrap::after) {
    height: 1px;
  }
}
</style>
