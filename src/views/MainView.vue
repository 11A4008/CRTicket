<template>
  <el-tooltip
      content="该功能开发中..."
      placement="bottom-start"
  >
    <el-button class="user-top-right" @click="goToHistory()" disabled>
      <el-icon><User /></el-icon>历史记录
    </el-button>
  </el-tooltip>
  <el-container style="height: 100vh">
    <el-aside width="350px" style="background: #f8f9fa; padding: 20px;">
      <h2 style="margin-bottom: 20px; font-family: Roboto,serif">Sam-Lab CR Ticket Maker</h2>
      <el-form
          :model="ticket"
          :rules="rules"
          ref="formRef"
          label-width="100px"
          label-position="left"
      >
        <el-form-item label="票号">
          <el-input v-model="ticket.number" placeholder="例如：E351822734"></el-input>
        </el-form-item>

        <el-form-item label="起点">
          <el-autocomplete
              v-model="ticket.from"
              :fetch-suggestions="querySearch"
              placeholder="输入站名或拼音"
              clearable
              @select="handleSelect('from', $event)"
          />
        </el-form-item>

        <el-form-item label="终点">
          <el-autocomplete
              v-model="ticket.to"
              :fetch-suggestions="querySearch"
              placeholder="输入站名或拼音"
              clearable
              @select="handleSelect('to', $event)"
          />
        </el-form-item>

        <el-form-item label="车次" prop="trainNo">
          <el-input
              v-model="ticket.trainNo"
              placeholder="例如：G25 或 1461"
          />
        </el-form-item>

        <el-form-item label="开车日期">
          <el-date-picker
              v-model="ticket.date"
              type="date"
              placeholder="请选择乘车日期"
              format="YYYY/MM/DD"
              value-format="YYYY年MM月DD日"
          />
        </el-form-item>

        <el-form-item label="开车时间">
          <el-time-picker
              v-model="ticket.time"
              placeholder="选择开车时间"
              format="HH:mm"
              value-format="HH:mm"
          />
        </el-form-item>

        <el-form-item label="票价">
          <el-input-number v-model="ticket.price" placeholder="请输入数字" :min="0" :step="0.5"></el-input-number>
        </el-form-item>

        <el-form-item label="使用积分">
          <el-switch
              v-model="credit"
              inline-prompt
              :active-icon="Check"
              :inactive-icon="Close"
          />
        </el-form-item>

        <el-form-item label="席位名称">
          <el-select
              v-model="ticket.seatType"
              placeholder="Select"
          >
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="空调选择">
          <el-switch
              v-model="value3"
              :disabled="airSwitchDisabled"
              inline-prompt
              :active-icon="Check"
              :inactive-icon="Close"
          />
        </el-form-item>

        <el-form-item label="座位号">
          <el-input v-model="ticket.seatNo" placeholder="03车12A号"></el-input>
        </el-form-item>

        <el-form-item label="售票地点">
          <el-input v-model="ticket.sellPlace" placeholder="XX站"></el-input>
        </el-form-item>

        <el-form-item label="检票/候车位置">
          <el-input v-model="ticket.gate" placeholder="检票：1A / 候车：一候"></el-input>
        </el-form-item>

        <el-form-item label="提示语">
          <el-input
              v-model="ticket.message"
              :rows="3"
              type="textarea"
              placeholder="输入提示语"
          />
        </el-form-item>

        <el-form-item label="选择背景">
          <el-select
              v-model="ticket.theme"
              placeholder="请选择主题"
              style="width: 240px"
          >
            <el-option
                v-for="item in themeOptions"
                :key="item.id"
                :label="item.label"
                :value="item.id"
                :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>

      </el-form>
      <h3 style="font-family: Consolas,serif">Version 260426</h3>
      <h3 style="font-family: Consolas,serif">Station Version 10109</h3>

      <el-button type="primary" @click="note">更新内容</el-button>

    </el-aside>

    <el-main class="main-center">
      <el-card class="ticket-preview" shadow="always">
        <div class="ticket-container">
          <div ref="ticketRef" class="ticket-container">
            <div class="ticket-bg" :style="{ backgroundImage: `url(./${ticket.theme})` }">
              <div class="ticket-number">{{ticket.number}}</div>
            </div>

            <div class="station-block">
              <div class="station-left">
                <div class="station-name">{{ formatStationName(ticket.from) }}<span class="small">站</span></div>
                <div class="station-en">{{ getStationEnglish(ticket.from) }}</div>
              </div>

              <div class="station-middle">
                <div class="train-no">{{ ticket.trainNo }}</div>
                <div class="arrow">
                  <span class="line"></span>
                  <span class="head"></span>
                </div>
              </div>

              <div class="station-right">
                <div class="station-name">{{ formatStationName(ticket.to) }}<span class="small">站</span></div>
                <div class="station-en">{{ getStationEnglish(ticket.to) }}</div>
              </div>
            </div>

            <div class="ticket-gate">{{ticket.gate}}</div>

            <div class="date-time">{{ticket.date}}&nbsp;&nbsp; {{ticket.time}}开</div>

            <div class="price">￥{{ticket.price}}元</div>

            <div class="tip"><strong>限乘当日当次车</strong></div>

            <div class="seat">{{ticket.seatNo}}</div>

            <div class="seat-class">{{finalSeatType}}</div>

            <div class="ticket-message">
              <p>{{ ticket.message }}</p>
            </div>

            <div class="ticket-type">{{ specialTicketType }}</div>
            <div class="credit">{{ useCredit}}</div>

            <div class="ticket-qrcode" v-if="qrCodeUrl">
              <img :src="qrCodeUrl" alt="QR Code" />
            </div>

            <div class="sell-place">{{ticket.sellPlace}}售</div>
          </div>

        </div>
        <div class="download-buttons">
          <el-button type="primary" @click="downloadPDF">
            <el-icon><Document /></el-icon>
            下载 PDF
          </el-button>

          <el-button type="success" @click="downloadPNG">
            <el-icon><Picture /></el-icon>
            下载 PNG
          </el-button>
          <el-tooltip
              content="该功能开发中..."
              placement="bottom-start"
          >
            <el-button type="success" @click="saveDistance = true" disabled>
              <el-icon><Checked /></el-icon>
              存储到账户
            </el-button>
          </el-tooltip>
          <el-dialog
              v-model="saveDistance"
              title="运转里程"
              width="500"
              :before-close="handleClose"
          >
            <span>请输入本次运转的里程数，单位为km。</span>
            <el-input-number v-model="distance" :min="0">
              <template #suffix>
                <span>km</span>
              </template>
            </el-input-number>
            <template #footer>
              <div class="dialog-footer">
                <el-button @click="saveDistance = false">我不知道里程</el-button>
                <el-button type="primary" @click="saveDistance = false">
                  存储车票
                </el-button>
              </div>
            </template>
          </el-dialog>
        </div>
      </el-card>

    </el-main>
  </el-container>
</template>

<script setup>
import {onMounted, watch, reactive, ref, computed} from 'vue'
import {ElMessage, ElMessageBox, ElNotification} from 'element-plus'
import stationData from '/src/station_name.js'
import QRCode from 'qrcode'
import html2canvas from 'html2canvas'
import jsPDF from "jspdf";
import {Checked, Document, Picture, User} from "@element-plus/icons-vue";
import { Check, Close } from '@element-plus/icons-vue'
import {useRouter} from "vue-router";

//解析站点数据

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


// 数据模型

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
  distance: ''
})

// 搜索逻辑

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

// 引用表单实例
const formRef = ref(null)

// 校验规则
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
const specialTicketType = computed(() => {
  if (credit.value) {
    return `◯`
  }
})

const useCredit = computed(() => {
  if (credit.value) {
    return `赠`
  }
})

const distance = ref(0)

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

function formatStationName(name) {
  if (!name) return ''
  const len = name.length
  if (len === 1) return `　${name}　` // 一个字 → 居中
  if (len === 2) return name[0] + '　' + name[1] // 两个字 → 中间留空
  return name // 三个及以上 → 原样显示
}

// 获取站点英文名
function getStationEnglish(name) {
  if (!name) return ''
  if (name === '香港西九龙') return 'HKWestKowloon'
  const s = stations.find(s => s.name === name)
  if (!s) return ''
  // 首字母大写
  return s.en.charAt(0).toUpperCase() + s.en.slice(1)
}

// 定义二维码图片地址
const qrCodeUrl = ref('')

// 生成二维码函数
function generateQRCode(text) {
  if (!text) {
    qrCodeUrl.value = ''
    return
  }
  QRCode.toDataURL(text, { width: 300, margin: 1, color:{ dark: "#000000", light: "#0000"} }, (err, url) => {
    if (!err) {
      qrCodeUrl.value = url
    }
  })
}

// 监听票号变化，自动更新二维码
watch(() => ticket.number, (newVal) => {
  generateQRCode(newVal)
})

// 初次加载时生成QR码并显示更新内容
onMounted(() => {
  generateQRCode(ticket.number)
  if (!sessionStorage.getItem('notified')) {
    note()
    sessionStorage.setItem('notified', '1')
  }
})

const note = () => {
  ElNotification({
    title: '加入了积分兑换车票的标志！',
    message: '更新内容：加入“使用积分”开关；加入“历史记录”按钮（未启用）。',
    type: 'info',
    position: "bottom-right"
  })
}

const ticketRef = ref(null)

//PDF
const downloadPDF = async () => {
  if (!(ticket.number && ticket.date && ticket.from && ticket.to && ticket.price && ticket.seatNo && ticket.seatType && ticket.time && ticket.trainNo)) {
    ElMessage.warning("请填写所有必填项");
    return;
  }

  const element = ticketRef.value
  const canvas = await html2canvas(element, { scale: 2, backgroundColor: null })
  const imgData = canvas.toDataURL('image/png')

  // PDF 尺寸：8.6cm x 5.4cm
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'cm',
    format: [8.6, 5.4]
  })

  pdf.addImage(imgData, 'PNG', 0, 0, 8.6, 5.4)
  pdf.save(`${ticket.number}.pdf`)
}

// 下载 PNG
const downloadPNG = async () => {
  if (!(ticket.number && ticket.date && ticket.from && ticket.to && ticket.price && ticket.seatNo && ticket.seatType && ticket.time && ticket.trainNo)) {
    ElMessage.warning("请填写所有必填项");
    return;
  }

  const element = ticketRef.value
  const canvas = await html2canvas(element, { scale: 2, backgroundColor: null })
  const imgData = canvas.toDataURL('image/png')

  const link = document.createElement('a')
  link.href = imgData
  link.download = `${ticket.number}.png`
  link.click()
}

// 历史记录跳转
const router = useRouter()
const goToHistory = () => {
  router.push('/history')
}

// 存储里程
const saveDistance = ref(false)
const handleClose = (done) => {
  ElMessageBox.confirm('你确定不要存储这张车票？')
      .then(() => {
        done()
      })
      .catch(() => {
        // catch error
      })
}
</script>

<style scoped>
@import "../assets/styles/App.css";
</style>