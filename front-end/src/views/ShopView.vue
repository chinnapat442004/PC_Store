<script setup lang="ts">
import type { Product } from '../types/Product'
import { useProductStore } from '../stores/product'
import { useCategoryStore } from '../stores/Category'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// const filteredProducts = ref<Product[]>([])
const productStore = useProductStore()
const categoryStore = useCategoryStore()

const min = ref(0)
const max = ref(50000)
const range = ref([0, 50000])

const sliderKey = ref(0)

onMounted(async () => {
  await productStore.getProducts()
  await categoryStore.getCategories()
})

const category = ref([])

const filteredProducts = computed(() => {
  return productStore.products.filter(
    (product) => product.price >= range.value[0] && product.price <= range.value[1],
  )
})

// watch([range], async () => {
//   await nextTick()
//   filteredProducts.value = productStore.products.filter(
//     (product) => product.price >= range.value[0] && product.price <= range.value[1],
//   )
// })

function goToProduct(product: Product) {
  productStore.getProduct(product)
  router.replace({ name: 'product', params: { id: product.product_id } })
}

const updateSlider = () => {
  sliderKey.value++
}
</script>

<template>
  <div
    class="flex justify-center w-full h-full gap-1 flex-wrap bg-[#414141] lg:px-[40px] min-h-screen"
  >
    <div
      class="bg-[#ffffff] w-[275px] mt-[25px] rounded-[10px] shadow-xl mr-[15px] px-[25px] pt-[25px] py-[35px] h-fit"
    >
      <div><p>ช่วงราคา</p></div>
      <div class="flex justify-between items-center">
        <input
          type="number"
          v-model="range[0]"
          class="border-[1px] border-gray-400 w-[100px] h-[40px] px-2 rounded-[5px]"
          :min="min"
          :max="range[1]"
          @input="updateSlider"
        />
        <p class="text-[20px]">-</p>
        <input
          type="number"
          v-model="range[1]"
          class="border-[1px] border-gray-400 w-[100px] h-[40px] rounded-[5px]"
          :min="range[0]"
          :max="max"
          @input="updateSlider"
        />
      </div>

      <div class="pt-[30px]">
        <VueSlider
          v-model="range"
          :min="min"
          :max="max"
          :key="sliderKey"
          :drag-on-click="true"
          :tooltip="'none'"
          class="duration-0"
          :process-style="{ backgroundColor: '#414141' }"
          :rail-style="{ backgroundColor: '#e0e0e0' }"
          :dot-style="{
            backgroundColor: 'white',
            border: '2px solid black',
            outline: 'none',
            boxShadow: 'none',
          }"
          :dot-hover-style="{
            backgroundColor: '#cccccc',
            border: '2px solid black',
          }"
        />
        <hr class="border-t-2 border-gray-300 my-4" />
      </div>
      <div>
        <div class="p-[5px] flex">
          <div class="pr-[12px]">
            <input type="checkbox" class="cursor-pointer scale-150" />
          </div>
          <div>
            <label class="cursor-pointer text-[17px]"> All</label>
          </div>
        </div>
      </div>

      <div class="p-[5px] flex" v-for="item of categoryStore.categories" :key="item.category_id">
        <div class="pr-[12px]">
          <input
            type="checkbox"
            :id="`checkbox-${item.category_id}`"
            class="cursor-pointer scale-150"
          />
        </div>
        <div>
          <label :for="`checkbox-${item.category_id}`" class="cursor-pointer text-[17px]">
            {{ item.name }}
          </label>
        </div>
      </div>
    </div>

    <div class="lg:w-[1050px] flex gap-3 lg:gap-4 py-[30px] px-[6px] flex-wrap justify-center">
      <div class="" v-for="item of filteredProducts" :key="item.product_id">
        <div
          class="bg-[#ffffff] w-[175px] h-[300px] sm:w-[245px] sm:h-[320px] lg:w-[245px] lg:h-[320px] rounded-[10px] py-[15px] px-[10px] shadow-xl transition-transform duration-400 hover:scale-105 cursor-pointer"
          @click="goToProduct(item)"
        >
          <div class="flex justify-center">
            <img
              class="w-[180] h-[160px] lg:w-[200px] lg:h-[180px] object-cover pointer-events-none select-none rounded-[5px]"
              :src="`http://localhost:3000/${item.images[0].image}`"
              alt=""
            />
          </div>
          <div class="flex justify-between flex-col h-[100px] px-[20px] pt-[10px]">
            <div class="font-bold">{{ item.title }}</div>
            <div class="flex justify-between">
              <div class="font-medium">{{ item.price }}</div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
