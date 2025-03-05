<template>
  <el-dialog custom-class="add-org" v-model="dialogVisible" width="500px" @close="onDestroy">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
      <el-form-item label="组织名称" prop="orgName">
        <el-input v-model="form.orgName" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="排序" prop="orgSort">
        <el-input v-model="form.orgSort" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remarks" placeholder="请输入" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onDestroy">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, useAttrs } from 'vue'
import { addOrg, updateOrg, getOrgSelect2 } from '@/api/auth/org'
import { ElMessage } from 'element-plus'
import { forEachTree } from '@/utils'

interface DialogProps {
  title?: string
  isAdd?: boolean
  rowData?: any
  callback?: () => Promise<any>
}

defineProps(['onDestroy'])

const { isAdd, rowData, callback } = useAttrs() as DialogProps
const dialogVisible = ref(true)
const formRef = ref<any>(null)
const treeSelectList = ref([])

const form = reactive({
  parentId: 0,
  orgLevel: 1,
  orgName: null,
  status: 0,
  orgSort: null,
  remarks: null
})

const rules = reactive({
  orgName: [{ required: true, message: '请输入组织名称', trigger: 'blur' }],
  orgSort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
})

const fetchOrgList = async () => {
  let { data, retCode, retMsg } = await getOrgSelect2({
    orgLevel: 1,
    parentId: 0
  })
  if (retCode !== 200) return ElMessage.warning(retMsg)
  forEachTree(data || [], item => {
    item.label = item.orgName
    item.value = item.id
  })
  treeSelectList.value = data
}

const handleSubmit = async () => {
  await formRef.value.validate()
  let reqBody = {
    id: isAdd ? undefined : rowData.id,
    parentId: form.parentId,
    orgLevel: form.orgLevel,
    orgName: form.orgName,
    status: form.status,
    orgSort: form.orgSort,
    remarks: form.remarks
  }

  let { retCode, retMsg } = isAdd ? await addOrg(reqBody) : await updateOrg(reqBody)
  if (retCode !== 200) return ElMessage.warning(retMsg)
  dialogVisible.value = false
  callback!()
}

const onMounted = async () => {
  await fetchOrgList()
  if (!isAdd) {
    form.parentId = rowData.parentId
    form.orgLevel = rowData.orgLevel
    form.orgName = rowData.orgName
    form.status = rowData.status
    form.orgSort = rowData.orgSort
    form.remarks = rowData.remarks
  }
}

onMounted()
</script>
