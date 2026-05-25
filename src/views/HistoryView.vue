<template>
  <div>
    <el-container style="height: 100vh">
      <el-header class="top-header">
        <el-avatar src="Picture1.png" />
        <h2>Sam-Lab CR Ticket Maker</h2>
      </el-header>
      <el-container>
        <el-aside width="200px" style="background: #f8f9fa; padding: 20px">
          <el-space direction="vertical" fill style="width: 100%">
            <el-button size="large" @click="goHome()">车票生成</el-button>
            <el-button size="large" type="primary">车票历史</el-button>
          </el-space>

        </el-aside>
        <el-main>
          <div v-if="userStore.isLogin">
            <el-backtop :right="20" :bottom="20" />
            <el-card class="user-card">
              <div class="card-container">
                <el-button type="danger" size="large" class="signout-top-right" @click="logout()">
                  <el-icon><CloseBold /></el-icon>登出账户
                </el-button>
                <el-button type="success" size="large" class="supplement-bottom-right" @click="openCreateDialog()">
                  <el-icon><DocumentAdd /></el-icon>补登记录
                </el-button>

                <el-dialog v-model="dialogFormVisible1" :title="isEditMode ? '编辑记录' : '补登记录'" width="50%">
                  <el-form
                      :model="ticket"
                      :rules="rules"
                      ref="formRef"
                      label-width="100px"
                      label-position="left"
                  >
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="票号">
                          <el-input v-model="ticket.number" placeholder="例如：E351822734"></el-input>
                        </el-form-item>
                      </el-col>

                      <el-col :span="12">
                        <el-form-item label="车次" prop="trainNo">
                          <el-input v-model="ticket.trainNo" placeholder="例如：G25 或 1461" />
                        </el-form-item>
                      </el-col>

                      <el-col :span="12">
                        <el-form-item label="起点">
                          <el-autocomplete
                              v-model="ticket.from"
                              :fetch-suggestions="querySearch"
                              placeholder="输入站名或拼音"
                              clearable
                              @select="handleSelect('from', $event)"
                          />
                        </el-form-item>
                      </el-col>

                      <el-col :span="12">
                        <el-form-item label="终点">
                          <el-autocomplete
                              v-model="ticket.to"
                              :fetch-suggestions="querySearch"
                              placeholder="输入站名或拼音"
                              clearable
                              @select="handleSelect('to', $event)"
                          />
                        </el-form-item>
                      </el-col>

                      <el-col :span="12">
                        <el-form-item label="开车日期">
                          <el-date-picker
                              v-model="ticket.date"
                              type="date"
                              placeholder="请选择乘车日期"
                              format="YYYY/MM/DD"
                              value-format="YYYY年MM月DD日"
                          />
                        </el-form-item>
                      </el-col>

                      <el-col :span="12">
                        <el-form-item label="开车时间">
                          <el-time-picker
                              v-model="ticket.time"
                              placeholder="选择开车时间"
                              format="HH:mm"
                              value-format="HH:mm"
                          />
                        </el-form-item>
                      </el-col>

                      <el-col :span="12">
                        <el-form-item label="票价">
                          <el-input-number v-model="ticket.price" placeholder="请输入数字" :min="0" :step="0.5"></el-input-number>
                        </el-form-item>
                      </el-col>

                      <el-col :span="6">
                        <el-form-item label="使用积分">
                          <el-switch
                              v-model="credit"
                              inline-prompt
                              :active-icon="Check"
                              :inactive-icon="Close"
                          />
                        </el-form-item>
                      </el-col>

                      <el-col :span="6">
                        <el-form-item label="空调选择">
                          <el-switch
                              v-model="value3"
                              :disabled="airSwitchDisabled"
                              inline-prompt
                              :active-icon="Check"
                              :inactive-icon="Close"
                          />
                        </el-form-item>
                      </el-col>

                      <el-col :span="12">
                        <el-form-item label="席位名称">
                          <el-select v-model="ticket.seatType" placeholder="Select">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>

                      <el-col :span="12">
                        <el-form-item label="座位号">
                          <el-input v-model="ticket.seatNo" placeholder="03车12A号"></el-input>
                        </el-form-item>
                      </el-col>

                      <el-col :span="12">
                        <el-form-item label="售票地点">
                          <el-input v-model="ticket.sellPlace" placeholder="XX站"></el-input>
                        </el-form-item>
                      </el-col>

                      <el-col :span="12">
                        <el-form-item label="检票/候车位置">
                          <el-input v-model="ticket.gate" placeholder="检票：1A / 候车：一候"></el-input>
                        </el-form-item>
                      </el-col>

                      <el-col :span="12">
                        <el-form-item label="选择背景">
                          <el-select v-model="ticket.theme" placeholder="请选择主题" style="width: 240px">
                            <el-option
                                v-for="item in themeOptions"
                                :key="item.id"
                                :label="item.label"
                                :value="item.id"
                                :disabled="item.disabled"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>

                      <el-col :span="12">
                        <el-form-item label="里程">
                          <el-input-number v-model="ticket.distance" placeholder="请输入数字" :min="0"></el-input-number>
                        </el-form-item>
                      </el-col>

                      <!-- 提示语单独占一行 -->
                      <el-col :span="24">
                        <el-form-item label="提示语">
                          <el-input
                              v-model="ticket.message"
                              :rows="3"
                              type="textarea"
                              placeholder="输入提示语"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>

                  <template #footer>
                    <div class="dialog-footer">
                      <el-button @click="dialogFormVisible1 = false">Cancel</el-button>
                      <el-button type="primary" @click="saveTicket()">
                        Confirm
                      </el-button>
                    </div>
                  </template>
                </el-dialog>

                <el-avatar :size="120" src="Picture1.png" />

                <div class="card-content">
                  <h1>Hi, {{ username }}</h1>
                  <p>
                    你已经运转了
                    <span class="highlight">{{ Math.floor(tripsVal) }}</span> 次，
                    <span class="highlight">{{ Math.floor(distanceVal) }}</span> 公里，
                    共消费
                    <span class="highlight">{{ formatMoney(moneyVal) }}</span> 元！
                  </p>
                </div>
              </div>
            </el-card>

            <el-table
                :data="tableData"
                :default-sort="{ prop: 'date', order: 'descending' }"
                class="table"
                :row-style="tableRowStyle"
            >
              <el-table-column prop="date" label="日期" width="160" sortable/>
              <el-table-column prop="trainNo" label="车次" width="80" />
              <el-table-column prop="price" label="票价" width="80" sortable/>
              <el-table-column prop="from" label="起点" width="120" />
              <el-table-column prop="to" label="终点" width="120" />
              <el-table-column prop="seatType" label="席位" width="120" />
              <el-table-column prop="seatNo" label="座位" width="150" />
              <el-table-column prop="gate" label="检票/候车" width="120" />
              <el-table-column prop="number" label="票号/订单号" width="120" />
              <el-table-column label="操作" width="300">
                <template #default="scope">
                  <el-tooltip
                      content="下载车票"
                      placement="bottom"
                  >
                    <el-button type="success" @click="downloadHistoryPNG(scope.row)">
                      <el-icon><Download /></el-icon>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip
                      content="编辑记录"
                      placement="bottom"
                  >
                    <el-button @click="openEditDialog(scope.row)">
                      <el-icon><Edit /></el-icon>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip
                      content="删除记录"
                      placement="bottom"
                  >
                    <el-button type="danger" @click="deleteHistory(scope.row)">
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>

            <div class="history-download-render">
              <div ref="historyTicketRef" class="ticket-container">
                <div class="ticket-bg" :style="{ backgroundImage: `url(./${downloadTicket.theme})` }">
                  <div class="ticket-number">{{ downloadTicket.number }}</div>
                </div>

                <div class="station-block">
                  <div class="station-left">
                    <div class="station-name">{{ formatStationName(downloadTicket.from) }}<span class="small">站</span></div>
                    <div class="station-en">{{ getStationEnglish(downloadTicket.from) }}</div>
                  </div>

                  <div class="station-middle">
                    <div class="train-no">{{ downloadTicket.trainNo }}</div>
                    <div class="arrow">
                      <span class="line"></span>
                      <span class="head"></span>
                    </div>
                  </div>

                  <div class="station-right">
                    <div class="station-name">{{ formatStationName(downloadTicket.to) }}<span class="small">站</span></div>
                    <div class="station-en">{{ getStationEnglish(downloadTicket.to) }}</div>
                  </div>
                </div>

                <div class="ticket-gate">{{ downloadTicket.gate }}</div>
                <div class="date-time">{{ downloadTicket.date }}&nbsp;&nbsp; {{ downloadTicket.time }}开</div>
                <div class="price">￥{{ downloadTicket.price }}元</div>
                <div class="tip"><strong>限乘当日当次车</strong></div>
                <div class="seat">{{ downloadTicket.seatNo }}</div>
                <div class="seat-class">{{ downloadTicket.seatType }}</div>

                <div class="ticket-message">
                  <p>{{ downloadTicket.message }}</p>
                </div>

                <div class="ticket-type">{{ downloadTicket.specialTicketType }}</div>
                <div class="credit">{{ downloadTicket.useCredit }}</div>

                <div class="ticket-qrcode" v-if="downloadQrCodeUrl">
                  <img :src="downloadQrCodeUrl" alt="QR Code" />
                </div>

                <div class="sell-place">{{ downloadTicket.sellPlace }}售</div>
              </div>
            </div>
          </div>
          <div v-else>
            <el-empty :image-size="200">
              <el-button type="primary" size="large" @click="goLogin">
                <el-icon><User /></el-icon>登录
              </el-button>
            </el-empty>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>


<script setup>
import {useRouter} from "vue-router";
import {computed, onMounted, reactive, ref, watch} from "vue";
import { useTransition } from '@vueuse/core'
import {Check, Close, CloseBold, Delete, DocumentAdd, Download, Edit, User} from "@element-plus/icons-vue";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import {
  ElButton,
  ElIcon, ElMessage, ElMessageBox,
} from "element-plus";
import dayjs from 'dayjs';
import {Timer} from '@element-plus/icons-vue'
import stationData from "../station_name.js";
import {useUserStore} from "@/stores/user.js";
import api from "@/api.js";

const router = useRouter()
const goHome = () => {
  router.push('/')
}

const goLogin = () => {
  router.push('/login')
}

const userStore = useUserStore()

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"))
}

userStore.init()

const loginValue = computed({
  get: () => userStore.isLogin,
  set: (val) => userStore.setLogin(val)
})

const logout = () => {
  loginValue.value = false;
  ElMessage({
    message: '登出账户成功',
    type: 'success',
  })
}

// 加载
const loading = ref(true)

// 运转数据统计
const trips = ref(0)
const distance = ref(0)
const money = ref(0)

// 车票补登相关
const dialogFormVisible1 = ref(false)
const editingTicketId = ref(null)
const isEditMode = computed(() => editingTicketId.value !== null)
const ticket = reactive({
  number: '',
  from: '',
  to: '',
  trainNo: '',
  date: '',
  time: '',
  price: '',
  seatType: '',
  seatNo: '',
  sellPlace: '',
  gate: '',
  message: '买票请到12306 发货请到95306\n中国铁路祝您旅途愉快',
  theme: 'EMU_Green.jpg', // 默认值
  distance: '',
})

const stations = (() => {
  const list = []
  const parts = stationData.split('@')
  for (const item of parts) {
    if (!item) continue
    const arr = item.split('|')
    list.push({
      code: arr[0],     // 唯一标识符
      name: arr[1],     // 中文站名
      telecode: arr[2], // 电报码
      en: arr[3],       // 拼音全拼
      abbr: arr[4],     // 拼音首字母
      city: arr[7],     // 所属城市
    })
  }
  return list
})()

function querySearch(queryString, cb) {
  const results = queryString
      ? stations.filter(s =>
          s.name.includes(queryString) ||
          s.abbr.toLowerCase().includes(queryString.toLowerCase()) ||
          s.en.toLowerCase().includes(queryString.toLowerCase())
      )
      : []
  cb(
      results.map(s => ({
        value: s.name,
        label: `${s.name} (${s.city})`
      }))
  )
}

// 选中回调

function handleSelect(field, item) {
  const value = item.value
  ticket[field] = item.value
  if (field === 'from' && value === ticket.to) {
    ElMessage.warning('起点和终点不能相同，请重新选择')
    ticket.from = value
    ticket.to = '' // 清空终点
  } else if (field === 'to' && value === ticket.from) {
    ElMessage.warning('起点和终点不能相同，请重新选择')
    ticket.to = value
    ticket.from = '' // 清空起点
  } else {
    ticket[field] = value
  }
}

const rules = {
  trainNo: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入车次'))
        } else if (
            !/^(\d{4}|5\d{4}|[GCDZTKLYS]\d{1,4})$/i.test(value)
        ) {
          callback(new Error('请输入正确的车次'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const options = [
  {
    value: '硬座',
    label: '硬座',
  },
  {
    value: '软座',
    label: '软座',
  },
  {
    value: '硬卧',
    label: '硬卧',
  },
  {
    value: '软卧',
    label: '软卧',
  },
  {
    value: '二等座',
    label: '二等座',
  },
  {
    value: '一等座',
    label: '一等座',
  },
  {
    value: '特等座',
    label: '特等座',
  },
  {
    value: '优选一等座',
    label: '优选一等座',
  },
  {
    value: '商务座',
    label: '商务座',
  },
  {
    value: '无座',
    label: '无座',
  },
  {
    value: '二等卧',
    label: '二等卧',
  },
  {
    value: '一等卧',
    label: '一等卧',
  },
  {
    value: '一等软座',
    label: '一等软座',
  },
  {
    value: '二等软座',
    label: '二等软座',
  },
  {
    value: '包厢硬卧',
    label: '包厢硬卧',
  },
  {
    value: '高级软卧',
    label: '高级软卧',
  },
  {
    value: '高级动卧',
    label: '高级动卧',
  },
  {
    value: '混编硬座',
    label: '混编硬座',
  },
  {
    value: '混编硬卧',
    label: '混编硬卧',
  },
  {
    value: '特等软座',
    label: '特等软座',
  },
  {
    value: '动卧',
    label: '动卧',
  },
  {
    value: '一人软包',
    label: '一人软包',
  },
  {
    value: '混编软座',
    label: '混编软座',
  },
  {
    value: '混编软卧',
    label: '混编软卧',
  },
  {
    value: '多功能座',
    label: '多功能座',
  },
  {
    value: '二等包座',
    label: '二等包座',
  },
  {
    value: '硬卧代硬座',
    label: '硬卧代硬座',
  },
  {
    value: '软卧代软座',
    label: '软卧代软座',
  },
  {
    value: '卧代二等座',
    label: '卧代二等座',
  },
  {
    value: '棚车',
    label: '棚车',
  },
]

const value3 = ref(false)
const credit = ref(false)

const disableAirSeats = [
  '二等座',
  '一等座',
  '特等座',
  '优选一等座',
  '商务座',
  '无座',
  '多功能座',
  '动卧',
  '高级动卧',
  '一等卧',
  '二等卧',
  '卧代二等座',
  '混编硬座',
  '混编软座',
  '混编硬卧',
  '混编软卧',
  '棚车',
]

// el-switch 是否禁用
const airSwitchDisabled = computed(() => {
  return disableAirSeats.includes(ticket.seatType)
})

// 最终返回值
const finalSeatType = computed(() => {
  if (!ticket.seatType) return ''

  if (value3.value && !airSwitchDisabled.value) {
    return `新空调${ticket.seatType}`
  }
  return ticket.seatType
})

// 如果切换席位后变成不可用，自动关闭空调
watch(
    () => ticket.seatType,
    () => {
      if (airSwitchDisabled.value) {
        value3.value = false
      }
    }
)

// 修改主题选项，id直接对应图片文件名
const themeOptions = [
  {
    id: 'EMU_Red.jpg',
    label: '经典红',
    disabled: true,
  },
  {
    id: 'EMU_Blue.jpg',
    label: '经典蓝',
    disabled: true,
  },
  {
    id: 'EMU_Green.jpg',
    label: '动集绿',
  },
  {
    id: 'CIT_Yellow.jpg',
    label: '动检黄',
  },
  {
    id: 'Harmony_White.jpg',
    label: '和谐白',
  },
  {
    id: 'Blue_Sister.jpg',
    label: '蓝妹妹',
  },
  {
    id: 'HXD3D.jpg',
    label: '番茄红',
  },
  {
    id: 'DF7C.jpg',
    label: '小橘子',
  },
  {
    id: 'Blank.jpg',
    label: '空白底',
  },
]
const tripsVal = useTransition(trips, { duration: 1500 })
const distanceVal = useTransition(distance, { duration: 1500 })
const moneyVal = useTransition(money, { duration: 1500 })
const formatMoney = (val) => {
  const num = Number(val)
  return num % 1 === 0 ? num.toString() : num.toFixed(1)
}

const tickets = ref([])
const historyTicketRef = ref(null)
const downloadQrCodeUrl = ref('')
const downloadTicket = reactive({
  number: '',
  from: '',
  to: '',
  trainNo: '',
  date: '',
  time: '',
  price: '',
  seatType: '',
  seatNo: '',
  sellPlace: '',
  gate: '',
  message: '买票请到12306 发货请到95306\n中国铁路祝您旅途愉快',
  theme: 'EMU_Green.jpg',
  specialTicketType: '',
  useCredit: '',
})

const tableData = computed(() =>
    tickets.value.map((ticket) => ({
      id: ticket.id,
      date: ticket.travel_date || ticket.date || '',
      trainNo: ticket.train_no || ticket.trainNo || '',
      time: ticket.departure_time || ticket.time || '',
      price: ticket.price ?? 0,
      from: ticket.departure_station || ticket.from || '',
      to: ticket.arrival_station || ticket.to || '',
      seatType: ticket.seat_type || ticket.seatType || '',
      hasConditioner: ticket.has_conditioner ?? ticket.hasConditioner ?? 0,
      seatNo: ticket.seat_no || ticket.seatNo || '',
      gate: ticket.gate_info || ticket.gate || '',
      number: ticket.ticket_number || ticket.number || '',
      sellPlace: ticket.sell_place || ticket.sellPlace || '',
      message: ticket.message || '买票请到12306 发货请到95306\n中国铁路祝您旅途愉快',
      theme: ticket.theme || 'EMU_Green.jpg',
      useCredit: ticket.use_credit || 0,
      distance: ticket.distance ?? 0,
    }))
)

// 表格颜色
const tableRowStyle = ({ rowIndex }) => {
  if (rowIndex % 2 === 0) {
    return { backgroundColor: 'rgb(217, 236, 255)' }
  }
  return {}
}

const formatter = (row, column) => {
  return row.address
}

const resetTicketForm = () => {
  ticket.number = ''
  ticket.from = ''
  ticket.to = ''
  ticket.trainNo = ''
  ticket.date = ''
  ticket.time = ''
  ticket.price = ''
  ticket.seatType = ''
  ticket.seatNo = ''
  ticket.sellPlace = ''
  ticket.gate = ''
  ticket.message = '买票请到12306 发货请到95306\n中国铁路祝您旅途愉快'
  ticket.theme = 'EMU_Green.jpg'
  ticket.distance = ''
  credit.value = false
  value3.value = false
}

const openCreateDialog = () => {
  editingTicketId.value = null
  resetTicketForm()
  dialogFormVisible1.value = true
}

const openEditDialog = (row) => {
  if (!row?.id) {
    ElMessage.error('缺少记录ID，无法编辑')
    return
  }

  const seatTypeRaw = row.seatType || ''
  const seatTypeClean = seatTypeRaw.startsWith('新空调')
      ? seatTypeRaw.replace(/^新空调/, '')
      : seatTypeRaw

  editingTicketId.value = row.id
  ticket.number = row.number || ''
  ticket.from = row.from || ''
  ticket.to = row.to || ''
  ticket.trainNo = row.trainNo || ''
  ticket.date = row.date || ''
  ticket.time = row.time || ''
  ticket.price = row.price ?? ''
  ticket.seatType = seatTypeClean
  ticket.seatNo = row.seatNo || ''
  ticket.sellPlace = row.sellPlace || ''
  ticket.gate = row.gate || ''
  ticket.message = row.message || '买票请到12306 发货请到95306\n中国铁路祝您旅途愉快'
  ticket.theme = row.theme || 'EMU_Green.jpg'
  ticket.distance = row.distance ?? ''

  credit.value = Number(row.useCredit) === 1
  value3.value = Number(row.hasConditioner) === 1 || seatTypeRaw.startsWith('新空调')

  dialogFormVisible1.value = true
}

function normalizeStationName(name) {
  if (!name) return ''
  return name.endsWith('站') ? name.slice(0, -1) : name
}

function formatStationName(name) {
  const cleanName = normalizeStationName(name)
  if (!cleanName) return ''
  const len = cleanName.length
  if (len === 1) return `　${cleanName}　`
  if (len === 2) return cleanName[0] + '　' + cleanName[1]
  return cleanName
}

function getStationEnglish(name) {
  const cleanName = normalizeStationName(name)
  if (!cleanName) return ''
  if (cleanName === '香港西九龙') return 'HKWestKowloon'
  const s = stations.find(s => s.name === cleanName)
  if (!s) return ''
  return s.en.charAt(0).toUpperCase() + s.en.slice(1)
}

const generateDownloadQRCode = async (text) => {
  if (!text) {
    downloadQrCodeUrl.value = ''
    return
  }
  try {
    downloadQrCodeUrl.value = await QRCode.toDataURL(
        text,
        { width: 300, margin: 1, color: { dark: "#000000", light: "#0000" } }
    )
  } catch (err) {
    downloadQrCodeUrl.value = ''
  }
}

const downloadHistoryPNG = async (row) => {
  if (!(row?.number && row?.date && row?.from && row?.to && row?.price && row?.seatNo && row?.seatType && row?.time && row?.trainNo)) {
    ElMessage.warning("该记录信息不完整，无法下载")
    return
  }

  Object.assign(downloadTicket, {
    number: row.number,
    from: row.from,
    to: row.to,
    trainNo: row.trainNo,
    date: row.date,
    time: row.time,
    price: row.price,
    seatType: row.seatType,
    seatNo: row.seatNo,
    sellPlace: row.sellPlace,
    gate: row.gate,
    message: row.message,
    theme: row.theme,
    specialTicketType: row.useCredit ? '◯' : '',
    useCredit: row.useCredit ? '赠' : '',
  })

  await generateDownloadQRCode(row.number)

  try {
    await new Promise((resolve) => requestAnimationFrame(resolve))
    const element = historyTicketRef.value
    const canvas = await html2canvas(element, { scale: 2, backgroundColor: null })
    const imgData = canvas.toDataURL('image/png')

    const link = document.createElement('a')
    link.href = imgData
    link.download = `${row.number}.png`
    link.click()
  } catch (err) {
    ElMessage.error('下载失败')
  }
}

// 删除项目提示
const deleteHistory = async (row) => {
  if (!row?.id) {
    ElMessage.error('缺少记录ID，无法删除')
    return
  }

  try {
    await ElMessageBox.confirm(
        '此操作将删除这条记录，该过程不可逆！',
        '删除记录',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
        }
    )

    const res = await api.delete(`/ticket/delete/${row.id}`)

    if (res?.data?.success) {
      ElMessage.success('记录已删除')
      await loadTickets()
    } else {
      ElMessage.error(res?.data?.message || '删除失败')
    }
  } catch (err) {
    if (err !== 'cancel' && err !== 'close') {
      ElMessage.error('删除失败')
    }
  }
}

const username = ref("");

onMounted(() => {

  // 读取 localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    username.value = user.username;
  }

  loadTickets()

});

const saveDistance = ref(false)
const saveTicket = async () => {
  // console.log(ticket)
  // console.log(getCurrentUser())
  if (!(ticket.number &&
      ticket.date &&
      ticket.from &&
      ticket.to &&
      ticket.price &&
      ticket.seatNo &&
      ticket.seatType &&
      ticket.time &&
      ticket.trainNo)) {

    ElMessage.warning("请填写完整车票信息")
    return
  }

  // 未登录
  if (!getCurrentUser()) {
    ElMessage.warning("请先登录")
    return
  }

  try {
    const payload = {
      user_id: getCurrentUser().id,
      ticket_number: ticket.number,
      train_no: ticket.trainNo,
      departure_station: ticket.from,
      arrival_station: ticket.to,
      travel_date: ticket.date,
      departure_time: ticket.time,
      price: ticket.price,
      use_credit: credit.value ? 1 : 0,
      seat_type: finalSeatType.value,
      has_conditioner: value3.value ? 1 : 0,
      seat_no: ticket.seatNo,
      sell_place: ticket.sellPlace,
      gate_info: ticket.gate,
      message: ticket.message,
      theme: ticket.theme,
      distance: Number(ticket.distance) || 0
    }

    const res = isEditMode.value
        ? await api.post(`/ticket/update/${editingTicketId.value}`, payload)
        : await api.post("http://localhost:3000/api/ticket/add", payload)

    if (res.data.success) {

      ElMessage.success(isEditMode.value ? "记录更新成功" : "车票保存成功")

      dialogFormVisible1.value = false
      await loadTickets()
      editingTicketId.value = null

      saveDistance.value = false

    } else {

      ElMessage.error(res.data.message)

    }

  } catch (err) {
    ElMessage.error(err?.response?.data?.message || "保存失败")

  }
}

const loadTickets = async () => {

  if (!getCurrentUser()) return

  try {

    const res = await api.get(
        `/ticket/list/${getCurrentUser().id}`
    )
    
    tickets.value = Array.isArray(res?.data?.data)
        ? res.data.data
        : (Array.isArray(res?.data) ? res.data : [])

    // 运转次数
    trips.value = tickets.value.length

    // 运转里程
    distance.value = tickets.value.reduce(
        (sum, ticket) => sum + (ticket.distance || 0),
        0
    )

    // 消费金额（不含积分票）
    money.value = tickets.value
        .filter(ticket => ticket.use_credit === 0)
        .reduce(
            (sum, ticket) => sum + (ticket.price || 0),
            0
        )

  } catch (err) {

    console.log(err)

    ElMessage.error("读取车票失败")

  }
}


</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}
</style>


<style scoped>
@import "../assets/styles/App.css";
@import "../assets/styles/History.css";

.history-download-render {
  position: fixed;
  left: -9999px;
  top: 0;
  pointer-events: none;
}
</style>
