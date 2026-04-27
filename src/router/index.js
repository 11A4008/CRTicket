import { createRouter, createWebHistory } from 'vue-router'
import MainView from '../views/MainView.vue'
import HistoryView from '../views/HistoryView.vue'
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Debug from "@/views/Debug.vue";

const routes = [
    {
        path: '/',
        component: MainView
    },
    {
        path: '/history',
        component: HistoryView
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/register',
        component: Register
    },
    {
        path: '/debug',
        component: Debug
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router