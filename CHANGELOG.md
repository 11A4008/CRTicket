# 更新日志

## 版本：260606

### 功能更新

#### 新增功能：月度运转日历热力图

在账户设置页面的"个人运转数据"区域新增日历热力图，可视化展示每月的运转时间分布。

**改动详情**

##### 前端 (`src/views/User.vue`)

**新增组件：**
- `el-row` + `el-col`：日历区块布局
- `el-date-picker`：月份选择器，支持切换不同月份
- `div.calendar-wrapper`：日历图容器

**新增变量：**
- `calendarChartRef` - 日历图表 DOM 引用
- `selectedMonth` - 当前选中的月份（格式：YYYY-MM）
- `monthlyData` - 月度车票数据

**新增函数：**
- `loadMonthlyData()` - 加载指定月份的运转数据
- `renderCalendarChart()` - 渲染日历热力图

**图表配置：**
- 类型：`heatmap`（热力图）
- 坐标系：`calendar`（日历坐标系）
- 颜色范围：浅灰 → 蓝 → 绿 → 黄 → 红
- 标签显示：每个格子显示对应日期数字
- 交互：鼠标悬停显示运转次数

##### 后端 (`server/routes/user.js`)

**新增 API：**

`GET /api/user/monthly-tickets`
- 功能：按年月查询用户的运转日期分布
- 参数：`userId`, `year`, `month`
- 返回：该月份每天的运转次数统计

##### 布局调整

- 最常到达站点柱状图：全宽显示
- 城市饼图 + 日历热力图：并排显示（各占一半宽度）

---

#### 新增功能：删除账户按钮

在账户设置页面右上角添加了删除账户功能。

### 改动详情

#### 前端 (`src/views/User.vue`)

**界面改动：**
- 在"账户设置"页面标题区域右上角添加红色"删除账户"按钮
- 点击按钮后弹出对话框，要求输入密码和验证码进行验证
- 恢复为原来的两列布局（头像卡片 + 个人信息卡片）

**新增组件：**
- `el-dialog`：删除账户确认弹窗
- `el-alert`：删除警告提示
- `el-button type="danger"`：删除账户按钮
- `el-input`：密码输入框
- `el-input-otp`：验证码输入框

**新增变量：**
- `deletePassword` - 删除用密码
- `deleteCaptchaInput` - 删除用验证码
- `deleteCaptchaImage` - 验证码图片 DOM 引用
- `deleteDialogVisible` - 删除弹窗显示状态
- `deleting` - 删除操作加载状态
- `deleteCurrentCaptcha` - 删除用验证码答案

**新增函数：**
- `refreshDeleteCaptcha()` - 刷新删除用验证码图片
- `openDeleteDialog()` - 打开删除弹窗并刷新验证码
- `handleDeleteAccount()` - 处理删除账户流程

#### 后端 (`server/routes/user.js`)

**新增 API：**

1. `POST /api/user/delete-account`
   - 功能：验证用户密码是否正确
   - 参数：`id`, `password`
   - 返回：验证结果

2. `POST /api/user/confirm-delete`
   - 功能：确认删除用户及其所有关联数据
   - 参数：`id`
   - 操作：先删除用户的所有车票记录，再删除用户账户

### 删除账户流程

1. 用户点击右上角"删除账户"红色按钮
2. 弹出对话框，显示警告提示
3. 用户输入当前密码 + 验证码
4. 点击"确认删除"按钮
5. 后端验证密码是否正确
6. 验证通过后，弹出最终警告确认框（`ElMessageBox.confirm`）
7. 用户再次确认后，执行删除操作
8. 删除用户及其所有关联车票
9. 清空本地存储，跳转到首页

### 修复的问题

- 修复了弹窗打开时验证码图片无法显示的问题（使用 `nextTick` 等待 DOM 渲染完成）

### 技术说明

- 验证码图片复用现有的 `generateCaptcha` 和 `drawCaptcha` 工具函数
- 删除操作采用两步验证：先验证密码，再确认删除
- 用户数据删除包括：`users` 表中的用户记录 + `tickets` 表中该用户的所有车票
