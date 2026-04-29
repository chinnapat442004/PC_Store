import { defineStore } from 'pinia'

import dashboardService from '../service/dashboard'

import { ref } from 'vue'
import type { AdminDashboardResponse, ManagerDashboardResponse } from '@/types/Dashboard'
import { useLoadingStore } from './loading'

export const useDashboardStore = defineStore('admin-dashboard', () => {

    const loadingStore = useLoadingStore()


    const adminDashboard = ref<AdminDashboardResponse>()
    const managerDashboard = ref<ManagerDashboardResponse>()


    async function getAdminDashboard() {
        loadingStore.doLoad()
        const res = await dashboardService.getAdminDashboard()
        adminDashboard.value = res.data
        loadingStore.finishLoad()
    }


    async function getManagerDashboard() {
        loadingStore.doLoad()
        const res = await dashboardService.getManagerDashboard()
        managerDashboard.value = res.data
        loadingStore.finishLoad()
    }



    return {
        getAdminDashboard, getManagerDashboard, adminDashboard, managerDashboard
    }
})
