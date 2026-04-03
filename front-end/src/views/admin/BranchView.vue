<script setup lang="ts">
import { useBranchStore } from '@/stores/branch'
import { onMounted, ref } from 'vue'
import ConfirmComponent from '@/components/dialogs/ConfirmComponent.vue'

import MapPicker from '@/components/MapPicker.vue'
import type { Branch } from '@/types/Branch'
import { useLoadingStore } from '@/stores/loading'
import LoadingComponent from '@/components/LoadingComponent.vue'
const loadingStore = useLoadingStore()
const branchStore = useBranchStore()
const showDialog = ref(false)
const search = ref('')
const showConfirm = ref(false)
const deleteConfirm = ref(false)

onMounted(async () => {
  await branchStore.getBranches()
})

const mode = ref<'create' | 'edit'>('create')

const openEdit = (branch: Branch) => {
  mode.value = 'edit'
  branchStore.editedBranch = { ...branch }
  console.log(branchStore.editedBranch)
  showDialog.value = true
}

// const saveBranch = () => {
//   if (mode.value === 'create') {
//     branchStore.addBranch(branchStore.editedBranch)
//   } else {
//     branchStore.updateBranch(branchStore.editedBranch)
//   }
//   showDialog.value = false
//   branchStore.clearBrance()
//   branchStore.getBranches()
// }

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

const removeItem = async (branch: Branch) => {
  await branchStore.removeBranch(branch)
  await branchStore.getBranches()
  branchStore.clearBranch()
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

const openDelete = async (item: Branch) => {
  deleteConfirm.value = true
  branchStore.editedBranch = item
}

const closeDialogDelete = async () => {
  deleteConfirm.value = false
  branchStore.clearBranch()
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
            placeholder="Search branch..."
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
            class="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            @click="openCreateDialog()"
          >
            <span class="pi pi-plus text-lg"></span>
            <span>Create</span>
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-lg overflow-hidden">
        <table class="w-full text-left text-black">
          <thead class="bg-[#383838] text-gray-300 text-sm">
            <tr>
              <th class="px-6 py-3">Branch Name</th>
              <th class="px-6 py-3">Address</th>
              <th class="px-6 py-3">Status</th>
              <th class="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody class="divide-y">
            <tr v-if="branchStore.branches.length === 0">
              <td colspan="4" class="text-center py-6 text-gray-500">ไม่พบข้อมูลที่ค้นหา</td>
            </tr>

            <tr v-else v-for="branch in branchStore.branches" :key="branch.branch_id">
              <td class="px-6 py-1">{{ branch.branch_name }}</td>
              <td class="px-6 py-1">{{ branch.address }}</td>
              <td class="px-6 py-1">
                <span
                  class="text-white text-sm px-3 py-1 rounded-full inline-block"
                  :class="branch.status === 'active' ? 'bg-green-500' : 'bg-red-500'"
                >
                  {{ branch.status }}
                </span>
              </td>
              <td class="px-6 py-3 flex justify-center space-x-2">
                <button class="edit-btn" @click="openEdit(branch)">
                  <span class="pi pi-pencil"></span>
                </button>

                <button class="delete-btn" @click="openDelete(branch)">
                  <span class="pi pi-trash"></span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="flex justify-end items-center gap-4 py-4 border-t mr-3">
          <button class="px-3 py-1 border rounded hover:bg-gray-100" @click="prevPage()">
            <span class="pi pi-chevron-left text-sm"></span> Prev
          </button>

          <span class="text-sm text-gray-600">
            {{ branchStore.page }} of {{ branchStore.lastPage }}</span
          >

          <button class="px-3 py-1 border rounded hover:bg-gray-100" @click="nextPage()">
            Next <span class="pi pi-chevron-right text-sm"></span>
          </button>
        </div>
      </div>

 

  <!-- Dialog -->
  <div v-if="showDialog" class="overlay">
    <div class="dialog">
      <h2 class="text-lg font-semibold mb-4">
        <h2 class="text-lg font-semibold mb-4">
          {{ mode === 'create' ? 'Create Branch' : 'Edit Branch' }}
        </h2>
      </h2>

      <div class="mb-3">
        <label class="block mb-1">Branch Name</label>
        <input
          v-model="branchStore.editedBranch.branch_name"
          type="text"
          class="border w-full px-3 py-2 rounded bg-gray-50"
          placeholder="Enter branch name"
        />
      </div>

      <div class="mb-3">
        <label class="block mb-1">Address</label>
        <input
          v-model="branchStore.editedBranch.address"
          type="text"
          class="border w-full px-3 py-2 rounded bg-gray-50"
          placeholder="Enter address"
        />
      </div>
      <MapPicker
        @update:location="setLocation"
        :lat="branchStore.editedBranch.lat"
        :lng="branchStore.editedBranch.lng"
      />

      <div class="mb-4">
        <label class="block mb-1">Status</label>
        <select
          v-model="branchStore.editedBranch.status"
          class="border w-full px-3 py-2 rounded bg-gray-50"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div class="flex justify-center gap-4">
        <button class="bg-red-500 text-white px-4 py-1 rounded" @click="closeDialog()">
          Close
        </button>

        <button class="bg-green-500 text-white px-4 py-1 rounded" @click="showConfirm = true">
          Save
        </button>
      </div>
    </div>
  </div>

  <ConfirmComponent
    :show="showConfirm"
    type="save"
    message="คุณต้องการที่จะบันทึกข้อมูลนี้"
    @confirm="saveBranch()"
    @cancel="showConfirm = false"
  />

  <ConfirmComponent
    :show="deleteConfirm"
    type="delete"
    message="คุณต้องการที่จะลบข้อมูลนี้ใช่หรือไม่"
    @confirm="removeItem(branchStore.editedBranch)"
    @cancel="closeDialogDelete()"
  /> <LoadingComponent v-model="loadingStore.loading" />
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
