<template>
  <div class="navbar">
    <img src="@/assets/images/home/logo.png" class="logo-img" @click="goHome" />
  </div>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/views/admin/store/modules/app'
import { useUserStore } from '@/views/admin/store/modules/user'

export default {
  setup() {
    const appStore = useAppStore()
    const userStore = useUserStore()
    const route = useRoute()
    const router = useRouter()
    const sidebar = computed(() => {
      return appStore.sidebar
    })
    const device = computed(() => {
      return appStore.device.toString()
    })
    const name = computed(() => {
      return userStore.name
    })
    const avatar = computed(() => {
      return userStore.avatar
    })
    const state = reactive({
      toggleSidebar: () => {
        appStore.toggleSidebar(false)
      },
      logOut: () => {
        userStore.loginOut()
        router.push(`/login`).catch(err => {
          console.warn(err)
        })
      }
    })

    function goHome() {
      window.location.href = '/'
    }

    return {
      sidebar,
      device,
      name,
      avatar,
      ...toRefs(state),
      goHome
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 80px;
  overflow: hidden;
  position: relative;
  background: rgba(21, 26, 37, 1);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  .logo-img {
    position: absolute;
    top: 0.5rem /* 40/80 */;
    left: 0.5rem /* 40/80 */;

    cursor: pointer;
  }

  .navbar-title {
    width: 100%;
  }

  .title {
    width: 420px;
    height: 39px;
    font-size: 30px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    background-image: -webkit-linear-gradient(right, #95989d 0%, #ffffff 50%, #95989d 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
</style>
