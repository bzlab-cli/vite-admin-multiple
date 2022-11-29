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
      <el-form-item label="专业">
        <el-select v-model="form.professional" placeholder="请选择" clearable style="width: 100%">
          <el-option :value="item.value" :label="item.name" v-for="(item, i) in professionalSelectList" :key="i" />
        </el-select>
      </el-form-item>
      <el-form-item label="所属组织" prop="orgId" v-if="form.roleId !== 'ad'">
        <tree-select v-model="form.orgId" :list="treeSelectList" @tree-select="handleTreeSelect" style="width: 100%" />
      </el-form-item>
      <el-form-item label="权限" prop="competenceIds">
        <el-select v-model="form.competenceIds" multiple placeholder="请选择" clearable style="width: 100%">
          <el-option :value="item.id" :label="item.competenceName" v-for="(item, i) in competenceList" :key="i" />
        </el-select>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="密码" prop="password" v-if="isAdd">
        <el-input v-model="form.password" placeholder="请输入" clearable />
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
import treeSelect from '@/components/tree-select/index.vue'
import { addUser, updateUser, getCompetence, getUser } from '@/api/auth/user'
import { ElMessage } from 'element-plus'
import { getRoleSelect2 } from '@/api/auth/role'
import { getOrgSelect2 } from '@/api/auth/org'
import { forEachTree } from '@/utils'
import { IMajorSchema, majorList } from '@/constant/major'

interface DialogProps {
  title?: string
  isAdd?: boolean
  rowData?: any
  callback?: () => Promise<any>
}

defineProps(['onDestroy'])

const { isAdd, rowData, callback } = useAttrs() as DialogProps
const dialogVisible = ref(true)
const roleList = ref<any[]>([])
const treeSelectList = ref([])
const competenceList = ref<any[]>([])
const formRef = ref<any>(null)
const professionalSelectList = ref<IMajorSchema[]>(majorList)

const form = reactive({
  userName: null,
  headUrl: null,
  phone: null,
  roleId: null,
  professional: null,
  orgId: null,
  competenceIds: [],
  email: null,
  password: null,
  remarks: null
})

const rules = reactive({
  userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  roleId: [{ required: true, message: '请选择角色', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
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

const fetchCompetenceList = async () => {
  const reqBody = { competenceName: '' }
  let { data, retCode, retMsg } = await getCompetence(reqBody)
  if (retCode !== 200) return ElMessage.warning(retMsg)
  competenceList.value = data
}

const fetchOrgList = async () => {
  const reqBody = { orgLevel: 1, parentId: 0 }
  let { data, retCode, retMsg } = await getOrgSelect2(reqBody)
  if (retCode !== 200) return ElMessage.warning(retMsg)
  forEachTree(data || [], item => {
    item.label = item.orgName
    item.value = item.id
  })
  treeSelectList.value = data
}

const onMounted = async () => {
  await fetchRoleList()
  await fetchOrgList()
  await fetchCompetenceList()
  if (!isAdd) {
    await fetchUser()
  }
}

onMounted()

const handleTreeSelect = data => {
  console.log('handleTreeSelect', data)
  form.orgId = data.id
}

const handleSubmit = async () => {
  formRef.value.validate(async valid => {
    if (!valid) return
    const reqBody = {
      userId: isAdd ? undefined : rowData.userId,
      account: form.phone,
      userName: form.userName,
      headUrl: form.headUrl,
      phone: form.phone,
      roleId: form.roleId,
      competenceIds: form.competenceIds,
      orgId: form.roleId !== 'ad' ? form.orgId : undefined,
      professional: form.professional,
      email: form.email,
      password: form.password,
      remarks: form.remarks
    }

    const { retCode, retMsg } = isAdd ? await addUser(reqBody) : await updateUser(reqBody)
    if (retCode !== 200) return ElMessage.warning(retMsg)
    callback!()
  })
}
</script>
