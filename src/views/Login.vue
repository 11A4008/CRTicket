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
            <h2>用户登录</h2>
            <form id="loginForm">
              <div class="input-group">
                <label for="username">账号</label>
                <input type="text" id="username" required>
              </div>
              <div class="input-group">
                <label for="password">密码</label>
                <input type="password" id="password" required>
              </div>
              <div class="input-group">
                <label for="captchaInput">验证码</label>
                <div class="captcha-group">
                  <input type="text" id="captchaInput" required>
                  <img id="captchaImage" alt="点击刷新验证码">
                </div>
              </div>
              <div class="button-group">
                <button type="submit" class="btn btn-login">登录</button>
                <button type="button" class="btn btn-register" onclick="location.href='/register'">没有账号？去注册</button>
              </div>
            </form>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import {User} from "@element-plus/icons-vue";
import {useRouter} from "vue-router";
import {ElButton} from "element-plus";
const router = useRouter()
const goToHistory = () => {
  router.push('/history')
}
</script>

<script>
window.addEventListener("DOMContentLoaded", () => {
  let currentCaptcha = "";

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
    document.getElementById("captchaImage").src = drawCaptcha(currentCaptcha);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const inputCode = document.getElementById("captchaInput").value.trim().toUpperCase();
    if (inputCode !== currentCaptcha) {
      alert("验证码错误，请重新输入！");
      refreshCaptcha();
      return;
    }
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    fetch("/receive_data_reg", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username, password })
    })
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            window.location.href = "/history";
          } else {
            alert("登录失败：" + data.message);
          }
        })
        .catch(err => console.error("请求失败", err));
  }

  refreshCaptcha();
  document.getElementById("captchaImage").addEventListener("click", refreshCaptcha);
  document.getElementById("loginForm").addEventListener("submit", handleSubmit);
});
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}
</style>


<style scoped>
@import "../assets/styles/Login.css";
</style>