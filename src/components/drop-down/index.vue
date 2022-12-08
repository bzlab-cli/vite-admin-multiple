<template>
  <div>
    <el-autocomplete
      clearable
      :maxlength="props.max"
      v-model="value"
      @change="handleChange"
      @input="handleInput"
      :fetch-suggestions="requestList"
      :trigger-on-focus="true"
      :placeholder="placeholder"
      :disabled="disabled"
      @select="handleSelect"
      @clear="handleClear"
      ref="ipt"
    />
  </div>
</template>
<script lang="ts" setup name="dropdown">
import { ElAutocomplete } from 'element-plus'
import axios from '@/utils/axios'
import { ref, watch } from 'vue'
import type { Method } from 'axios'
const value = ref(null) as any

interface IRequest {
  url: string
  params: IObjModel
  methods: string
  key?: string
  requestKey?: string
}
const props = defineProps({
  modelValue: {
    type: String,
    default: () => ''
  },
  //请求参数
  request: {
    type: Object,
    required: true
  },
  //默认提示语
  placeholder: {
    type: String,
    default: '请输入'
  },
  //是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  max: {
    type: Number,
    default: 50
  }
})
async function requestList(str: string, callback: Function) {
  let request = props.request as IRequest
  let method = (request.methods || 'get') as Method
  request.params[request.requestKey as string] = str
  let { retCode, data } = await axios.request<IResponseModel<any>>({
    url: request.url,
    method: method,
    params: request.params
  })
  if (retCode !== 200) return callback([])
  if (data && data.length) {
    if (request.key) {
      //如果后端的参数名字就是value则不需要再做处理，反之则需要处理
      data.map((m: any) => {
        m.value = m[request.key as string]
      })
    }
    callback(data)
  } else {
    callback([])
  }
}
watch(
  () => props.modelValue,
  newValue => {
    value.value = newValue
  },
  { immediate: true }
)
// 声明事件
const emit = defineEmits(['update:modelValue', 'response', 'handleInput'])
function handleSelect(item: IObjModel) {
  let obj = { item, props }
  emit('response', obj)
}
function handleChange(e) {
  if (!e) {
    emit('update:modelValue', null)
  } else {
    emit('update:modelValue', e)
  }
}
function handleInput(e) {
  emit('update:modelValue', e || null)
}

function handleClear() {
  emit('update:modelValue', null)
  emit('response', null)
}
</script>
