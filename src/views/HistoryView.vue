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
              <el-button type="success" size="large" class="supplement-bottom-right" disabled>
                <el-icon><DocumentAdd /></el-icon>补登记录
              </el-button>
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

          <el-table :data="tableData" class="table" >
            <el-table-column prop="date" label="日期" width="120" />
            <el-table-column prop="trainNo" label="车次" width="80" />
            <el-table-column prop="price" label="票价" width="80" />
            <el-table-column prop="from" label="起点" width="120" />
            <el-table-column prop="to" label="终点" width="120" />
            <el-table-column prop="number" label="票号" width="160" />
            <el-table-column label="操作">
              <template #default="scope">
                <el-button type="success">
                  下载车票
                </el-button>
                <el-button>
                  编辑
                </el-button>
                <el-button type="danger">
                  删除
                </el-button>
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
import {ref} from "vue";
import { useTransition } from '@vueuse/core'
import {CloseBold, DocumentAdd} from "@element-plus/icons-vue";
import {ElButton,
  ElIcon,
  } from "element-plus";
import dayjs from 'dayjs';
import {Timer} from '@element-plus/icons-vue'

const router = useRouter()
const goHome = () => {
  router.push('/')
}

//运转数据统计
const trips = ref(0)
const distance = ref(0)
const money = ref(0)

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