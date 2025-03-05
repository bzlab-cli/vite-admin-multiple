<template>
  <el-dialog custom-class="add-user" v-model="dialogVisible" width="500px" @close="onDestroy">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="form.userName" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="角色" prop="roleId">
        <el-select v-model="form.roleId" placeholder="请选择" clearable style="width: 100%">
          <el-option :value="item.id" :label="item.roleName" v-for="(item, i) in roleList" :key="i" />
        </el-select>
      </el-form-item>
      <el-form-item label="组织" prop="orgId">
        <el-select v-model="form.orgId" placeholder="请选择" clearable style="width: 100%">
          <el-option :value="item.key" :label="item.value" v-for="(item, i) in treeSelectList" :key="i" />
        </el-select>
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
import { addUser, updateUser, getUser } from '@/api/auth/user'
import { ElMessage } from 'element-plus'
import { getRoleSelect2 } from '@/api/auth/role'
import { getOrgSelect2 } from '@/api/auth/org'

interface DialogProps {
  title?: string
  isAdd?: boolean
  rowData?: any
  callback?: () => Promise<any>
}

defineProps(['onDestroy'])

const { isAdd, rowData, callback } = useAttrs() as DialogProps
const dialogVisible = ref(true)
const roleList = ref<any>([])
const treeSelectList = ref<any>([])
const formRef = ref<any>(null)

const form = reactive({
  userName: null,
  phone: null,
  roleId: null,
  orgId: null,
  password: null,
  remarks: null
})

const rules = reactive({
  userName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  roleId: [{ required: true, message: '请选择角色', trigger: 'blur' }],
  orgId: [{ required: true, message: '请选择组织', trigger: 'blur' }]
})

const fetchUser = async () => {
  const reqBody = { userId: rowData.userId }
  let { data, retCode, retMsg } = await getUser(reqBody)
  if (retCode !== 200) return ElMessage.warning(retMsg)
  for (let [key, value] of Object.entries(data)) form[key] = value
}

const fetchRoleList = async () => {
  let { data, retCode, retMsg } = await getRoleSelect2({})
  if (retCode !== 200) return ElMessage.warning(retMsg)
  roleList.value = data
}

const fetchOrgList = async () => {
  const reqBody = { orgLevel: 1, parentId: 0 }
  let { data, retCode, retMsg } = await getOrgSelect2(reqBody)
  if (retCode !== 200) return ElMessage.warning(retMsg)
  treeSelectList.value = data ?? []
}

const handleSubmit = async () => {
  await formRef.value.validate()
  const reqBody = {
    userId: isAdd ? undefined : rowData.userId,
    account: form.phone,
    userName: form.userName,
    phone: form.phone,
    roleId: form.roleId,
    orgId: form.orgId,
    remarks: form.remarks
  }

  const { retCode, retMsg } = isAdd ? await addUser(reqBody) : await updateUser(reqBody)
  if (retCode !== 200) return ElMessage.warning(retMsg)
  dialogVisible.value = false
  callback!()
}

const onMounted = async () => {
  await fetchRoleList()
  await fetchOrgList()
  if (!isAdd) {
    await fetchUser()
  }
}

onMounted()
</script>
