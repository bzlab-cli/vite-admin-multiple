<template>
  <div class="bz-card" v-if="data.length">
    <el-row :gutter="cardGutter">
      <el-col :span="cardSpan" v-for="(item, index) in data" :key="index" :index="index">
        <el-card :shadow="cardShadow" @click="cardClick(item, index)">
          <slot name="card" :item="item" :index="index" />
        </el-card>
      </el-col>
    </el-row>
  </div>
  <el-empty v-if="!data.length" :image-size="100" description="暂无数据" />
</template>
<script lang="tsx" setup name="bz-card">
interface CardsProps {
  cardGutter?: number
  cardSpan?: number
  cardShadow?: string
  data?: any[] // 数据
  cardClick?: (item?: any, index?: number) => void // 点击回调
}

withDefaults(defineProps<CardsProps>(), {
  data: () => [],
  cardClick: () => {}
})
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
