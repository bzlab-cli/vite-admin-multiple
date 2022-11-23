<template>
  <el-pagination
    :current-page="pageTable.pageNum"
    :page-size="pageTable.pageSize"
    :page-sizes="[10, 25, 50, 100]"
    :background="true"
    layout="total, sizes, prev, pager, next, jumper"
    :total="pageTable.total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script setup lang="ts">
interface PageTable {
  pageNum: number
  pageSize: number
  total: number
}

interface PaginationProps {
  pageTable: PageTable
  handleSizeChange: (size: number) => void
  handleCurrentChange: (currentPage: number) => void
}

defineProps<PaginationProps>()
</script>
