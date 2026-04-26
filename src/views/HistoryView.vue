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
          <el-card class="user-card">
            <div class="card-container">
              <el-button type="danger" size="large" class="signout-top-right" disabled>
                <el-icon><CloseBold /></el-icon>登出账户
              </el-button>
              <el-button type="success" size="large" class="supplement-bottom-right" @click="dialogFormVisible1 = true">
                <el-icon><DocumentAdd /></el-icon>补登记录
              </el-button>

              <el-dialog v-model="dialogFormVisible1" title="补登记录" width="50%">
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

                    <el-col :span="12">
                      <el-form-item label="使用积分">
                        <el-switch
                            v-model="credit"
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
                    <el-button type="primary" @click="dialogFormVisible1 = false">
                      Confirm
                    </el-button>
                  </div>
                </template>
              </el-dialog>

              <el-avatar :size="120" src="Picture1.png" />

              <div class="card-content">
                <h1>Hi, XXX</h1>
                <p>
                  你今年已经运转了
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
            <el-table-column prop="date" label="日期" width="120" sortable/>
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
                  <el-button type="success">
                    <el-icon><Download /></el-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip
                    content="编辑记录"
                    placement="bottom"
                >
                  <el-button>
                    <el-icon><Edit /></el-icon>
                  </el-button>
                </el-tooltip>
                <el-tooltip
                    content="删除记录"
                    placement="bottom"
                >
                  <el-button type="danger" @click="deleteHistory()">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>


<script setup>
import {useRouter} from "vue-router";
import {computed, reactive, ref, watch} from "vue";
import { useTransition } from '@vueuse/core'
import {Check, Close, CloseBold, Delete, DocumentAdd, Download, Edit} from "@element-plus/icons-vue";
import {
  ElButton,
  ElIcon, ElMessage, ElMessageBox,
} from "element-plus";
import dayjs from 'dayjs';
import {Timer} from '@element-plus/icons-vue'
import stationData from "../station_name.js";

const router = useRouter()
const goHome = () => {
  router.push('/')
}

// 加载
const loading = ref(true)

// 运转数据统计
const trips = ref(0)
const distance = ref(0)
const money = ref(0)

// 车票补登相关
const dialogFormVisible1 = ref(false)
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
  theme: 'EMU_Green.jpg' // 默认值
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

// 模拟数据加载
trips.value = 100
distance.value = 20000
money.value = 7000

const tableData = [
  {
    date: '2016-05-03',
    trainNo: 'G8964',
    price: '9999',
    from: '呼和浩特东',
    to: '八达岭长城',
    seatType: '新空调硬卧代硬座',
    seatNo: '02车20号下铺',
    gate: '检票：上海方向检票口',
    number: 'E2W114514',
  },
  {
    date: '2016-05-02',
    trainNo: 'G8964',
    price: '9999',
    from: '呼和浩特东',
    to: '八达岭长城',
    number: 'E2W114514',
  },
  {
    date: '2016-05-04',
    trainNo: 'G8964',
    price: '9999',
    from: '呼和浩特东',
    to: '八达岭长城',
    number: 'E2W114514',
  },
  {
    date: '2016-05-01',
    trainNo: 'G8964',
    price: '9999',
    from: '呼和浩特东',
    to: '八达岭长城',
    number: 'E2W114514',
  },
  {
    date: '2016-05-08',
    trainNo: 'G8964',
    price: '9999',
    from: '呼和浩特东',
    to: '八达岭长城',
    number: 'E2W114514',
  },
  {
    date: '2016-05-06',
    trainNo: 'G8964',
    price: '9999',
    from: '呼和浩特东',
    to: '八达岭长城',
    number: 'E2W114514',
  },
  {
    date: '2016-05-07',
    trainNo: 'G8964',
    price: '9999',
    from: '呼和浩特东',
    to: '八达岭长城',
    number: 'E2W114514',
  },
]

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

// 删除项目提示
const deleteHistory = () => {
  ElMessageBox.confirm(
      '此操作将删除这条记录，该过程不可逆！',
      '删除记录',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'Danger',
      }
  )
      .then(() => {
        ElMessage({
          type: 'success',
          message: '记录已删除',
        })
      })
}

</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}
</style>


<style scoped>
@import "../assets/styles/History.css";
</style>