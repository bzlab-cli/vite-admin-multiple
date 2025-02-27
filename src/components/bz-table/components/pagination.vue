<template>
  <el-pagination
    :size="paginationParams.size"
    :current-page="paginationParams.pageNum"
    :page-size="paginationParams.pageSize"
    :page-sizes="paginationParams.pageSizes"
    :background="paginationParams.background"
    :layout="paginationParams.layout"
    :total="paginationParams.total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script lang="ts" setup>
import { Table } from '@/interface/table'

interface PaginationProps {
  paginationParams: Table.PaginationParams
  handleSizeChange: (size: number) => void
  handleCurrentChange: (currentPage: number) => void
}

defineProps<PaginationProps>()
</script>
