import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import {createPinia} from "pinia";

createApp(App).use(router).use(ElementPlus).use(createPinia()).mount('#app')

