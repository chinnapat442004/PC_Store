<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import ConfirmComponent from '@/components/dialogs/ConfirmComponent.vue'
import { useProductStore } from '@/stores/product'
import type { Product } from '@/types/Product'
import { useCategoryStore } from '@/stores/category'
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import { useLoadingStore } from '@/stores/loading'
import LoadingComponent from '@/components/LoadingComponent.vue'
const loadingStore = useLoadingStore()
const ProductStore = useProductStore()
const CategoryStory =useCategoryStore()
const showDialog = ref(false)
const search = ref('')
const showConfirm = ref(false)
const deleteConfirm = ref(false)
const previewImage = ref<string | null>(null);
const mode = ref<'create' | 'edit'>('create')
const editingId = ref<number | null>(null)
const selectedCategory = ref<any>(null)


onMounted(async () => {
  await ProductStore.getProducts()
  await CategoryStory.getCategories()

})

watch(selectedCategory, (val) => {
  if (val) {
    ProductStore.editedProduct.categoryId = val.category_id
  }
})
watch(
  () => CategoryStory.categories,
  (cats) => {
    if (
      mode.value === 'edit' &&
      ProductStore.editedProduct.categoryId
    ) {
      selectedCategory.value =
        cats.find(
          (c) => c.category_id === ProductStore.editedProduct.categoryId
        ) || null
    }
  },
  { immediate: true }
)


const  openEdit =async (product: Product) => {
  mode.value = 'edit'
  editingId.value = product.product_id

  ProductStore.editedProduct = {
    title: product.title,
    description: product.description,
    price: product.price,
    quantity: product.quantity,
    images: product.images,
    categoryId: product.categoryId,
    files: []
  }
  
  if (CategoryStory.categories.length === 0) {
    await CategoryStory.getCategories()
  }


  selectedCategory.value = product.category ?? null

  previewImage.value = null

  showDialog.value = true
}

const saveProduct = async () => {
  try {
    if (mode.value === 'create') {
      await ProductStore.addProduct()
    } else if (mode.value === 'edit' && editingId.value) {
      await ProductStore.updateProduct(editingId.value)
    }

    await ProductStore.getProducts()

    showDialog.value = false
    showConfirm.value = false
    ProductStore.clearProduct()
    previewImage.value = null
    editingId.value = null
  } catch (err) {
    console.error(err)
  }
}

const closeDialog = () => {
// ProductStore.clearProduct()
  showDialog.value = false
}

const openCreateDialog = () => {
  ProductStore.clearProduct()
  mode.value = 'create'
  showDialog.value = true
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

const openDelete = (item: Product) => {
  deleteConfirm.value = true
  editingId.value = item.product_id
}

const removeItem = async () => {
  if (!editingId.value) return

  await ProductStore.deleteProduct(editingId.value)

  deleteConfirm.value = false
  editingId.value = null
}

const closeDialogDelete = () => {
  deleteConfirm.value = false
  editingId.value = null
}


// const handleFileUpload = (event: Event) => {
//   const input = event.target as HTMLInputElement;
//   const file = input.files?.[0];
//   if (!file) return;

//   // เก็บไฟล์ไว้ส่ง backend
//   // ProductStore.editedProduct.images = file;

//   // preview
//   previewImage.value = URL.createObjectURL(file);
// };


const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (!files || files.length === 0) return

  ProductStore.editedProduct.files = Array.from(files)

  previewImage.value = URL.createObjectURL(files[0])
}


const clearSearch = async () => {
  search.value = ''
  ProductStore.search = ''
  ProductStore.page = 1
  await ProductStore.getProducts()
}
const removeImage = () => {
  previewImage.value = null
  ProductStore.editedProduct.files = []
  
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
              <th class="px-6 py-3">Category</th>
              <th class="px-6 py-3">Price</th>
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
                  :src="product.images[0].image"
                  alt=""
                  class="h-32 w-32 object-cover rounded"
                />
              </td>
              <td class="px-6 py-1">{{ product.title }}</td>
           
  
              <td class="px-6 py-1">{{ product.description }}</td>
                           <td class="px-6 py-1">
 {{ product.category?.name }}
  
</td>
              <td class="px-6 py-1">{{ product.price }}</td>

            <td class="px-6 py-1 align-middle">
  <div class="flex justify-center items-center space-x-2">
    <button class="edit-btn" @click="openEdit(product)">
      <span class="pi pi-pencil"></span>
    </button>

    <button class="delete-btn" @click="openDelete(product)">
      <span class="pi pi-trash"></span>
    </button>
  </div>
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
<!-- Dialog -->
<div v-if="showDialog " class="overlay">
  <div class="dialog">
    <h2 class="text-lg font-semibold mb-4">
      {{ mode === 'create' ? 'Create Product' : 'Edit Product' }}
    </h2>

    <!-- Title -->
    <div class="mb-3">
      <label>Title</label>
      <input
        v-model="ProductStore.editedProduct.title"
        type="text"
        placeholder="Enter product title"
        class="border w-full px-3 py-2 rounded bg-gray-50"
      />
    </div>

   <!-- Image Upload -->
<div class="mb-3">
  <label class="block mb-1 text-sm text-gray-700">Upload Image</label>

  <button
    type="button"
    @click="$refs.fileInput.click()"
    class="px-4 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition"
  >
    Choose Image
  </button>

  <input
    type="file"
    accept="image/*"
    ref="fileInput"
    class="hidden"
    @change="handleFileUpload"
  />
</div>

   
<div
  class="mt-3 flex justify-center"
  v-if="previewImage || ProductStore.editedProduct.images?.length"
>
  <div class="relative">
    
    <img
      :src="previewImage || ProductStore.editedProduct.images?.[0]?.image"
      class="w-40 h-40 object-cover rounded-lg border"
    />

   
    <button
        v-if="previewImage !== null"
      @click="removeImage"
      class="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow"
    >
      ✕
    </button>

  </div>
</div>
    

    <!-- Description -->
    <div class="mb-3">
      <label>Description</label>
      <textarea
        v-model="ProductStore.editedProduct.description"
        placeholder="Enter description"
        class="border w-full px-3 py-2 rounded bg-gray-50"
      ></textarea>
    </div>

    <!-- Price -->
    <div class="mb-3">
      <label>Price</label>
      <input
        v-model.number="ProductStore.editedProduct.price"
        type="number"
        placeholder="Enter price"
        class="border w-full px-3 py-2 rounded bg-gray-50"
      />
    </div>

    <!-- Quantity -->
    <div class="mb-3">
      <label>Quantity</label>
      <input
        v-model.number="ProductStore.editedProduct.quantity"
        type="number"
        placeholder="Enter quantity"
        class="border w-full px-3 py-2 rounded bg-gray-50"
      />
    </div>

   <!-- Category -->
<div class="mb-3">
  <label >Category</label>

  <Listbox v-model="selectedCategory">
    <div class="relative">

      <!-- Button -->
      <ListboxButton
        class="w-full border border-gray-300 bg-gray-50 px-3 py-2 rounded text-left text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 flex justify-between items-center"
      >
        <span class="truncate">
   {{ selectedCategory?.name ?? 'Select category' }}
        </span>

        <ChevronUpDownIcon class="w-4 h-4 text-gray-400" />
      </ListboxButton>

      <!-- Dropdown -->
      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <ListboxOptions
          class="absolute z-50 bottom-full mb-1 w-full max-h-60 overflow-auto rounded border border-gray-200 bg-white shadow-md text-sm"
        >
          <ListboxOption
            v-for="cat in CategoryStory.categories"
            :key="cat.category_id"
            :value="cat"
            v-slot="{ active, selected }"
          >
            <li
              :class="[
                'cursor-pointer px-3 py-2 flex justify-between items-center',
                active ? 'bg-gray-100' : '',
              ]"
            >
              <span :class="selected ? 'font-medium text-gray-900' : 'text-gray-700'">
                {{ cat.name }}
              </span>

              <CheckIcon
                v-if="selected"
                class="w-4 h-4 text-gray-500"
              />
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>

    </div>
  </Listbox>
</div>

    <!-- Buttons -->
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
  @confirm="removeItem"
  @cancel="closeDialogDelete()"
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
