<script setup lang="ts">

import { onMounted, ref } from 'vue'
import ConfirmComponent from '@/components/dialogs/ConfirmComponent.vue'
import type { Category } from '@/types/Category'
import { useLoadingStore } from '@/stores/loading'
import LoadingComponent from '@/components/LoadingComponent.vue'
import { useCategoryStore } from '@/stores/category'

const loadingStore = useLoadingStore()
const categoryStore = useCategoryStore()

const showDialog = ref(false)
const search = ref('')
const showConfirm = ref(false)
const deleteConfirm = ref(false)

onMounted(async () => {
  await categoryStore.getCategories()
})

const mode = ref<'create' | 'edit'>('create')

const openEdit = (category: Category) => {
  mode.value = 'edit'
  categoryStore.editedCategory = { ...category }
  showDialog.value = true
}

const saveCategory = async () => {
  if (mode.value === 'create') {
    await categoryStore.createCategory()
  } else {
    await categoryStore.updateCategory(categoryStore.editedCategory.category_id!)
  }

  await categoryStore.getCategories()
  showDialog.value = false
  showConfirm.value = false
  categoryStore.resetForm()
}

const closeDialog = () => {
  categoryStore.resetForm()
  showDialog.value = false
}

const openCreateDialog = () => {
  mode.value = 'create'
  showDialog.value = true
}

const removeItem = async (category: Category) => {
  await categoryStore.deleteCategory(category.category_id!)
  await categoryStore.getCategories()
  categoryStore.resetForm()
}

const searchCategory = async () => {
  await categoryStore.getCategories()
}

const openDelete = (item: Category) => {
  deleteConfirm.value = true
  categoryStore.editedCategory = item
}

const closeDialogDelete = () => {
  deleteConfirm.value = false
  categoryStore.resetForm()
}

const clearSearch = async () => {
  search.value = ''
  await categoryStore.getCategories()
}
</script>

<template>

  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold text-white">Category Management</h1>

    <div class="flex items-center gap-3">
      <input type="text" placeholder="ค้นหาหมวดหมู่..." v-model="search" class="border px-3 py-2 rounded w-64" />

      <button class="bg-white/10 hover:bg-white/20 text-white p-2 rounded-md">
        <span class="pi pi-search"></span>
      </button>

      <button class="bg-white/10 hover:bg-white/20 text-white p-2 rounded-md" @click="clearSearch">
        <span class="pi pi-times"></span>
      </button>

      <button class="flex items-center gap-2 bg-[#637aad] hover:bg-[#4a68a8] text-white px-4 py-2 rounded-md"
        @click="openCreateDialog">
        <span class="pi pi-plus"></span>
        เพิ่มหมวดหมู่
      </button>
    </div>
  </div>

  <div class="bg-white rounded-lg overflow-hidden">
    <table class="w-full text-left text-black">
      <thead class="bg-[#383838] text-gray-300 text-sm">
        <tr>
          <th class="px-6 py-3">หมวดหมู่ </th>
          <th class="px-6 py-3 text-center">จัดการ</th>
        </tr>
      </thead>

      <tbody class="divide-y">

        <tr v-if="categoryStore.categories.length === 0">
          <td colspan="2" class="text-center py-6 text-gray-500">
            ไม่พบข้อมูล
          </td>
        </tr>

        <tr v-else v-for="category in categoryStore.categories" :key="category.category_id">
          <td class="px-6 py-2">{{ category.name }}</td>

          <td class="px-6 py-3 flex justify-center space-x-2">
            <button @click="openEdit(category)">
              <span class="pi pi-pencil"></span>
            </button>

            <button @click="openDelete(category)">
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
        {{ mode === 'create' ? 'เพิ่มหมวดหมู่' : 'แก้ไขหมวดหมู่' }}
      </h2>

      <div class="mb-3">
        <label class="block mb-1">ชื่อหมวดหมู่</label>
        <input v-model="categoryStore.editedCategory.name" type="text" placeholder="กรอกชื่อหมวดหมู่"
          class="border w-full px-3 py-2 rounded bg-gray-50" />
      </div>

      <div class="flex justify-center gap-4">
        <button class="bg-red-500 text-white px-4 py-1 rounded" @click="closeDialog">
          ยกเลิก
        </button>

        <button class="bg-green-500 text-white px-4 py-1 rounded" @click="showConfirm = true">
          บันทึก
        </button>
      </div>
    </div>
  </div>

  <ConfirmComponent :show="showConfirm" type="save" message="คุณต้องการบันทึกข้อมูลนี้ใช่หรือไม่"
    @confirm="saveCategory" @cancel="showConfirm = false" />

  <ConfirmComponent :show="deleteConfirm" type="delete" message="คุณต้องการลบข้อมูลนี้ใช่หรือไม่"
    @confirm="removeItem(categoryStore.editedCategory)" @cancel="closeDialogDelete" />

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