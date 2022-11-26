<template>
  <div class="search" v-if="columns.length">
    <el-form ref="formRef" :model="searchParam">
      <grid ref="gridRef" :collapsed="collapsed" :gap="[20, 0]" :cols="colConfig">
        <grid-item v-for="(item, index) in columns" :key="item.prop" v-bind="getResponsive(item)" :index="index">
          <el-form-item :label="item.label" :label-width="item.labelWidth || 'auto'">
            <search-form-item :column="item" :searchParam="searchParam" />
          </el-form-item>
        </grid-item>
        <grid-item suffix>
          <div class="operation">
            <el-button type="primary" icon="Search" @click="handleSearch">搜索</el-button>
            <el-button icon="RefreshRight" @click="handleReset">重置</el-button>
            <el-button v-if="showCollapse" type="primary" link class="search-toggle" @click="collapsed = !collapsed">
              {{ collapsed ? '展开' : '合并' }}
              <el-icon class="el-icon--right">
                <component :is="collapsed ? 'ArrowDown' : 'ArrowUp'" />
              </el-icon>
            </el-button>
          </div>
        </grid-item>
      </grid>
    </el-form>
  </div>
</template>
<script setup lang="ts" name="SearchForm">
import { computed, ref } from 'vue'
import { ColumnProps, SearchColumnProps } from '@/components/bz-table/interface'
import searchFormItem from './components/form-item.vue'
import grid from './components/grid/index.vue'
import gridItem from './components/grid/components/grid-item.vue'

export type BreakPoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type Responsive = {
  span?: number
  offset?: number
}

interface ProTableProps {
  columns?: SearchColumnProps[] // 搜索配置列
  searchParam?: { [key: string]: any } // 搜索参数
  colConfig: number | Record<BreakPoint, number>
  handleSearch: (params: any) => void // 搜索方法
  handleReset: (params: any) => void // 重置方法
}

const props = withDefaults(defineProps<ProTableProps>(), {
  columns: () => [],
  searchParam: () => ({})
})

// 获取响应式设置
const getResponsive = (item: ColumnProps) => {
  return {
    span: item.search?.span,
    offset: item.search?.offset ?? 0,
    xs: item.search?.xs,
    sm: item.search?.sm,
    md: item.search?.md,
    lg: item.search?.lg,
    xl: item.search?.xl
  }
}

const collapsed = ref(true)

const gridRef = ref()
const breakPoint = computed<BreakPoint>(() => gridRef.value?.breakPoint)

// 是否显示 展开/合并
const showCollapse = computed(() => {
  let show = false
  props.columns.reduce((prev, current) => {
    prev +=
      (current.search![breakPoint.value]?.span ?? current.search?.span ?? 1) +
      (current.search![breakPoint.value]?.offset ?? current.search?.offset ?? 0)
    if (typeof props.colConfig !== 'number') {
      if (prev >= props.colConfig[breakPoint.value]) show = true
    } else {
      if (prev > props.colConfig) show = true
    }
    return prev
  }, 0)
  return show
})
</script>

<style lang="scss" scoped>
.search {
  .operation {
    display: flex;
    .search-toggle {
      margin-left: 5px;
    }
  }
}
</style>
