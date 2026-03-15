<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ConfirmComponent from '@/components/dialogs/ConfirmComponent.vue'

import { useProductStore } from '@/stores/product'
import type { Product } from '@/types/Product'
import product from '@/service/product'
const ProductStore = useProductStore()
const showDialog = ref(false)
const search = ref('')
const showConfirm = ref(false)
const deleteConfirm = ref(false)

onMounted(async () => {
  await ProductStore.getProducts()
})

const mode = ref<'create' | 'edit'>('create')

const openEdit = (Product: Product) => {
  // mode.value = 'edit'
  // ProductStore.editedProduct = { ...Product }
  // console.log(ProductStore.editedProduct)
  // showDialog.value = true
}

const saveProduct = async () => {
  // if (mode.value === 'create') {
  //   await ProductStore.addProduct(ProductStore.editedProduct)
  // } else {
  //   await ProductStore.updateProduct(ProductStore.editedProduct)
  // }
  // await ProductStore.getProductes()
  // showDialog.value = false
  // showConfirm.value = false
  // ProductStore.clearProduct()
}

const closeDialog = () => {
  // ProductStore.clearProduct()
  // showDialog.value = false
}

const openCreateDialog = () => {
  // mode.value = 'create'
  // showDialog.value = true
}

const removeItem = async (Product: Product) => {
  // await ProductStore.removeProduct(Product)
  // await ProductStore.getProductes()
  // ProductStore.clearProduct()
}

const nextPage = async () => {
  if (ProductStore.page < ProductStore.lastPage) {
    ProductStore.page++
    await ProductStore.getProducts()
  }
}

const prevPage = async () => {
  if (ProductStore.page > 1) {
    ProductStore.page--
    await ProductStore.getProducts()
  }
}

const searchProduct = async () => {
  ProductStore.search = search.value
  await ProductStore.getProducts()
}

const openDelete = async (item: Product) => {
  // deleteConfirm.value = true
  // ProductStore.editedProduct = item
}

const closeDialogDelete = async () => {
  // deleteConfirm.value = false
  // ProductStore.clearProduct()
}

const clearSearch = async () => {
  search.value = ''
  ProductStore.search = ''
  ProductStore.page = 1
  await ProductStore.getProducts()
}
</script>

<template>
  <div class="pl-[200px] w-full">
    <div class="h-full bg-[#414141] lg:px-[20px] min-h-screen pt-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-white">Product Management</h1>

        <div class="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search Product..."
            v-model="search"
            class="border px-3 py-2 rounded w-64"
          />

          <button
            class="bg-white/10 hover:bg-white/20 text-white p-2 rounded-md flex items-center justify-center"
            @click="searchProduct()"
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
              <th class="px-6 py-3">Product Name</th>
              <th class="px-6 py-3">Product Name</th>

              <th class="px-6 py-3">Description</th>
              <th class="px-6 py-3">Address</th>
              <th class="px-6 py-3">Status</th>
              <th class="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-if="ProductStore.products.length === 0">
              <td colspan="4" class="text-center py-6 text-gray-500">ไม่พบข้อมูลที่ค้นหา</td>
            </tr>
            <tr v-for="product in ProductStore.products" :key="product.product_id">
              <td class="text-center align-middle">
                <img
                  :src="`http://localhost:3000/${product.images[0].image}`"
                  alt=""
                  class="h-32 w-32 object-cover rounded"
                />
              </td>
              <td class="px-6 py-1">{{ product.title }}</td>
              <td class="px-6 py-1">{{ product.category?.name }}</td>
              <td class="px-6 py-1">{{ product.description }}</td>
              <td class="px-6 py-1">{{ product.price }}</td>

              <td class="px-6 py-1 flex justify-center space-x-2 ">
                <button class="edit-btn">
                  <span class="pi pi-pencil"></span>
                </button>

                <button class="delete-btn">
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
            {{ ProductStore.page }} of {{ ProductStore.lastPage }}</span
          >

          <button class="px-3 py-1 border rounded hover:bg-gray-100" @click="nextPage()">
            Next <span class="pi pi-chevron-right text-sm"></span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Dialog -->
  <div v-if="showDialog" class="overlay">
    <div class="dialog">
      <h2 class="text-lg font-semibold mb-4">
        <h2 class="text-lg font-semibold mb-4">
          {{ mode === 'create' ? 'Create Product' : 'Edit Product' }}
        </h2>
      </h2>

      <div class="mb-3">
        <label class="block mb-1">Product Name</label>
        <input
          type="text"
          class="border w-full px-3 py-2 rounded bg-gray-50"
          placeholder="Enter Product name"
        />
      </div>

      <div class="mb-3">
        <label class="block mb-1">Address</label>
        <input
          type="text"
          class="border w-full px-3 py-2 rounded bg-gray-50"
          placeholder="Enter address"
        />
      </div>

      <div class="mb-4">
        <label class="block mb-1">Status</label>
        <select class="border w-full px-3 py-2 rounded bg-gray-50">
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
    @confirm="saveProduct()"
    @cancel="showConfirm = false"
  />

  <ConfirmComponent
    :show="deleteConfirm"
    type="delete"
    message="คุณต้องการที่จะลบข้อมูลนี้ใช่หรือไม่"
    @confirm="removeItem(ProductStore.editedProduct)"
    @cancel="closeDialogDelete()"
  />
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
