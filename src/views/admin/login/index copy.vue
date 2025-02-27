<template>
  <div class="container">
    <div class="content">
      <div class="login-top">
        <div class="login-title">
          <img class="logo-img" :src="logo" />
          <span class="logo-name">{{ title }}</span>
        </div>
        <div class="login-desc">{{ desc }}</div>
      </div>
      <div class="login-main">
        <el-form ref="formRef" :model="form" :rules="rules" autocomplete="on" label-position="left">
          <el-form-item prop="account">
            <el-input
              v-model="form.account"
              maxlength="11"
              :placeholder="login.account"
              name="account"
              :prefix-icon="User"
              autocomplete="on"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              :placeholder="login.password"
              name="password"
              :prefix-icon="Lock"
              autocomplete="on"
              @keyup.enter="handleLogin"
            />
          </el-form-item>
          <el-form-item class="login-btn">
            <el-button :loading="loading" type="primary" class="submit" @click.prevent="handleLogin">
              {{ login.logIn }}
            </el-button>
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
const logo = ref(Settings.logo)
const title = ref(Settings.title)
const desc = ref(Settings.desc)
const footer = ref(Settings.footer)
const beian = ref(Settings.beian)
const state = reactive({
  login: {
    title: '管理平台',
    logIn: '登录',
    account: '请输入手机号',
    password: '请输入密码'
  },
  form: {
    account: '',
    password: ''
  },
  rules: {
    account: [{ validator: validateAccount, trigger: 'change' }],
    password: [{ validator: validatePassword, trigger: 'blur' }]
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

const { login, form, rules, loading } = toRefs(state)
</script>

<style lang="scss" scoped>
.container {
  background-image: url('/images/login/bg.svg');
  background-repeat: no-repeat;
  background-position: center 110px;
  background-size: 100%;
  height: 100vh;
  .content {
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    .login-top {
      text-align: center;
      .login-title {
        font-weight: 600;
        font-size: 33px;
        display: flex;
        align-items: center;
        justify-content: center;
        .logo-name {
          color: #3a3939;
        }
        .logo-img {
          width: 35px;
          margin-right: 5px;
          margin-top: 2px;
        }
      }
      .login-desc {
        margin-top: 12px;
        margin-bottom: 40px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
      }
    }
    .login-main {
      width: 345px;
      margin: 0 auto;
      .ant-form-item {
        margin-bottom: 30px;
      }
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
        width: 100%;
        white-space: nowrap;
        :deep(.el-button) {
          width: 100%;
          height: 34px;
        }
      }
    }
  }
  .footer {
    text-align: center;
    color: rgba(0, 0, 0, 0.85);
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
      color: #666;
    }
  }
}
</style>
