<template>
  <div class="bz-select-filter">
    <div v-for="item in data" :key="item.key" class="filter-item">
      <div class="title">
        <span>{{ item.title }} ：</span>
      </div>
      <span v-if="!item.options.length" class="no-data">暂无数据</span>
      <el-scrollbar>
        <ul class="filter-list">
          <li
            v-for="option in item.options"
            :key="option.value"
            :class="{
              active: selected[item.key] && selected[item.key].includes(option.value)
            }"
            @click="select(item, option)"
          >
            <el-icon v-if="option.icon"><component :is="option.icon" /></el-icon>
            <span>{{ option.label }}</span>
          </li>
        </ul>
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts" setup name="bz-select-filter">
import { ref, onBeforeMount } from 'vue'

interface optionsProps {
  value: string
  label: string
  icon?: string
}

interface DataProps {
  title: string // 标题
  key: string // 筛选项key值
  multiple?: boolean // 是否多选
  options: optionsProps[] // 筛选数据
}

interface FilterProps {
  data?: DataProps[] // 列表数据
  initParam?: any // 默认值
}

interface FilterEmits {
  (e: 'change', value: selectedProp): void
}

type selectedProp = { [key: string]: string[] }

const props = withDefaults(defineProps<FilterProps>(), {
  data: () => []
})

const emit = defineEmits<FilterEmits>()
const selected = ref<selectedProp>({})

function isType(val: any) {
  if (val === null) return 'null'
  if (typeof val !== 'object') return typeof val
  return Object.prototype.toString.call(val).slice(8, -1).toLocaleLowerCase()
}

onBeforeMount(() => {
  props.data.forEach(item => {
    let transform = { ...props.initParam }
    if (transform[item.key] && isType(transform[item.key]) == 'string')
      transform[item.key] = [...props.initParam[item.key]]
    selected.value[item.key] = transform[item.key] || [item.options[0]?.value]
  })
})

const select = (item: DataProps, option: optionsProps) => {
  if (!item.multiple) {
    if (selected.value[item.key].includes(option.value)) return
    selected.value[item.key] = [option.value]
  } else {
    if (item.options[0].value === option.value) selected.value[item.key] = [option.value]
    if (selected.value[item.key].includes(option.value)) {
      let currentIndex = selected.value[item.key].findIndex(s => s === option.value)
      selected.value[item.key].splice(currentIndex, 1)
      if (selected.value[item.key].length === 0) selected.value[item.key] = [item.options[0].value]
    } else {
      selected.value[item.key].push(option.value)
      if (selected.value[item.key].includes(item.options[0].value)) {
        selected.value[item.key].splice(0, 1)
      }
    }
  }
  change()
}

const change = () => {
  emit('change', { ...selected.value })
}
</script>

<style lang="scss" scoped>
.bz-select-filter {
  width: 100%;
  .filter-item {
    display: flex;
    align-items: center;
    border-bottom: 1px dashed var(--el-border-color-light);
    &:last-child {
      border-bottom: none;
    }
    .title {
      margin-top: -5px;
      span {
        font-size: 14px;
        color: var(--el-text-color-regular);
        white-space: nowrap;
      }
    }
    .no-data {
      margin: 12px 0 13px;
      font-size: 14px;
      color: var(--el-text-color-regular);
    }
    .filter-list {
      display: flex;
      flex: 1;
      padding: 0;
      margin: 13px 0;
      li {
        display: flex;
        align-items: center;
        padding: 5px 15px;
        margin-right: 16px;
        font-size: 13px;
        color: #303133;
        list-style: none;
        cursor: pointer;
        background: var(--el-color-primary-light-8);
        border-radius: 32px;
        &:hover {
          color: var(--el-color-primary);
        }
        &.active {
          font-weight: bold;
          color: #ffffff;
          background: var(--el-color-primary);
        }
        .el-icon {
          margin-right: 4px;
          font-size: 16px;
          font-weight: bold;
        }
        span {
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
