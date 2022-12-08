<template>
  <div class="card bz-tree-filter">
    <h4 class="title" v-if="!hideTitle">{{ title }}</h4>
    <el-input v-model="filterText" v-if="!hideSearch" placeholder="请输入关键字过滤" clearable />
    <div class="tree-scroll" :style="scrollHeight">
      <div class="scroll-box">
        <el-tree
          ref="treeRef"
          :default-expand-all="expandAll"
          :node-key="id"
          :data="treeData"
          :show-checkbox="checkbox"
          :check-strictly="false"
          :current-node-key="selectId"
          :highlight-current="!checkbox"
          :expand-on-click-node="false"
          :check-on-click-node="checkbox"
          :props="defaultProps"
          :filter-node-method="filterNode"
          :default-checked-keys="selectIds"
          @node-click="handleNodeClick"
          @check="handleCheckChange"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="bz-tree-filter">
import { ref, watch, onBeforeMount, computed } from 'vue'
import { ElTree } from 'element-plus'

interface TreeFilterProps {
  requestApi?: (data?: any) => Promise<any> // 请求接口数据
  data?: { [key: string]: any }[] // 外部传入数据，不通过接口
  dataCallback?: any // 返回数据二次处理
  expandAll?: boolean // 展开所有
  initParam?: any // 初始化请求参数
  hideTitle?: boolean // 隐藏标题
  hideSearch?: boolean // 隐藏搜索框
  hideParentLabel?: boolean // 隐藏顶层标签
  initFetch?: boolean // 初始化请求数据
  title?: string // 标题
  id?: string // 显示的id，默认为id
  label?: string // 显示的label，默认为label
  children?: string // 子级属性，默认为children
  parentLabel?: string // 顶层目录数据，默认为全部
  checkbox?: boolean // 是否为多选，默认为false
  selectId?: undefined | string // 默认选中单行值
  selectIds?: string[] // 默认选中复选框值
}

interface FilterEmits {
  (e: 'change', value: any, selection: any): void
  (e: 'check-change', value: any): void
  (e: 'success', value: any): void
}

const props = withDefaults(defineProps<TreeFilterProps>(), {
  expandAll: true,
  initParam: {},
  hideTitle: false,
  hideSearch: false,
  hideParentLabel: false,
  initFetch: true,
  id: 'id',
  label: 'label',
  children: 'children',
  parentLabel: '全部',
  checkbox: false,
  selectId: undefined,
  selectIds: () => []
})

const emit = defineEmits<FilterEmits>()

const defaultProps = {
  children: props.children,
  label: props.label
}

const selectId = ref(props.selectId)
const selectIds = ref(props.selectIds)
const filterText = ref<string>('')
const treeRef = ref<InstanceType<typeof ElTree>>()
const treeData = ref<{ [key: string]: any }[]>([])

onBeforeMount(async () => {
  props.initFetch && getTreeList()
})

const getTreeList = async () => {
  if (props.data?.length) {
    treeData.value = getData(props.data)
    return emit('success', treeData.value)
  }
  let { data } = await props.requestApi!(props.initParam)
  props.dataCallback && (data = props.dataCallback(data))
  let response = getData(data)
  if (props.checkbox) {
    treeData.value = response
    return emit('success', treeData.value)
  }
  treeData.value = response
  emit('success', treeData.value)
}

const getData = data => {
  if (!data?.length) return []
  return props.hideParentLabel ? data : [{ [props.id]: '', [props.label]: props.parentLabel }, ...data]
}

watch(
  () => props.selectId,
  val => {
    setTimeout(() => {
      selectId.value = val
    }, 0)
  },
  { deep: true }
)

watch(
  () => props.selectIds,
  val => {
    setTimeout(() => {
      selectIds.value = val
    }, 0)
  },
  { deep: true }
)

watch(filterText, val => {
  treeRef.value!.filter(val)
})

const scrollHeight = computed(() => {
  let styles = { height: '' }
  if (!props.hideTitle && !props.hideSearch) {
    styles.height = 'calc(100% - 82px)'
  } else if (props.hideTitle && props.hideSearch) {
    styles.height = 'calc(100% - 1px)'
  } else if (props.hideTitle) {
    styles.height = 'calc(100% - 48px)'
  } else if (props.hideSearch) {
    styles.height = 'calc(100% - 37px)'
  }
  return styles
})

const filterNode = (value: string, data: { [key: string]: any }, node: any) => {
  if (!value) return true
  let parentNode = node.parent,
    labels = [node.label],
    level = 1
  while (level < node.level) {
    labels = [...labels, parentNode.label]
    parentNode = parentNode.parent
    level++
  }
  return labels.some(label => label.indexOf(value) !== -1)
}

// 单选
const handleNodeClick = (data: { [key: string]: any }) => {
  const selection = {
    selection: getSelection(),
    selectionKeys: getSelectionKeys()
  }
  emit('change', data, !props.checkbox ? null : selection)
}

// 多选
const handleCheckChange = () => {
  const selection = {
    selection: getSelection(),
    selectionKeys: getSelectionKeys()
  }
  emit('check-change', selection)
}

const getSelection = () => {
  return treeRef.value?.getCheckedNodes()
}

const getSelectionKeys = () => {
  return treeRef.value?.getCheckedKeys()
}

const clearSelection = () => {
  treeRef.value?.setCheckedKeys([])
}

defineExpose({ treeRef, treeData, getTreeList, getSelection, getSelectionKeys, clearSelection })
</script>

<style lang="scss" scoped>
.bz-tree-filter {
  box-sizing: border-box;
  width: 220px;
  height: 100%;
  padding: 15px 0 0 0;
  margin-right: 10px;
  .title {
    padding: 0 15px;
    margin: 0 0 15px;
    font-size: 18px;
    font-weight: bold;
    color: var(--el-color-info-dark-2);
    letter-spacing: 0.5px;
  }
  .el-input {
    margin: 0 0 15px;
    padding: 0 15px;
  }
  .tree-scroll {
    .scroll-box {
      height: 100%;
    }
    :deep(.el-tree) {
      height: 100%;
      overflow: auto;
      padding-left: 15px;
      .el-tree-node {
        width: 100%;
      }
      .el-tree-node__content {
        height: 33px;
      }
      .el-tree-node > .el-tree-node__children {
        overflow: visible;
      }
    }
  }
}
</style>
