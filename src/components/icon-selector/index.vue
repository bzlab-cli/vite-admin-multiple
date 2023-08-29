<template>
  <div class="icon-selector">
    <el-popover
      placement="bottom"
      trigger="click"
      :width="fontIconWidth"
      v-model:visible="fontIconVisible"
      popper-class="icon-selector-popper"
    >
      <template #reference>
        <el-input
          v-model="fontIconSearch"
          placeholder="请选择图标"
          :clearable="clearable"
          :disabled="disabled"
          :size="size"
          style="width: 267px"
          ref="inputWidthRef"
          @clear="onClearFontIcon"
          @blur="onIconBlur"
        >
          <template #prepend>
            <el-icon class="font14 ele">
              <component :is="fontIconPrefix === '' ? prepend : fontIconPrefix" />
            </el-icon>
          </template>
        </el-input>
      </template>
      <transition name="el-zoom-in-top">
        <div class="icon-selector-wrap" v-show="fontIconVisible">
          <div class="icon-selector-wrap-title">{{ title }}</div>
          <div class="icon-selector-wrap-row">
            <el-scrollbar>
              <el-row :gutter="10" v-if="fontIconSheetsFilterList.length > 0">
                <el-col
                  :xs="6"
                  :sm="4"
                  :md="4"
                  :lg="4"
                  :xl="4"
                  @click="onColClick(v)"
                  v-for="(v, k) in fontIconSheetsFilterList"
                  :key="k"
                >
                  <div class="icon-selector-wrap-item" :class="{ 'icon-selector-active': fontIconPrefix === v }">
                    <div class="flex-margin">
                      <div class="icon-selector-wrap-item-value">
                        <el-icon>
                          <component :is="v" />
                        </el-icon>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-empty :image-size="100" v-if="fontIconSheetsFilterList.length <= 0" :description="emptyDescription" />
            </el-scrollbar>
          </div>
        </div>
      </transition>
    </el-popover>
  </div>
</template>

<script lang="ts">
import { ref, toRefs, reactive, onMounted, nextTick, computed, watch } from 'vue'
import initIconfont from '@/utils/style-sheets'

export default {
  name: 'iconSelector',
  emits: ['update:modelValue', 'get', 'clear'],
  props: {
    prepend: {
      type: String,
      default: () => 'Menu'
    },
    placeholder: {
      type: String,
      default: () => '请输入内容搜索图标或者选择图标'
    },
    size: {
      type: String,
      default: () => 'default'
    },
    title: {
      type: String,
      default: () => '请选择图标'
    },
    type: {
      type: String,
      default: () => 'ele'
    },
    disabled: {
      type: Boolean,
      default: () => false
    },
    clearable: {
      type: Boolean,
      default: () => true
    },
    emptyDescription: {
      type: String,
      default: () => '无相关图标'
    },
    modelValue: String
  },
  setup(props, { emit }) {
    const inputWidthRef = ref()
    const state: any = reactive({
      fontIconPrefix: '',
      fontIconVisible: false,
      fontIconWidth: 0,
      fontIconSearch: '',
      fontIconTabsIndex: 0,
      fontIconSheetsList: []
    })

    const onIconBlur = () => {
      const icon = state.fontIconSheetsList.filter((icon: string) => icon === state.fontIconSearch)
      if (!icon.length) onClearFontIcon()
    }
    const initModeValueEcho = () => {
      state.fontIconSearch = props.modelValue
      state.fontIconPrefix = props.modelValue
    }
    const fontIconSheetsFilterList = computed(() => {
      return state.fontIconSheetsList
      // if (!state.fontIconSearch) return state.fontIconSheetsList
      // let search = state.fontIconSearch.trim()
      // return state.fontIconSheetsList.filter((item: any) => {
      //   if (item.indexOf(search) !== -1) return item
      // })
    })
    const getInputWidth = () => {
      nextTick(() => {
        state.fontIconWidth = inputWidthRef.value.$el.offsetWidth
      })
    }
    const initResize = () => {
      window.addEventListener('resize', () => getInputWidth())
    }
    const initFontIconData = async () => {
      if (props.type === 'ele') {
        await initIconfont.ele().then((res: any) => {
          state.fontIconTabsIndex = 1
          state.fontIconSheetsList = res
        })
      }
      state.fontIconSearch = props.placeholder
      initModeValueEcho()
    }
    const onColClick = (v: any) => {
      state.fontIconSearch = v
      state.fontIconVisible = false
      if (state.fontIconTabsIndex === 1) state.fontIconPrefix = `${v}`
      emit('get', state.fontIconPrefix)
      emit('update:modelValue', state.fontIconPrefix)
    }
    const onClearFontIcon = () => {
      state.fontIconPrefix = ''
      emit('clear', state.fontIconPrefix)
      emit('update:modelValue', state.fontIconPrefix)
    }
    onMounted(() => {
      initFontIconData()
      initResize()
      getInputWidth()
    })
    watch(
      () => props.modelValue,
      () => {
        initModeValueEcho()
      }
    )
    return {
      inputWidthRef,
      fontIconSheetsFilterList,
      onColClick,
      onClearFontIcon,
      onIconBlur,
      ...toRefs(state)
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-selector {
  width: 100%;
  :deep(.el-input-group__prepend) {
    cursor: pointer;
  }
  :deep(.el-input__inner::selection) {
    background-color: transparent;
  }
}
.icon-selector-wrap {
  .icon-selector-wrap-row {
    margin-top: 5px;
    height: 225px;
    .icon-selector-wrap-item {
      text-align: center;
      font-size: 16px;
    }
  }
}
</style>
