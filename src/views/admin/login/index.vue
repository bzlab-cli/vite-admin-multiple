<template>
  <div class="container">
    <div class="title-content">
      <div class="title-box">
        <img class="logo-img" :src="logo" />
        <span class="name">{{ companyName }}</span>
      </div>
    </div>
    <div class="content">
      <div class="login-top">
        <div class="login-title">
          <span class="logo-name">{{ welcomeName }}</span>
        </div>
        <div class="logo-bd" />
        <div class="login-desc">{{ systemTitle }}</div>
      </div>
      <div class="login-main">
        <el-form ref="formRef" :model="form" :rules="rules" autocomplete="on" label-position="left">
          <el-form-item prop="account">
            <div class="input-box">
              <el-input
                v-model="form.account"
                placeholder="请输入手机号"
                maxlength="11"
                clearable
                v-input-int
                name="account"
                :prefix-icon="User"
                autocomplete="on"
              />
            </div>
          </el-form-item>
          <el-form-item prop="password">
            <div class="input-box">
              <el-input
                v-model="form.password"
                placeholder="请输入密码"
                name="password"
                type="password"
                clearable
                maxlength="12"
                autocomplete="on"
                :prefix-icon="Lock"
                @keyup.enter="handleLogin"
              />
            </div>
          </el-form-item>
          <el-form-item class="login-btn">
            <el-button :loading="loading" type="primary" class="submit" @click.prevent="handleLogin">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="footer">
      <div class="desc">
        <img class="icon" :src="logo" />
        <span>{{ footer }}</span>
        <a class="beian" href="https://beian.miit.gov.cn" target="_blank">{{ beian }}</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/views/admin/store/modules/user'
import { User, Lock } from '@element-plus/icons-vue'
import { mobileReg } from '@/utils/rules'
import { Settings } from '@/config/settings'

const validateAccount = (rule: any, value: string, callback: any) => {
  if (!value) {
    return callback(new Error('请输入手机号'))
  }
  if (!mobileReg.test(value)) {
    return callback(new Error('请输入正确的手机号'))
  }
  callback()
}

const validatePassword = (rule: any, value: string, callback: any) => {
  if (!value) {
    return callback(new Error('请输入密码'))
  }
  if (value.length < 6) {
    return callback(new Error('密码最少6位'))
  }
  callback()
}

const formRef = ref<any>(null)
const router = useRouter()
const userStore = useUserStore()
const companyName = ref(Settings.companyName)
const welcomeName = ref(Settings.welcomeName)
const logo = ref(Settings.logo)
const systemTitle = ref(Settings.systemTitle)
const footer = ref(Settings.footer)
const beian = ref(Settings.beian)
const state = reactive({
  form: {
    account: '',
    password: ''
  },
  rules: {
    account: [
      { validator: validateAccount, trigger: 'change' },
      { required: true, len: 11, message: '手机号不能为空且必须为11位', trigger: 'blur' },
      { pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, message: '手机号格式不对', trigger: 'change' }
    ],
    password: [
      { required: true, message: '密码不能为空', trigger: 'blur' },
      { validator: validatePassword, trigger: 'blur' },
      { min: 6, max: 12, message: '密码必须是6到12位', trigger: 'blur' }
    ]
  },
  loading: false
})

const handleLogin = async () => {
  await formRef.value.validate()
  state.loading = true
  try {
    await userStore.login(state.form)
    router.push('/')
  } catch (error) {
    state.loading = false
  }
}

const { form, rules, loading } = toRefs(state)
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  display: flex;
  font-family: Microsoft YaHei;
  .title-content {
    font-weight: bold;
    color: var(--el-color-primary);
    position: relative;
    width: 60%;
    height: 100%;
    background-image: url('/images/login/bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    .title-box {
      left: 37px;
      top: 37px;
      position: absolute;
      display: flex;
      align-items: center;
      .logo-img {
        width: 65px;
        margin-right: 10px;
      }
      .name {
        font-size: 40px;
      }
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20vh;
    width: 40%;
    .login-top {
      display: flex;
      flex-direction: column;
      align-items: center;
      .login-title {
        font-weight: 600;
        font-size: 33px;
        display: flex;
        align-items: center;
        justify-content: center;
        .logo-name {
          // font-family: Microsoft YaHei;
          font-weight: bold;
          font-size: 44px;
          color: var(--el-color-primary);
        }
      }
      .logo-bd {
        margin: 13px 0 67px 0;
        width: 91px;
        height: 5px;
        background: var(--el-color-primary);
        border-radius: 3px;
        opacity: 0.1;
      }
      .login-desc {
        // font-family: Microsoft YaHei;
        font-weight: bold;
        font-size: 40px;
        color: var(--el-color-primary);
        margin-bottom: 54px;
      }
    }
    .login-main {
      :deep(.el-input__inner) {
        -webkit-appearance: none;
        height: 32px;
        line-height: 32px;
        &:-webkit-autofill {
          box-shadow: 0 0 0 1000px #ffffff inset !important;
          -webkit-text-fill-color: #333333 !important;
        }
      }
      .login-btn {
        width: 440px;
        white-space: nowrap;
        margin-top: 50px;
        :deep(.el-button) {
          width: 100%;
          height: 54px;
          // font-family: Microsoft YaHei;
          font-weight: bold;
          font-size: 26px;
          color: #ffffff;
        }
      }
      .input-box {
        width: 440px;
        min-width: 440px;
        height: 50px;
        background: #f2f5f9;
        border-radius: 6px;
        display: flex;
        align-items: center;
        :deep(.el-input__prefix) {
          background: var(--el-color-primary);
          width: 50px;
          justify-content: center;
          font-size: 24px;
          color: #fff;
          text-align: center;
          border-top-left-radius: 6px;
          border-bottom-left-radius: 6px;
        }
        :deep(.el-input) {
          height: 100%;
        }
        :deep(.el-input__prefix-inner .el-input__icon) {
          margin-right: 0;
        }
        img {
          width: 70px;
          height: 100%;
        }
        :deep(.el-input__wrapper) {
          box-shadow: none;
          background: #f2f5f9;
          padding-left: 0;
        }
        :deep(.el-input__inner) {
          box-shadow: 0 0 0 1000px #f2f5f9 inset !important;
          padding-left: 5px;
        }
      }
    }
  }
  .footer {
    text-align: center;
    color: rgba(0, 0, 0, 0.65);
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    padding: 24px 50px;
    .icon {
      width: 30px;
      margin-right: 3px;
      vertical-align: middle;
    }
    .desc {
      font-size: 14px;
      margin-top: 5px;
    }
    .beian {
      display: block;
    }
  }
}
</style>
