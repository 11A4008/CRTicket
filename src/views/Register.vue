<template>
  <div>
    <el-container style="height: 100vh">
      <el-header class="top-header">
        <el-avatar src="Picture1.png" />
        <h2>Sam-Lab CR Ticket Maker</h2>
        <el-button class="user-top-right" @click="goToHistory()">
          <el-icon><User /></el-icon>历史记录
        </el-button>
      </el-header>
      <el-main>
        <div class="login-section">
          <!-- 登录框 -->
          <div class="login-container">
            <h2>用户注册</h2>
            <form id="registerForm" @submit.prevent="handleSubmit">
              <div class="input-group">
                <label for="username">账号</label>
                <input type="text" id="username" v-model="username" required>
              </div>
              <div class="input-group">
                <label for="password1">密码</label>
                <input type="password" id="password1" v-model="password1" required>
              </div>
              <div class="input-group">
                <label for="password2">确认密码</label>
                <input type="password" id="password2" v-model="password2" required>
              </div>
              <div class="input-group">
                <label for="captchaInput">验证码</label>
                <div class="captcha-group">
                  <input type="text" id="captchaInput" v-model="captchaInput" required>
                  <!-- 使用 ref 获取 captchaImage -->
                  <img ref="captchaImage" alt="点击刷新验证码" @click="refreshCaptcha">
                </div>
              </div>
              <div class="button-group">
                <button type="submit" class="btn btn-login">注册</button>
                <button type="button" class="btn btn-register" @click="goToLogin">返回登录界面</button>
              </div>
            </form>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { User } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import {onMounted, ref} from "vue";
import { ElMessage } from 'element-plus';
import api from "@/api.js";

const router = useRouter();
const goToHistory = () => {
  router.push('/history');
};
const goToLogin = () => {
  router.push('/login');
}

const username = ref('');
const password1 = ref('');
const password2 = ref('');
const captchaInput = ref('');
let currentCaptcha = "";

// 通过 ref 获取 captchaImage 元素
const captchaImage = ref(null);

// 生成并显示验证码
function generateCaptcha() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 5 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
}

function drawCaptcha(code) {
  const canvas = document.createElement("canvas");
  canvas.width = 100;
  canvas.height = 40;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#f2f2f2";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "20px Arial";
  ctx.fillStyle = "#333";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText(code, canvas.width / 2, canvas.height / 2);
  return canvas.toDataURL("image/png");
}

function refreshCaptcha() {
  currentCaptcha = generateCaptcha();
  // 通过 ref 更新 src 属性
  if (captchaImage.value) {
    captchaImage.value.src = drawCaptcha(currentCaptcha);
  }
}

function handleSubmit(e) {
  e.preventDefault();
  const inputCode = captchaInput.value.trim().toUpperCase();
  if (inputCode !== currentCaptcha) {
    ElMessage.error("验证码错误，请重新输入！");
    refreshCaptcha();
    return;
  }

  // 验证密码一致性
  if (password1.value !== password2.value) {
    ElMessage.error("两次密码不一致！");
    return;
  }

  // 发送注册请求
  api.post("/user/register", { username: username.value, password: password1.value })
      .then(response => {
        if (response.data.success) {
          ElMessage.success("注册成功！");
          window.location.href = "/login";
        } else {
          ElMessage.error(response.data.message || "注册失败，请重试");
        }
      })
      .catch(err => {
        console.error(err);
        ElMessage.error("请求失败，请检查网络");
      });
}

onMounted(() => {
  refreshCaptcha();
});
</script>

<style>
@import "../assets/styles/Login.css";
</style>