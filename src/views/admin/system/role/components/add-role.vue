<template>
  <el-dialog custom-class="add-role" v-model="dialogVisible" width="500px" @close="onDestroy">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="form.roleName" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="组织">
        <tree-select v-model="form.orgId" :list="treeSelectList" @tree-select="handleTreeSelect" style="width: 100%" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio-button :label="0">启用</el-radio-button>
          <el-radio-button :label="1">禁用</el-radio-button>
        </el-radio-group>
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
import { getOrgSelect2 } from '@/api/auth/org'
import { ElMessage } from 'element-plus'
import treeSelect from '@/components/tree-select/index.vue'
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
  orgId: 0,
  roleName: null,
  status: 0,
  remarks: null
})

const rules = reactive({
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
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

const onMounted = async () => {
  await fetchOrgList()
  if (!isAdd) {
    form.status = rowData.status
    form.orgId = rowData.orgId
    form.roleName = rowData.roleName
    form.remarks = rowData.remarks
  }
}

onMounted()

const handleTreeSelect = data => {
  form.orgId = data.id
}

const handleSubmit = async () => {
  formRef.value.validate(async valid => {
    if (!valid) return
    let reqBody = {
      id: isAdd ? undefined : rowData.id,
      orgId: form.orgId,
      status: form.status,
      remarks: form.remarks,
      roleName: form.roleName
    } as any

    let { retCode, retMsg } = isAdd ? await addRole(reqBody) : await updateRole(reqBody)
    if (retCode !== 200) return ElMessage.warning(retMsg)
    dialogVisible.value = false
    callback!()
  })
}
</script>
