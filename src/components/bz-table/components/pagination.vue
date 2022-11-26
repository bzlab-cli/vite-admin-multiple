<template>
  <el-pagination
    :current-page="pageTable.pageNum"
    :page-size="pageTable.pageSize"
    :page-sizes="pageTable.pageSizes"
    :background="pageTable.background"
    :layout="pageTable.layout"
    :total="pageTable.total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script lang="ts" setup>
import { Table } from '@/interface/table'

interface PaginationProps {
  pageTable: Table.PageTable
  handleSizeChange: (size: number) => void
  handleCurrentChange: (currentPage: number) => void
}

defineProps<PaginationProps>()
</script>
