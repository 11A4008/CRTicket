import { createRouter, createWebHistory } from 'vue-router'
import MainView from '../views/MainView.vue'
import HistoryView from '../views/HistoryView.vue'

const routes = [
    {
        path: '/',
        component: MainView
    },
    {
        path: '/history',
        component: HistoryView
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router