<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ConfirmComponent from '@/components/dialogs/ConfirmComponent.vue'

import { useLoadingStore } from '@/stores/loading'
import LoadingComponent from '@/components/LoadingComponent.vue'
import { useShipmentStore } from '@/stores/shipment'
import type { Shipment } from '@/types/Shipment'


const loadingStore = useLoadingStore()
const shimpentStore = useShipmentStore()

const showDialog = ref(false)
const search = ref('')
const showConfirm = ref(false)
const deleteConfirm = ref(false)


const mode = ref<'create' | 'edit'>('create')

onMounted(async () => {
  await shimpentStore.getShipments()
})

const openEdit = (item: Shipment) => {
  shimpentStore.setEditShipment(item)
  mode.value = 'edit'
  showDialog.value = true
}


const openDelete = () => {
  deleteConfirm.value = true
}


const closeDialog = () => {
  showDialog.value = false
  shimpentStore.resetForm()
}

const openCreateDialog = () => {
  mode.value = 'create'
  showDialog.value = true
}

const saveShipment = async () => {
  await shimpentStore.createShipment()
  closeDialog()
  showConfirm.value = false
  shimpentStore.resetForm()
}


</script>

<template>



  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold text-white">Shipment Settings</h1>

    <div class="flex items-center gap-3">
      <input type="text" placeholder="Search..." v-model="search" class="border px-3 py-2 rounded w-64" />

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


  <div class="bg-white rounded-lg overflow-hidden">
    <table class="w-full text-left text-black">
      <thead class="bg-[#383838] text-gray-300 text-sm">
        <tr>
          <th class="px-6 py-3"> ผู้ให้บริการขนส่ง</th>
          <th class="px-6 py-3 text-center">จัดการ</th>
        </tr>
      </thead>

      <tbody class="divide-y">

        <tr v-if="shimpentStore.shipments.length === 0">
          <td colspan="2" class="text-center py-6 text-gray-500">
            No data found
          </td>
        </tr>

        <tr v-else v-for="shipment in shimpentStore.shipments" :key="shipment.shipment_id">

          <td class="px-6 py-2">{{ shipment.name }}</td>

          <td class="px-6 py-3 flex justify-center space-x-2">
            <button @click="openEdit(shipment)">
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



  <div v-if="showDialog" class="overlay">
    <div class="dialog">
      <h2 class="text-lg font-semibold mb-4">
        {{ mode === 'create' ? 'Create ' : 'Edit ' }}
      </h2>

      <div class="mb-3">
        <label class="block mb-1"> Name</label>
        <input v-model="shimpentStore.editedShipment.name" type="text"
          class="border w-full px-3 py-2 rounded bg-gray-50" />
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

  <ConfirmComponent :show="showConfirm" type="save" message="บันทึกข้อมูลนี้หรือไม่" @cancel="showConfirm = false"
    @confirm="saveShipment()" />

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