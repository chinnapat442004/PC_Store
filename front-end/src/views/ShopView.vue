<script setup lang="ts">
import type { Product } from '../types/Product'
import { useProductStore } from '../stores/product'
import { useCategoryStore } from '../stores/category'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import LoadingComponent from '@/components/LoadingComponent.vue'
import { useLoadingStore } from '@/stores/loading'
const loadingStore = useLoadingStore()
const router = useRouter()
const search = ref('')

const productStore = useProductStore()
const categoryStore = useCategoryStore()
const cartStore = useCartStore()

const min = ref(0)
const max = ref(100000)
const range = ref([0, 100000])

const checkbox = ref<number[]>([])

const sliderKey = ref(0)

onMounted(async () => {
  await productStore.getProducts(1, 1000)
  await categoryStore.getCategories()
})


const filteredProducts = computed(() => {
  const categoryFiltered = filteredCategory.value
  return categoryFiltered.filter(
    (product) => product.price >= range.value[0] && product.price <= range.value[1],
  )
})

const filteredCategory = computed(() => {
  if (!checkbox.value.length) {
    return productStore.products
  }

  return productStore.products.filter(
    (product) =>
      product.category?.category_id !== undefined &&
      checkbox.value.includes(product.category.category_id),
  )
})

function goToProduct(product: Product) {
  productStore.getProduct(product.product_id!)
  cartStore.editedCartDetail.product = product
  router.push({ name: 'product', params: { id: product.product_id } })
}

const updateSlider = () => {
  sliderKey.value++
}

const currentPage = ref(1)
const itemsPerPage = ref(16)

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProducts.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage.value) || 1
})

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

watch(filteredProducts, () => {
  currentPage.value = 1
})

const searchProduct = async () => {
  productStore.search = search.value
  await productStore.getProducts()
}
</script>

<template>
  <div class="w-full h-full  lg:px-[20px]  ">
    <div class="flex flex-col lg:flex-row justify-center  py-[30px] px-[10px] md:px-[20px] max-w-[1300px] m-auto gap-4">
      <div class=" flex flex-col gap-3 items-center">

        <div class="relative flex items-center w-full lg:w-[275px] py-2 bg-white rounded-[30px] shadow-md">
          <input type="text" placeholder="ค้นหาสินค้า"
            class="flex-grow bg-transparent outline-none text-black placeholder-black px-5" v-model="search" />
          <button class="absolute right-2 text-white bg-[#637aad] hover:bg-[#4a68a8] rounded-lg px-3 py-1 transition"
            @click="searchProduct()">
            ค้นหา
          </button>
        </div>
        <div class="bg-[#ffffff] w-full lg:w-[275px] rounded-[10px] shadow-xl p-[20px] md:p-[25px] h-fit">

          <div>
            <p class="font-semibold text-lg mb-2">ช่วงราคา</p>
          </div>
          <div class="flex justify-between items-center gap-2">
            <input type="number" v-model="range[0]"
              class="border-[1px] border-gray-400 w-full min-w-[80px] h-[40px] px-2 rounded-[5px]" :min="min"
              :max="range[1]" @input="updateSlider" />
            <p class="text-[20px]">-</p>
            <input type="number" v-model="range[1]"
              class="border-[1px] border-gray-400 w-full min-w-[80px] h-[40px] px-2 rounded-[5px]" :min="range[0]"
              :max="max" @input="updateSlider" />
          </div>

          <div class="pt-[30px]">
            <VueSlider v-model="range" :min="min" :max="max" :key="sliderKey" :drag-on-click="true" :tooltip="'none'"
              class="duration-0" :process-style="{ backgroundColor: '#414141' }"
              :rail-style="{ backgroundColor: '#e0e0e0' }" :dot-style="{
                backgroundColor: 'white',
                border: '2px solid black',
                outline: 'none',
                boxShadow: 'none',
              }" :dot-hover-style="{
                backgroundColor: '#cccccc',
                border: '2px solid black',
              }" />
            <hr class="border-t-2 border-gray-300 my-4" />
          </div>
          <!-- Categories -->
          <p class="font-semibold text-lg mb-2 pt-2">หมวดหมู่</p>
          <div class="flex flex-wrap lg:flex-col gap-3 lg:gap-1">
            <div class="p-[5px] flex items-center" v-for="item of categoryStore.categories" :key="item.category_id">
              <div class="pr-[12px]">
                <input type="checkbox" :id="`checkbox-${item.category_id}`" class="cursor-pointer scale-150"
                  :value="item.category_id" v-model="checkbox" />
              </div>
              <div>
                <label :for="`checkbox-${item.category_id}`" class="cursor-pointer text-[15px] md:text-[17px]">
                  {{ item.name }}
                </label>
              </div>
            </div>
          </div>
        </div>


      </div>


      <div class="flex-1 w-full">
        <div class="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 pb-[30px]">
          <div class="flex justify-center" v-for="item of paginatedProducts" :key="item.product_id">
            <div
              class="bg-[#ffffff] w-full max-w-[245px] aspect-[3/4] rounded-[10px] p-[10px] md:p-[15px] shadow-xl transition-transform duration-400 hover:scale-[1.03] cursor-pointer flex flex-col"
              @click="goToProduct(item)">
              <div class="relative flex justify-center flex-1 overflow-hidden rounded-[5px] bg-gray-50">

                <img
                  class="w-full h-full object-cover pointer-events-none select-none rounded-[5px] transition-all duration-300"
                  :class="{ 'grayscale opacity-60': item.stock_quantity === 0 }"
                  :src="item.images && item.images.length > 0 ? item.images[0].image : ''" alt="" />



              </div>

              <div class="flex justify-between flex-col h-[70px] md:h-[90px] pt-[10px]">
                <div class="font-bold text-sm md:text-base line-clamp-2 md:line-clamp-1 break-words leading-tight"
                  :class="{ 'text-gray-400': item.stock_quantity === 0 }" :title="item.title">
                  {{ item.title }}
                </div>

                <div class="flex justify-between items-end mt-1">
                  <div class="font-medium text-sm md:text-base"
                    :class="item.stock_quantity === 0 ? 'text-gray-400' : 'text-red-400'">
                    ฿{{ item.price.toLocaleString() }}
                  </div>

                  <div class="text-[10px] md:text-base font-medium">
                    <span v-if="item.stock_quantity === 0"
                      class="bg-red-50 text-red-500 px-2 py-1 rounded border border-red-200">
                      สินค้าหมด
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="totalPages > 1" class="flex justify-center md:justify-end items-center gap-2 md:gap-4 py-4 md:mr-3">
          <button
            class="bg-gray-100 px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            @click="prevPage" :disabled="currentPage === 1">
            <span class="pi pi-chevron-left text-sm"></span> <span class="hidden sm:inline">Prev</span>
          </button>

          <span class="text-sm text-white bg-[#555] px-3 py-1 rounded"> {{ currentPage }} / {{ totalPages }}</span>

          <button
            class="bg-gray-50 px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            @click="nextPage" :disabled="currentPage === totalPages">
            <span class="hidden sm:inline">Next</span> <span class="pi pi-chevron-right text-sm"></span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <LoadingComponent v-model="loadingStore.loading" />
</template>
