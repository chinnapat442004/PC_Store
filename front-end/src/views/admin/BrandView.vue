<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ConfirmComponent from '@/components/dialogs/ConfirmComponent.vue'

import { useLoadingStore } from '@/stores/loading'
import LoadingComponent from '@/components/LoadingComponent.vue'


const loadingStore = useLoadingStore()


const showDialog = ref(false)
const search = ref('')
const showConfirm = ref(false)
const deleteConfirm = ref(false)


const mode = ref<'create' | 'edit'>('create')





const openEdit = () => {
  mode.value = 'edit'
  showDialog.value = true
}


const openDelete = () => {
  deleteConfirm.value = true

}


const closeDialog = () => {

  showDialog.value = false
}

const openCreateDialog = () => {
  mode.value = 'create'
  showDialog.value = true
}


</script>

<template>



  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold text-white">Brand Management</h1>

    <div class="flex items-center gap-3">
      <input type="text" placeholder="Search brand..." v-model="search" class="border px-3 py-2 rounded w-64" />

      <button class="bg-white/10 hover:bg-white/20 text-white p-2 rounded-md">
        <span class="pi pi-search"></span>
      </button>

      <button class="bg-white/10 hover:bg-white/20 text-white p-2 rounded-md" @click="">
        <span class="pi pi-times"></span>
      </button>

      <button class="flex items-center gap-2 bg-[#637aad] hover:bg-[#4a68a8] text-white px-4 py-2 rounded-md"
        @click="openCreateDialog()">
        <span class="pi pi-plus"></span>
        Create
      </button>
    </div>
  </div>

  <!-- Table -->
  <div class="bg-white rounded-lg overflow-hidden">
    <table class="w-full text-left text-black">
      <thead class="bg-[#383838] text-gray-300 text-sm">
        <tr>
          <th class="px-6 py-3"> Name</th>
          <th class="px-6 py-3 text-center">Action</th>
        </tr>
      </thead>

      <tbody class="divide-y">

        <!-- <tr v-if=".length === 0">
              <td colspan="2" class="text-center py-6 text-gray-500">
                No data found
              </td>
            </tr> -->

        <!-- <tr v-else v-for="category in categoryStore.categories" :key="category.category_id"> -->
        <tr>
          <td class="px-6 py-2"></td>

          <td class="px-6 py-3 flex justify-center space-x-2">
            <button @click="openEdit()">
              <span class="pi pi-pencil"></span>
            </button>

            <button @click="openDelete()">
              <span class="pi pi-trash"></span>
            </button>
          </td>
        </tr>

      </tbody>
    </table>
  </div>


  <!-- Dialog -->
  <div v-if="showDialog" class="overlay">
    <div class="dialog">
      <h2 class="text-lg font-semibold mb-4">
        {{ mode === 'create' ? 'Create Brand' : 'Edit Brand' }}
      </h2>

      <div class="mb-3">
        <label class="block mb-1">Brand Name</label>
        <input type="text" class="border w-full px-3 py-2 rounded bg-gray-50" />
      </div>

      <div class="flex justify-center gap-4">
        <button class="bg-red-500 text-white px-4 py-1 rounded" @click="closeDialog">
          Close
        </button>

        <button class="bg-green-500 text-white px-4 py-1 rounded" @click="showConfirm = true">
          Save
        </button>
      </div>
    </div>
  </div>

  <ConfirmComponent :show="showConfirm" type="save" message="บันทึกข้อมูลนี้หรือไม่" @cancel="showConfirm = false" />

  <ConfirmComponent :show="deleteConfirm" type="delete" message="ต้องการลบข้อมูลนี้หรือไม่" />

  <LoadingComponent v-model="loadingStore.loading" />
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
}
</style>