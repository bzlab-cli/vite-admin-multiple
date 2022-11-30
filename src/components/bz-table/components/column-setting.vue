<template>
  <el-drawer title="列设置" v-model="drawerVisible" size="500px">
    <div class="table" ref="colTableRef">
      <el-table
        :data="colSetting"
        :border="true"
        row-key="prop"
        default-expand-all
        :tree-props="{ children: 'children' }"
      >
        <el-table-column prop="label" align="center" label="列名" />
        <el-table-column prop="isShow" align="center" label="显示" v-slot="scope">
          <el-switch v-model="scope.row.isShow" />
        </el-table-column>
        <template #empty>
          <el-empty :image-size="100" description="暂无数据" />
        </template>
      </el-table>
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ColumnProps } from '@/interface/table'

defineProps<{ colSetting: ColumnProps[] }>()

const drawerVisible = ref<boolean>(false)

const openColSetting = () => {
  drawerVisible.value = true
}

defineExpose({
  openColSetting
})
</script>

<style lang="scss" scoped>
.cursor-move {
  cursor: move;
}
</style>
