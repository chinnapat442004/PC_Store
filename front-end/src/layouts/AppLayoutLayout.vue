<script setup lang="ts">
import Sidebar from '@/components/SidebarComponent.vue'
import { useAuthStore } from '@/stores/auth';
import type { MenuItem, UserRole } from '@/types/Menu';
import { computed } from 'vue';


const authStore = useAuthStore()

const menusByRole: Record<UserRole, MenuItem[]> = {
  admin: [
    { name: 'dashboard', label: 'Dashboard', path: { name: 'dashboard' } },
    { name: 'user', label: 'User Management', path: { name: 'user' } },
    { name: 'branch', label: 'Branch Management', path: { name: 'branch' } },
    { name: 'category', label: 'Category Management', path: { name: 'category' } },
    { name: 'editproduct', label: 'Product Management', path: { name: 'editproduct' } },
    { name: 'brand', label: 'Brand Management', path: { name: 'brand' } },
    { name: 'manager-shipment', label: 'Shipment', path: { name: 'manager-shipment' } }
  ],

  manager: [
    { name: 'manager-dashboard', label: 'Dashboard', path: { name: 'manager-dashboard' } },
    { name: 'manager-orders', label: 'Order Management', path: { name: 'manager-orders' } },
    { name: 'manager-stock', label: 'Stock', path: { name: 'manager-stock' } },
    { name: 'manager-staff', label: 'Staff Management', path: { name: 'manager-staff' } },
  ],
  staff: [{ name: 'staff-dashboard', label: 'Dashboard', path: { name: 'staff-dashboard' } },
  { name: 'staff-orders', label: 'Order Management', path: { name: 'staff-orders' } },
  { name: 'staff-stock', label: 'Stock', path: { name: 'staff-stock' } },]
}
const menus = computed<MenuItem[]>(() => {
  const role = authStore.user?.role

  if (!role) return []

  return menusByRole[role]
})
</script>

<template>
  <Sidebar :menus="menus" />
  <div class="pl-[240px] w-full">
    <div class="h-full  lg:px-[20px] min-h-screen pt-6">

      <router-view />

    </div>
  </div>
</template>