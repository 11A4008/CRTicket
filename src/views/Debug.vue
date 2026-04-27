<script setup>
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import {computed} from "vue";

const userStore = useUserStore()
const router = useRouter()

const goToHistory = () => {
  router.push('/history')
}

const loginValue = computed({
  get: () => userStore.isLogin,
  set: (val) => userStore.setLogin(val)
})
</script>

<template>
  <h1>登录状态调试</h1>

  <el-switch
      v-model="loginValue"
      size="large"
  />

  <el-button @click="goToHistory">
    历史记录
  </el-button>
</template>