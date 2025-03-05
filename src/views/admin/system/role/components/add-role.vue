<template>
  <el-dialog custom-class="add-role" v-model="dialogVisible" width="500px" @close="onDestroy">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="form.roleName" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="form.remarks" maxlength="50" placeholder="请输入" clearable />
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
import { addRole, updateRole } from '@/api/auth/role'
import { ElMessage } from 'element-plus'

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

const form = reactive({
  roleName: null,
  remarks: null
})

const rules = reactive({
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
})

const handleSubmit = async () => {
  await formRef.value.validate()
  let reqBody = {
    id: isAdd ? undefined : rowData.id,
    remarks: form.remarks,
    roleName: form.roleName
  } as any

  let { retCode, retMsg } = isAdd ? await addRole(reqBody) : await updateRole(reqBody)
  if (retCode !== 200) return ElMessage.warning(retMsg)
  dialogVisible.value = false
  callback!()
}

const onMounted = async () => {
  if (!isAdd) {
    form.roleName = rowData.roleName
    form.remarks = rowData.remarks
  }
}

onMounted()
</script>
