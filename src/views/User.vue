<template>
  <div class="user-page">
    <el-container class="user-layout">
      <el-header class="top-header">
        <el-avatar src="Picture1.png" />
        <h2>Sam-Lab CR Ticket Maker</h2>
      </el-header>
      <el-container>
        <el-aside width="220px" class="user-sidebar">
          <el-space direction="vertical" fill style="width: 100%">
            <el-button size="large" @click="goHome()">车票生成</el-button>
            <el-button size="large" @click="goHistory()">车票历史</el-button>
            <el-button size="large" type="primary">账户管理</el-button>
          </el-space>
        </el-aside>
        <el-main class="user-main">
          <section class="user-title-wrap">
            <div class="title-content">
              <div>
                <h1>账户设置</h1>
                <p>修改头像、用户名、密码，删除账户</p>
              </div>
              <el-button type="danger" @click="openDeleteDialog">
                <el-icon><Delete /></el-icon>
                删除账户
              </el-button>
            </div>
          </section>

          <div class="user-content-grid">
            <el-card class="avatar-card" shadow="hover">
              <template #header>
                <span>头像</span>
              </template>
              <div class="avatar-area">
                <el-avatar shape="square" :size="180" src="Picture1.png" />
                <el-button size="large" type="primary" disabled>更改头像（暂未开放）</el-button>
              </div>
            </el-card>

            <el-card class="profile-card" shadow="hover">
              <template #header>
                <span>个人信息</span>
              </template>
              <el-form label-position="top" class="profile-form" @submit.prevent>
                <el-form-item label="修改用户名（可选）">
                  <el-input v-model="newUsername" placeholder="输入新的用户名" size="large" clearable />
                </el-form-item>
                <el-form-item label="修改密码（可选）">
                  <el-input v-model="newPassword" type="password" show-password placeholder="输入新的密码" size="large" clearable />
                </el-form-item>
                <el-form-item label="重复密码">
                  <el-input v-model="repeatPassword" type="password" show-password placeholder="重复新的密码" size="large" clearable />
                </el-form-item>
                <el-form-item label="验证码">
                  <div class="captcha-group">
                    <el-input-otp v-model="captchaInput" :length="5" size="large"/>
                    <img ref="captchaImage" alt="点击刷新验证码" @click="refreshCaptcha" />
                  </div>
                </el-form-item>
                <el-button size="large" type="success" :loading="saving" @click="saveProfile">保存更改</el-button>
              </el-form>
            </el-card>
          </div>

          <el-dialog v-model="deleteDialogVisible" title="删除账户" width="450px" :close-on-click-modal="false">
            <el-alert
              title="删除账户后，所有数据将被永久清除且无法恢复"
              type="error"
              :closable="false"
              show-icon
              style="margin-bottom: 20px;"
            />
            <el-form label-position="top" @submit.prevent>
              <el-form-item label="密码验证">
                <el-input
                  v-model="deletePassword"
                  type="password"
                  show-password
                  placeholder="请输入当前密码"
                  size="large"
                  clearable
                />
              </el-form-item>
              <el-form-item label="验证码">
                <div class="captcha-group">
                  <el-input-otp v-model="deleteCaptchaInput" :length="5" size="large"/>
                  <img ref="deleteCaptchaImage" alt="点击刷新验证码" @click="refreshDeleteCaptcha" />
                </div>
              </el-form-item>
            </el-form>
            <template #footer>
              <el-button @click="deleteDialogVisible = false">取消</el-button>
              <el-button type="danger" :loading="deleting" @click="handleDeleteAccount">确认删除</el-button>
            </template>
          </el-dialog>

          <el-card class="coming-soon-card" shadow="never">
            <h3>个人运转数据</h3>
            <p>开发中</p>
          </el-card>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import {useRouter} from "vue-router";
import {onMounted, ref, nextTick} from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Delete } from "@element-plus/icons-vue";
import api from "@/api.js";
import { drawCaptcha, generateCaptcha } from "@/utils/captcha.js";

const router = useRouter()
const goHome = () => {
  router.push('/')
}
const goHistory = () => {
  router.push('/history')
}

const newUsername = ref('')
const newPassword = ref('')
const repeatPassword = ref('')
const captchaInput = ref('')
const captchaImage = ref(null)
const saving = ref(false)
let currentCaptcha = ""

const deletePassword = ref('')
const deleteCaptchaInput = ref('')
const deleteCaptchaImage = ref(null)
const deleteDialogVisible = ref(false)
const deleting = ref(false)
let deleteCurrentCaptcha = ""

function openDeleteDialog() {
  deletePassword.value = ''
  deleteCaptchaInput.value = ''
  deleteDialogVisible.value = true
  nextTick(() => {
    refreshDeleteCaptcha()
  })
}

function refreshCaptcha() {
  currentCaptcha = generateCaptcha();
  if (captchaImage.value) {
    captchaImage.value.src = drawCaptcha(currentCaptcha);
  }
}

function refreshDeleteCaptcha() {
  deleteCurrentCaptcha = generateCaptcha();
  if (deleteCaptchaImage.value) {
    deleteCaptchaImage.value.src = drawCaptcha(deleteCurrentCaptcha);
  }
}

async function saveProfile() {
  const inputCode = captchaInput.value.trim().toUpperCase();
  if (inputCode !== currentCaptcha) {
    ElMessage.error("验证码错误，请重新输入！");
    refreshCaptcha();
    return;
  }

  const username = newUsername.value.trim();
  const password = newPassword.value.trim();
  const repeat = repeatPassword.value.trim();

  if (!username && !password) {
    ElMessage.warning("请至少填写一个修改项");
    return;
  }

  if (password && password !== repeat) {
    ElMessage.error("两次输入的新密码不一致");
    return;
  }

  const userRaw = localStorage.getItem("user");
  if (!userRaw) {
    ElMessage.error("登录状态失效，请重新登录");
    router.push("/login");
    return;
  }

  let user;
  try {
    user = JSON.parse(userRaw);
  } catch (e) {
    ElMessage.error("用户信息读取失败，请重新登录");
    router.push("/login");
    return;
  }

  try {
    saving.value = true;
    const response = await api.post("/user/update-profile", {
      id: user.id,
      username: username || undefined,
      password: password || undefined
    });

    if (response.data.success) {
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      ElMessage.success("个人信息修改成功");
      newUsername.value = "";
      newPassword.value = "";
      repeatPassword.value = "";
      captchaInput.value = "";
      refreshCaptcha();
      return;
    }

    ElMessage.error(response.data.message || "修改失败，请稍后重试");
  } catch (err) {
    console.error(err);
    ElMessage.error("请求失败，请检查网络");
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  refreshCaptcha();
  refreshDeleteCaptcha();
})

async function handleDeleteAccount() {
  const inputCode = deleteCaptchaInput.value.trim().toUpperCase();
  if (inputCode !== deleteCurrentCaptcha) {
    ElMessage.error("验证码错误，请重新输入！");
    refreshDeleteCaptcha();
    return;
  }

  const password = deletePassword.value.trim();
  if (!password) {
    ElMessage.warning("请输入当前密码");
    return;
  }

  const userRaw = localStorage.getItem("user");
  if (!userRaw) {
    ElMessage.error("登录状态失效，请重新登录");
    router.push("/login");
    return;
  }

  let user;
  try {
    user = JSON.parse(userRaw);
  } catch (e) {
    ElMessage.error("用户信息读取失败，请重新登录");
    router.push("/login");
    return;
  }

  try {
    deleting.value = true;
    // 先验证密码
    const response = await api.post("/user/delete-account", {
      id: user.id,
      password: password,
      captcha: inputCode
    });

    if (!response.data.success) {
      ElMessage.error(response.data.message || "验证失败，请稍后重试");
      refreshDeleteCaptcha();
      return;
    }

    // 验证码和密码通过后，弹出最终警告确认
    try {
      await ElMessageBox.confirm(
        "此操作将永久删除您的账户及所有数据，且不可恢复！确定要继续吗？",
        "危险操作确认",
        {
          confirmButtonText: "确认删除",
          cancelButtonText: "取消",
          type: "error",
          confirmButtonClass: "el-button--danger"
        }
      );
    } catch {
      // 用户取消操作
      deleting.value = false;
      return;
    }

    // 用户确认后执行删除
    const deleteResponse = await api.post("/user/confirm-delete", {
      id: user.id
    });

    if (deleteResponse.data.success) {
      ElMessage.success("账户已删除");
      localStorage.removeItem("user");
      localStorage.removeItem("login");
      deleteDialogVisible.value = false;
      router.push("/");
      return;
    }

    ElMessage.error(deleteResponse.data.message || "删除失败，请稍后重试");
  } catch (err) {
    console.error(err);
    ElMessage.error("请求失败，请检查网络");
  } finally {
    deleting.value = false;
  }
}

</script>


<style scoped>
.user-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at 8% 10%, rgba(255, 186, 73, 0.22), transparent 40%),
    radial-gradient(circle at 92% 92%, rgba(61, 162, 255, 0.2), transparent 42%),
    linear-gradient(160deg, #f6f8fb 0%, #eef3ff 100%);
}

.user-layout {
  min-height: 100vh;
}

.user-sidebar {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(8px);
  border-right: 1px solid rgba(15, 23, 42, 0.08);
  padding: 20px;
}

.user-main {
  padding: 28px;
}

.user-title-wrap {
  margin-bottom: 20px;
}

.title-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.title-content h1 {
  margin: 0 0 8px;
  font-size: 32px;
  color: #17324d;
}

.title-content p {
  margin: 0;
  color: #5f6f81;
}

.user-content-grid {
  margin-top: 20px;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 20px;
}

.avatar-card,
.profile-card,
.coming-soon-card {
  border-radius: 16px;
}

.avatar-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

.profile-form :deep(.el-form-item) {
  margin-bottom: 14px;
}

.captcha-group {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 20%;
}

.captcha-group img {
  cursor: pointer;
  height: 40px;
  border-radius: 6px;
}

.coming-soon-card {
  margin-top: 20px;
  background: rgba(255, 255, 255, 0.4);
}

.coming-soon-card h3 {
  margin: 0 0 8px;
}

.coming-soon-card p {
  margin: 0;
  color: #6b7785;
}

@media (max-width: 900px) {
  .user-content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
