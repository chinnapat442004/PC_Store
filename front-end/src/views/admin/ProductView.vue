<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import ConfirmComponent from '@/components/dialogs/ConfirmComponent.vue'
import { useProductStore } from '@/stores/product'
import type { Product } from '@/types/Product'
import { useCategoryStore } from '@/stores/category'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import { useLoadingStore } from '@/stores/loading'
import LoadingComponent from '@/components/LoadingComponent.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import ToggleSwitch from '@/components/ToggleSwitch.vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

const loadingStore = useLoadingStore()
const productStore = useProductStore()
const categoryStore = useCategoryStore()

const showDialog = ref(false)
const search = ref('')
const showConfirm = ref(false)
const previewImage = ref<string | null>(null)
const mode = ref<'create' | 'edit'>('create')
const editingId = ref<number | null>(null)
import type { Category } from '@/types/Category'

const selectedCategory = ref<Category | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)


const createProductSchema = yup.object({
  title: yup.string().required('กรุณากรอกชื่อสินค้า'),
  description: yup.string().required('กรุณากรอกรายละเอียดสินค้า'),
  price: yup
    .number()
    .typeError('กรุณากรอกราคา')
    .required('กรุณากรอกราคา')
    .min(1, 'ราคาต้องมากกว่า 0'),
  categoryId: yup.number().required('กรุณาเลือกหมวดหมู่').typeError('กรุณาเลือกหมวดหมู่'),
  image: yup.mixed().required('กรุณาอัปโหลดรูปภาพ'),


})

const editProductSchema = yup.object({
  title: yup.string().required('กรุณากรอกชื่อสินค้า'),
  description: yup.string().required('กรุณากรอกรายละเอียดสินค้า'),
  price: yup
    .number()
    .typeError('กรุณากรอกราคา')
    .required('กรุณากรอกราคา')
    .min(1, 'ราคาต้องมากกว่า 0'),
  categoryId: yup.number().required('กรุณาเลือกหมวดหมู่').typeError('กรุณาเลือกหมวดหมู่'),
})



const {
  errors: createErrors,
  defineField: defineFieldCreate,
  validate: validateCreate,
  resetForm: resetFormCreate,
} = useForm({
  validationSchema: createProductSchema,
  validateOnMount: false,
})




const {
  errors: editErrors,
  defineField: defineFieldEdit,
  validate: validateEdit,
  resetForm: resetFormEdit,
} = useForm({
  validationSchema: editProductSchema,
  validateOnMount: false,
})

const [titleCreate] = defineFieldCreate('title')
const [descriptionCreate] = defineFieldCreate('description')
const [priceCreate] = defineFieldCreate('price')
const [categoryIdCreate] = defineFieldCreate('categoryId')
const [imageCreate] = defineFieldCreate('image')

const [titleEdit] = defineFieldEdit('title')
const [descriptionEdit] = defineFieldEdit('description')
const [priceEdit] = defineFieldEdit('price')
const [categoryIdEdit] = defineFieldEdit('categoryId')




onMounted(async () => {
  await productStore.getProducts(1, 10, '')
  await categoryStore.getCategories(1, 10, '', true)
})



watch(selectedCategory, (val) => {
  if (!val) return

  productStore.editedProduct.categoryId = val.category_id

  if (mode.value === 'create') {
    categoryIdCreate.value = val.category_id
  } else {
    categoryIdEdit.value = val.category_id
  }
})

watch(
  () => categoryStore.categories,
  (cats) => {
    if (mode.value === 'edit' && productStore.editedProduct.categoryId) {
      selectedCategory.value =
        cats.find((c) => c.category_id === productStore.editedProduct.categoryId) || null
    }
  },
  { immediate: true },
)



const openEdit = async (product: Product) => {
  mode.value = 'edit'
  editingId.value = product.product_id

  productStore.editedProduct = {
    title: product.title,
    description: product.description,
    price: product.price,
    images: product.images,
    categoryId: product.categoryId,
    files: [],
  }

  if (categoryStore.categories.length === 0) {
    await categoryStore.getCategories()
  }

  selectedCategory.value = product.category ?? null
  previewImage.value = null

  resetFormEdit({
    values: {
      title: product.title,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId,
    },
  })

  showDialog.value = true
}

const preSave = async () => {
  if (mode.value === 'create') {
    const { valid } = await validateCreate()
    if (!valid) return
  } else {
    const { valid } = await validateEdit()
    if (!valid) return
  }
  showConfirm.value = true
}

const saveProduct = async () => {
  showDialog.value = false
  showConfirm.value = false
  try {
    if (mode.value === 'create') {
      await productStore.addProduct()
    } else if (mode.value === 'edit' && editingId.value) {
      await productStore.updateProduct(editingId.value)
    }

    await productStore.getProducts()
    productStore.clearProduct()
    previewImage.value = null
    editingId.value = null
  } catch (err) {
    console.error(err)
  }
}

const closeDialog = () => {
  showDialog.value = false
}

const openCreateDialog = () => {
  productStore.clearProduct()
  selectedCategory.value = null
  previewImage.value = null

  mode.value = 'create'

  resetFormCreate({
    values: {
      title: '',
      description: '',
      price: undefined,
      categoryId: undefined,
      image: undefined,
    },
  })

  showDialog.value = true
}

const nextPage = async () => {
  if (productStore.page < productStore.lastPage) {
    productStore.page++
    await productStore.getProducts()
  }
}

const prevPage = async () => {
  if (productStore.page > 1) {
    productStore.page--
    await productStore.getProducts()
  }
}

const searchProduct = async () => {
  productStore.search = search.value
  await productStore.getProducts()
}

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (!files || files.length === 0) return

  productStore.editedProduct.files = Array.from(files)
  previewImage.value = URL.createObjectURL(files[0])


  imageCreate.value = files[0]
}

const clearSearch = async () => {
  search.value = ''
  productStore.search = ''
  productStore.page = 1
  await productStore.getProducts()
}


const removeImage = () => {
  previewImage.value = null
  productStore.editedProduct.files = []


  imageCreate.value = undefined
}
</script>

<template>
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold text-white">Product Management</h1>

    <div class="flex items-center gap-3">
      <input type="text" placeholder="ค้นหาสินค้า..." v-model="search" class="border px-3 py-2 rounded w-64" />
      <button class="bg-white/10 hover:bg-white/20 text-white p-2 rounded-md flex items-center justify-center"
        @click="searchProduct()">
        <span class="pi pi-search text-lg"></span>
      </button>
      <button class="bg-white/10 hover:bg-white/20 text-white p-2 rounded-md flex items-center justify-center"
        @click="clearSearch()">
        <span class="pi pi-times text-lg"></span>
      </button>
      <button class="flex items-center gap-2 bg-[#637aad] hover:bg-[#4a68a8] text-white px-4 py-2 rounded-md transition"
        @click="openCreateDialog()">
        <span class="pi pi-plus text-lg"></span>
        <span>เพิ่มสินค้า</span>
      </button>
    </div>
  </div>

  <div class="bg-white rounded-lg overflow-hidden">
    <table class="w-full text-left text-black">
      <thead class="bg-[#383838] text-gray-300 text-sm">
        <tr>
          <th class="px-6 py-3">รูปภาพ</th>
          <th class="px-6 py-3">ชื่อสินค้า</th>
          <th class="px-6 py-3">รายละเอียด</th>
          <th class="px-6 py-3">หมวดหมู่</th>
          <th class="px-6 py-3">ราคา</th>
          <th class="px-6 py-3 text-center">สถานะ</th>
          <th class="px-3 py-3">เปิดใช้งาน</th>
          <th class="px-6 py-3 text-center">จัดการ</th>
        </tr>
      </thead>
      <tbody class="divide-y">
        <tr v-if="productStore.products.length === 0">
          <td colspan="6" class="text-center py-6 text-gray-500">ไม่พบข้อมูล</td>
        </tr>
        <tr v-for="product in productStore.products" :key="product.product_id">
          <td class="text-center align-middle">
            <img :src="product.images[0].image" alt="" class="h-32 w-32 object-cover rounded" />
          </td>
          <td class="px-6 py-1">{{ product.title }}</td>
          <td class="px-6 py-1">{{ product.description }}</td>
          <td class="px-6 py-1">{{ product.category?.name }}</td>
          <td class="px-6 py-1">{{ product.price }}</td>
          <td class="px-6 py-2 text-center">
            <StatusBadge :modelValue="product.is_active" />
          </td>
          <td class="px-6 py-1 align-middle">
            <ToggleSwitch :modelValue="product.is_active" @update:modelValue="
              productStore.toggleProductActive(product.product_id).then(() => productStore.getProducts())
              " />
          </td>
          <td class="px-6 py-1 align-middle">
            <div class="flex justify-center items-center space-x-4">
              <button class="edit-btn" @click="openEdit(product)">
                <span class="pi pi-pencil"></span>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="flex justify-end items-center gap-4 py-4 border-t mr-3">
      <button class="px-3 py-1 border rounded hover:bg-gray-100" @click="prevPage()">
        <span class="pi pi-chevron-left text-sm"></span> ก่อนหน้า
      </button>
      <span class="text-sm text-gray-600">{{ productStore.page }} จาก {{ productStore.lastPage }}</span>
      <button class="px-3 py-1 border rounded hover:bg-gray-100" @click="nextPage()">
        ถัดไป <span class="pi pi-chevron-right text-sm"></span>
      </button>
    </div>
  </div>

  <div v-if="showDialog" class="overlay">
    <div class="dialog">
      <h2 class="text-lg font-semibold mb-4">
        {{ mode === 'create' ? 'เพิ่มสินค้า' : 'แก้ไขสินค้า' }}
      </h2>

      <div class="mb-3">
        <label class="text-sm font-medium after:content-['*'] after:text-red-500 after:ml-1">ชื่อสินค้า</label>
        <input v-if="mode === 'create'" v-model="titleCreate" type="text" placeholder="กรอกชื่อสินค้า"
          class="border w-full px-3 py-2 rounded bg-gray-50" :class="{ 'border-red-500': createErrors.title }" />
        <input v-else v-model="titleEdit" type="text" placeholder="กรอกชื่อสินค้า"
          class="border w-full px-3 py-2 rounded bg-gray-50" :class="{ 'border-red-500': editErrors.title }" />
        <p v-if="mode === 'create' && createErrors.title" class="text-red-500 text-xs mt-1">
          {{ createErrors.title }}
        </p>
        <p v-if="mode === 'edit' && editErrors.title" class="text-red-500 text-xs mt-1">
          {{ editErrors.title }}
        </p>
      </div>

      <div class="mb-3">
        <label class="block mb-1 text-sm font-medium"
          :class="mode === 'create' ? 'after:content-[\'*\'] after:text-red-500 after:ml-1' : ''">อัปโหลดรูปภาพ</label>
        <button type="button" @click="fileInput?.click()"
          class="px-4 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition"
          :class="{ 'border-red-500': mode === 'create' && createErrors.image }">
          เลือกรูปภาพ
        </button>
        <input type="file" accept="image/*" ref="fileInput" class="hidden" @change="handleFileUpload" />
        <p v-if="mode === 'create' && createErrors.image" class="text-red-500 text-xs mt-1">
          {{ createErrors.image }}
        </p>
      </div>

      <div class="mt-3 flex justify-center" v-if="previewImage || productStore.editedProduct.images?.length">
        <div class="relative">
          <img :src="previewImage || productStore.editedProduct.images?.[0]?.image"
            class="w-40 h-40 object-cover rounded-lg border" />
          <button v-if="previewImage !== null" @click="removeImage"
            class="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow">✕</button>
        </div>
      </div>

      <div class="mb-3">
        <label class="text-sm font-medium after:content-['*'] after:text-red-500 after:ml-1">รายละเอียดสินค้า</label>
        <textarea v-if="mode === 'create'" v-model="descriptionCreate" placeholder="กรอกรายละเอียดสินค้า"
          class="border w-full px-3 py-2 rounded bg-gray-50"
          :class="{ 'border-red-500': createErrors.description }"></textarea>
        <textarea v-else v-model="descriptionEdit" placeholder="กรอกรายละเอียดสินค้า"
          class="border w-full px-3 py-2 rounded bg-gray-50"
          :class="{ 'border-red-500': editErrors.description }"></textarea>
        <p v-if="mode === 'create' && createErrors.description" class="text-red-500 text-xs mt-1">
          {{ createErrors.description }}
        </p>
        <p v-if="mode === 'edit' && editErrors.description" class="text-red-500 text-xs mt-1">
          {{ editErrors.description }}
        </p>
      </div>

      <div class="mb-3">
        <label class="text-sm font-medium after:content-['*'] after:text-red-500 after:ml-1">ราคา</label>
        <input v-if="mode === 'create'" v-model.number="priceCreate" type="number" placeholder="กรอกราคา"
          class="border w-full px-3 py-2 rounded bg-gray-50" :class="{ 'border-red-500': createErrors.price }" />
        <input v-else v-model.number="priceEdit" type="number" placeholder="กรอกราคา"
          class="border w-full px-3 py-2 rounded bg-gray-50" :class="{ 'border-red-500': editErrors.price }" />
        <p v-if="mode === 'create' && createErrors.price" class="text-red-500 text-xs mt-1">
          {{ createErrors.price }}
        </p>
        <p v-if="mode === 'edit' && editErrors.price" class="text-red-500 text-xs mt-1">
          {{ editErrors.price }}
        </p>
      </div>

      <div class="mb-3">
        <label class="text-sm font-medium after:content-['*'] after:text-red-500 after:ml-1">หมวดหมู่</label>
        <Listbox v-model="selectedCategory">
          <div class="relative">
            <ListboxButton
              class="w-full border bg-gray-50 px-3 py-2 rounded text-left text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 flex justify-between items-center"
              :class="{
                'border-red-500': mode === 'create' ? createErrors.categoryId : editErrors.categoryId,
                'border-gray-300': mode === 'create' ? !createErrors.categoryId : !editErrors.categoryId,
              }">
              <span class="truncate">{{ selectedCategory?.name ?? 'เลือกหมวดหมู่' }}</span>
              <ChevronUpDownIcon class="w-4 h-4 text-gray-400" />
            </ListboxButton>
            <transition enter-active-class="transition duration-100 ease-out" enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-75 ease-in"
              leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
              <ListboxOptions
                class="absolute z-50 bottom-full mb-1 w-full max-h-60 overflow-auto rounded border border-gray-200 bg-white shadow-md text-sm">
                <ListboxOption v-for="cat in categoryStore.categories" :key="cat.category_id" :value="cat"
                  v-slot="{ active, selected }">
                  <li
                    :class="['cursor-pointer px-3 py-2 flex justify-between items-center', active ? 'bg-gray-100' : '']">
                    <span :class="selected ? 'font-medium text-gray-900' : 'text-gray-700'">{{ cat.name }}</span>
                    <CheckIcon v-if="selected" class="w-4 h-4 text-gray-500" />
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </div>
        </Listbox>
        <p v-if="mode === 'create' && createErrors.categoryId" class="text-red-500 text-xs mt-1">
          {{ createErrors.categoryId }}
        </p>
        <p v-if="mode === 'edit' && editErrors.categoryId" class="text-red-500 text-xs mt-1">
          {{ editErrors.categoryId }}
        </p>
      </div>

      <div class="flex justify-center gap-4">
        <button class="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition" @click="closeDialog()">
          ยกเลิก
        </button>
        <button class="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition" @click="preSave()">
          บันทึก
        </button>
      </div>
    </div>
  </div>

  <ConfirmComponent :show="showConfirm" type="save" message="คุณต้องการบันทึกข้อมูลนี้ใช่หรือไม่"
    @confirm="saveProduct()" @cancel="showConfirm = false" />

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
