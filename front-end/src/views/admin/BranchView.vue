<script setup lang="ts">
import { useBranchStore } from '@/stores/branch'
import { onMounted, ref } from 'vue'
import ConfirmComponent from '@/components/dialogs/ConfirmComponent.vue'

import MapPicker from '@/components/MapPicker.vue'
import type { Branch } from '@/types/Branch'
import { useLoadingStore } from '@/stores/loading'
import LoadingComponent from '@/components/LoadingComponent.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import ToggleSwitch from '@/components/ToggleSwitch.vue'
const loadingStore = useLoadingStore()
const branchStore = useBranchStore()

const mode = ref<'create' | 'edit'>('create')
const showDialog = ref(false)
const search = ref('')
const showConfirm = ref(false)

onMounted(async () => {
  await branchStore.getBranches()
})

const openEdit = (branch: Branch) => {
  mode.value = 'edit'
  branchStore.editedBranch = { ...branch }
  console.log(branchStore.editedBranch)
  showDialog.value = true
}

const saveBranch = async () => {
  if (mode.value === 'create') {
    await branchStore.addBranch(branchStore.editedBranch)
  } else {
    await branchStore.updateBranch(branchStore.editedBranch)
  }

  await branchStore.getBranches()
  showDialog.value = false
  showConfirm.value = false
  branchStore.clearBranch()
}

const closeDialog = () => {
  branchStore.clearBranch()
  showDialog.value = false
}

const openCreateDialog = () => {
  mode.value = 'create'
  showDialog.value = true
}

const setLocation = (location: { lat: number; lng: number }) => {
  branchStore.editedBranch.lat = location.lat
  branchStore.editedBranch.lng = location.lng
}

const nextPage = async () => {
  if (branchStore.page < branchStore.lastPage) {
    branchStore.page++
    await branchStore.getBranches()
  }
}

const prevPage = async () => {
  if (branchStore.page > 1) {
    branchStore.page--
    await branchStore.getBranches()
  }
}

const searchBranch = async () => {
  branchStore.search = search.value
  await branchStore.getBranches()
}

const clearSearch = async () => {
  search.value = ''
  branchStore.search = ''
  branchStore.page = 1
  await branchStore.getBranches()
}
</script>

<template>
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold text-white">Branch Management</h1>

    <div class="flex items-center gap-3">
      <input
        type="text"
        placeholder="ค้นหาสาขา..."
        v-model="search"
        class="border px-3 py-2 rounded w-64"
      />

      <button
        class="bg-white/10 hover:bg-white/20 text-white p-2 rounded-md flex items-center justify-center"
        @click="searchBranch()"
      >
        <span class="pi pi-search text-lg"></span>
      </button>
      <button
        class="bg-white/10 hover:bg-white/20 text-white p-2 rounded-md flex items-center justify-center"
        @click="clearSearch()"
      >
        <span class="pi pi-times text-lg"></span>
      </button>
      <button
        class="flex items-center gap-2 bg-[#637aad] hover:bg-[#4a68a8] text-white px-4 py-2 rounded-md transition"
        @click="openCreateDialog()"
      >
        <span class="pi pi-plus text-lg"></span>
        <span>เพิ่มสาขา</span>
      </button>
    </div>
  </div>

  <div class="bg-white rounded-lg overflow-hidden">
    <table class="w-full text-left text-black">
      <thead class="bg-[#383838] text-gray-300 text-sm">
        <tr>
          <th class="px-6 py-3">ชื่อสาขา</th>
          <th class="px-6 py-3">ที่อยู่สาขา</th>
          <th class="px-6 py-3">สถานะการใช้งาน</th>
          <th class="px-3 py-3">เปิดใช้งาน</th>
          <th class="px-6 py-3 text-center">จัดการ</th>
        </tr>
      </thead>

      <tbody class="divide-y">
        <tr v-if="branchStore.branches.length === 0">
          <td colspan="9" class="text-center py-6 text-gray-500">ไม่พบข้อมูล</td>
        </tr>

        <tr v-else v-for="branch in branchStore.branches" :key="branch.branch_id">
          <td class="px-6 py-1">{{ branch.branch_name }}</td>
          <td class="px-6 py-1">{{ branch.address }}</td>
          <td class="px-6 py-2 text-center">
            <StatusBadge :modelValue="branch.is_active" />
          </td>
          <td>
            <ToggleSwitch
              :modelValue="branch.is_active"
              @update:modelValue="
                branch.branch_id &&
                  branchStore
                    .toggleBranchActive(branch.branch_id)
                    .then(() => branchStore.getBranches())
              "
            />
          </td>
          <td class="px-6 py-3 flex justify-center space-x-4">
            <button class="edit-btn" @click="openEdit(branch)">
              <span class="pi pi-pencil"></span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="flex justify-end items-center gap-4 py-4 border-t mr-3">
      <button class="px-3 py-1 border rounded hover:bg-gray-100" @click="prevPage()">
        <span class="pi pi-chevron-left text-sm"></span> ก่อนหน้า
      </button>

      <span class="text-sm text-gray-600">
        {{ branchStore.page }} จาก {{ branchStore.lastPage }}</span
      >

      <button class="px-3 py-1 border rounded hover:bg-gray-100" @click="nextPage()">
        ถัดไป <span class="pi pi-chevron-right text-sm"></span>
      </button>
    </div>
  </div>

  <div v-if="showDialog" class="overlay">
    <div class="dialog">
      <div class="text-lg font-semibold mb-4">
        <h2 class="text-lg font-semibold mb-4">
          {{ mode === 'create' ? 'เพิ่มสาขา' : 'แก้ไขสาขา' }}
        </h2>
      </div>

      <div class="mb-3">
        <label class="block mb-1">ชื่อสาขา</label>
        <input
          v-model="branchStore.editedBranch.branch_name"
          type="text"
          class="border w-full px-3 py-2 rounded bg-gray-50"
          placeholder="กรอกชื่อสาขา"
        />
      </div>

      <div class="mb-3">
        <label class="block mb-1">ที่อยู่</label>
        <input
          v-model="branchStore.editedBranch.address"
          type="text"
          class="border w-full px-3 py-2 rounded bg-gray-50"
          placeholder="กรอกที่อยู่"
        />
      </div>
      <div class="mb-3">
        <MapPicker
          @update:location="setLocation"
          :lat="branchStore.editedBranch.lat"
          :lng="branchStore.editedBranch.lng"
        />
      </div>

      <div class="flex justify-center gap-4">
        <button class="bg-red-500 text-white px-4 py-1 rounded" @click="closeDialog()">
          ยกเลิก
        </button>

        <button class="bg-green-500 text-white px-4 py-1 rounded" @click="showConfirm = true">
          บันทึก
        </button>
      </div>
    </div>
  </div>

  <ConfirmComponent
    :show="showConfirm"
    type="save"
    message="คุณต้องการบันทึกข้อมูลนี้ใช่หรือไม่"
    @confirm="saveBranch()"
    @cancel="showConfirm = false"
  />

  <LoadingComponent v-model="loadingStore.loading" />
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
}

.dialog {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 500px;
  overflow-y: auto;
  max-height: 90vh;
}
</style>
