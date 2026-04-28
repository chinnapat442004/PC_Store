import { defineStore } from 'pinia'

import dashboardService from '../service/dashboard'

import { ref } from 'vue'
import type { AdminDashboardResponse } from '@/types/Dashboard'
import { useLoadingStore } from './loading'

export const useAdminDashboardStore = defineStore('admin-dashboard', () => {

    const loadingStore = useLoadingStore()


    const adminDashboard = ref<AdminDashboardResponse>()


    async function getAdminDashboard() {
        loadingStore.doLoad()
        const res = await dashboardService.getAdminDashboard()
        adminDashboard.value = res.data
        loadingStore.finishLoad()
    }




    return {
        getAdminDashboard, adminDashboard
    }
})
