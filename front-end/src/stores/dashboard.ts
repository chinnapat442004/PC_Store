import { defineStore } from 'pinia'

import dashboardService from '../service/dashboard'

import { ref } from 'vue'
import {
  type StaffDashboardResponse,
  type AdminDashboardResponse,
  type ManagerDashboardResponse,
} from '@/types/Dashboard'
import { useLoadingStore } from './loading'

export const useDashboardStore = defineStore('admin-dashboard', () => {
  const loadingStore = useLoadingStore()

  const adminDashboard = ref<AdminDashboardResponse>()
  const managerDashboard = ref<ManagerDashboardResponse>()
  const staffDashboard = ref<StaffDashboardResponse>()

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

  async function getStaffDashboard() {
    loadingStore.doLoad()
    const res = await dashboardService.getStaffDashboard()
    staffDashboard.value = res.data
    loadingStore.finishLoad()
  }

  return {
    getAdminDashboard,
    getManagerDashboard,
    getStaffDashboard,
    adminDashboard,
    managerDashboard,
    staffDashboard,
  }
})
