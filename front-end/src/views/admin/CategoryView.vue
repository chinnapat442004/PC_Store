<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ConfirmComponent from '@/components/dialogs/ConfirmComponent.vue'
import type { Category } from '@/types/Category'
import { useLoadingStore } from '@/stores/loading'
import LoadingComponent from '@/components/LoadingComponent.vue'
import { useCategoryStore } from '@/stores/category'
import StatusBadge from '@/components/StatusBadge.vue'
import ToggleSwitch from '@/components/ToggleSwitch.vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

const loadingStore = useLoadingStore()
const categoryStore = useCategoryStore()

const showDialog = ref(false)
const search = ref('')
const showConfirm = ref(false)

// Define category validation schema
const categorySchema = yup.object({
  name: yup.string().required('กรุณากรอกชื่อหมวดหมู่'),
})

// Setup vee-validate form
const {
  errors,
  defineField,
  validate,
  resetForm,
} = useForm({
  validationSchema: categorySchema,
  validateOnMount: false,
})

const [categoryName] = defineField('name')

onMounted(async () => {
  await categoryStore.getCategories(1, 10, '')
})

const mode = ref<'create' | 'edit'>('create')

const searchCategory = async () => {
  categoryStore.search = search.value
  categoryStore.page = 1
  await categoryStore.getCategories()
}

const clearSearch = async () => {
  search.value = ''
  categoryStore.search = ''
  categoryStore.page = 1
  await categoryStore.getCategories()
}

const openEdit = (category: Category) => {
  mode.value = 'edit'
  categoryStore.editedCategory = {
    category_id: category.category_id,
    name: category.name,
  }
  resetForm({
    values: {
      name: category.name,
    },
  })
  showDialog.value = true
}

const preSave = async () => {
  const { valid } = await validate()
  if (!valid) return
  showConfirm.value = true
}

const saveCategory = async () => {
  categoryStore.editedCategory.name = categoryName.value || ''

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
  resetForm({
    values: {
      name: '',
    },
  })
  categoryStore.resetForm()
  showDialog.value = true
}
</script>

<template>
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold text-white">Category Management</h1>

    <div class="flex items-center gap-3">
      <input type="text" placeholder="ค้นหาหมวดหมู่..." v-model="search" class="border px-3 py-2 rounded w-64" />

      <button class="bg-white/10 hover:bg-white/20 text-white p-2 rounded-md" @click="searchCategory">
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
          <th class="px-6 py-3 text-left w-[40%]">หมวดหมู่</th>

          <th class="px-6 py-3 text-center w-[20%]">สถานะ</th>

          <th class="px-3 py-3 text-center w-[20%]">เปิดใช้งาน</th>

          <th class="px-6 py-3 text-center w-[20%]">จัดการ</th>
        </tr>
      </thead>

      <tbody class="divide-y">
        <tr v-if="categoryStore.categories.length === 0">
          <td colspan="2" class="text-center py-6 text-gray-500">ไม่พบข้อมูล</td>
        </tr>

        <tr v-else v-for="category in categoryStore.categories" :key="category.category_id">
          <td class="px-6 py-2 ">{{ category.name }}</td>
          <td class="px-6 py-2 text-center ">
            <StatusBadge :modelValue="category.is_active" />
          </td>
          <td class="px-6 py-2 text-center ">
            <ToggleSwitch :modelValue="category.is_active" @update:modelValue="
              categoryStore
                .toggleCategoryActive(category)
                .then(() => categoryStore.getCategories())
              " />
          </td>
          <td class="px-6 py-2 text-center ">
            <button @click="openEdit(category)" class="edit-btn">
              <span class="pi pi-pencil"></span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="flex justify-end items-center gap-4 py-4 border-t mr-3">
      <button class="px-3 py-1 border rounded hover:bg-gray-100"
        @click="categoryStore.page > 1 && (categoryStore.page--, categoryStore.getCategories())"
        :disabled="categoryStore.page <= 1">
        <span class="pi pi-chevron-left text-sm"></span> ก่อนหน้า
      </button>

      <span class="text-sm text-gray-600"> {{ categoryStore.page }} จาก {{ categoryStore.lastPage }} </span>

      <button class="px-3 py-1 border rounded hover:bg-gray-100"
        @click="categoryStore.page < categoryStore.lastPage && (categoryStore.page++, categoryStore.getCategories())"
        :disabled="categoryStore.page >= categoryStore.lastPage">
        ถัดไป <span class="pi pi-chevron-right text-sm"></span>
      </button>
    </div>
  </div>

  <div v-if="showDialog" class="overlay">
    <div class="dialog">
      <h2 class="text-lg font-semibold mb-4">
        {{ mode === 'create' ? 'เพิ่มหมวดหมู่' : 'แก้ไขหมวดหมู่' }}
      </h2>

      <div class="mb-3">
        <label class="text-sm font-medium after:content-['*'] after:text-red-500 after:ml-1">ชื่อหมวดหมู่</label>
        <input v-model="categoryName" type="text" placeholder="กรอกชื่อหมวดหมู่"
          class="border w-full px-3 py-2 rounded bg-gray-50" :class="{ 'border-red-500': errors.name }" />
        <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
      </div>

      <div class="flex justify-center gap-4">
        <button class="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
          @click="closeDialog">ยกเลิก</button>

        <button class="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition" @click="preSave()">
          บันทึก
        </button>
      </div>
    </div>
  </div>

  <ConfirmComponent :show="showConfirm" type="save" message="คุณต้องการบันทึกข้อมูลนี้ใช่หรือไม่"
    @confirm="saveCategory" @cancel="showConfirm = false" />

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
