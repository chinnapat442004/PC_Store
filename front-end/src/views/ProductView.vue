<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useProductStore } from '../stores/product'
import { useCartStore } from '../stores/cart'
import { toast } from 'vue3-toastify'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'
import { useLoadingStore } from '@/stores/loading'
import LoadingComponent from '@/components/LoadingComponent.vue'

const productStore = useProductStore()
const authStore = useAuthStore()
const cartStore = useCartStore()
const loadingStore = useLoadingStore()
const number = ref(1)
const isToastActive = ref(false)

const route = useRoute()
onMounted(async () => {
  cartStore.getCarts()
  const id = await Number(route.params.id as string)
  await productStore.getProduct(id)
})

function plus() {
  number.value++
}

function minus() {
  if (number.value > 1) {
    number.value--
  }
}

const addProduct = () => {
  if (!authStore.token) {
    router.push({ name: 'login' })
  } else {

    isToastActive.value = true
    toast.success('เพิ่มสินค้าลงในตะกร้า', {
      position: toast.POSITION.TOP_RIGHT,
      onClose: () => {
        isToastActive.value = false
      },
    })

  }
  cartStore.getCarts()
}

async function addCart() {
  if (!authStore.token) {
    router.replace({ name: 'login' })
  } else {
    cartStore.editedCartDetail.quantity = number.value
    if (cartStore.cart)
      await cartStore.addCartDetail(cartStore.editedCartDetail)
    await cartStore.getCarts()
    addProduct()
  }
}


</script>
<template>
  <LoadingComponent v-model="loadingStore.loading" />

  <div class="w-full flex justify-center p-6">
    <div v-show="!loadingStore.loading"
      class="bg-[#ffffff] w-full max-w-[900px] shadow-xl rounded-[10px] mx-auto overflow-hidden h-fit">
      <div v-if="productStore.product" class="flex flex-col md:flex-row p-[15px] sm:p-[30px]">

        <div
          class="relative flex justify-center items-start md:mr-[20px] lg:mr-[30px] w-full md:w-auto shrink-0 mb-6 md:mb-0">
          <img :src="productStore.editedProduct.images && productStore.editedProduct.images.length > 0
            ? productStore.editedProduct.images[0].image : ''" alt="Product Image" class="w-full max-w-[240px] sm:max-w-[280px] md:max-w-[320px] lg:max-w-[350px]
         aspect-square object-cover rounded-[10px] border-gray-200"
            :class="{ 'grayscale opacity-60': productStore.product?.stock_quantity === 0 }" />
          <div v-if="productStore.product?.stock_quantity === 0"
            class="absolute inset-0 flex items-center justify-center bg-black/10 rounded-[5px]">
            <span class="bg-red-50 text-red-500 px-2 py-1 rounded border border-red-200">
              สินค้าหมด
            </span>
          </div>
        </div>

        <div class="flex flex-col flex-1 pb-[10px] md:pb-[30px]">

          <div class="mb-6 md:mb-[50px]">
            <h1 class="text-[22px] md:text-[26px]  font-bold leading-tight mb-3">
              {{ productStore.editedProduct.title }}
            </h1>
            <p class="text-gray-600 text-sm md:text-base leading-relaxed break-words whitespace-pre-wrap">{{
              productStore.editedProduct.description }}</p>
          </div>

          <div class="mt-auto">

            <div class="flex flex-col sm:flex-row items-center sm:items-center justify-between mb-8 gap-6 sm:gap-0">
              <div class="text-[18px] md:text-[20px] font-bold text-red-400 shrink-0">
                ฿{{ productStore.editedProduct.price?.toLocaleString() || 0 }}
              </div>

              <div class="flex items-center gap-3 sm:gap-4 bg-gray-100 px-2 py-1.5 sm:py-2 rounded-lg">
                <button class="rounded-md flex justify-center items-center text-base sm:text-lg text-white 
           h-[28px] w-[28px] sm:h-[30px] sm:w-[30px] md:h-[32px] md:w-[32px]
           bg-[#4c4b4b] hover:bg-gray-800 transition active:scale-95" @click="minus"
                  :disabled="productStore.product?.stock_quantity === 0" :class="{
                    'opacity-50 cursor-not-allowed': productStore.product?.stock_quantity === 0
                  }">
                  <span class="mb-1">-</span>
                </button>

                <div class="text-[14px] sm:text-[16px] md:text-[18px] font-medium min-w-[28px] text-center">
                  {{ number }}
                </div>

                <button class="rounded-md flex justify-center items-center text-base sm:text-lg text-white 
           h-[28px] w-[28px] sm:h-[30px] sm:w-[30px] md:h-[32px] md:w-[32px]
           bg-[#4c4b4b] hover:bg-gray-800 transition active:scale-95" @click="plus"
                  :disabled="productStore.product?.stock_quantity === 0" :class="{
                    'opacity-50 cursor-not-allowed': productStore.product?.stock_quantity === 0
                  }">
                  <span class="mb-1">+</span>
                </button>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row justify-between gap-3 md:gap-4 mt-4">
              <button class="bg-white text-[#637aad] w-full 
           py-2 sm:py-2.5 md:py-1.5
           border-[2px] border-[#637aad] hover:bg-[#eaf0fb] 
           rounded-[8px] font-semibold
           text-[13px] sm:text-[14px] md:text-[15px]
           transition duration-300 flex justify-center items-center gap-2" @click="addCart"
                :disabled="productStore.product?.stock_quantity === 0" :class="{
                  'opacity-50 cursor-not-allowed': productStore.product?.stock_quantity === 0
                }">
                <span class="pi pi-shopping-cart text-[13px] sm:text-[14px]"></span>
                เพิ่มลงตะกร้า
              </button>

              <button class="bg-[#637aad] w-full 
           py-2 sm:py-2.5 md:py-1.5
           text-white rounded-[8px] hover:bg-[#4a68a8] 
           font-semibold
           text-[13px] sm:text-[14px] md:text-[15px]
           transition duration-300 shadow-md hover:shadow-lg 
           flex justify-center items-center gap-2" @click="addProduct"
                :disabled="productStore.product?.stock_quantity === 0" :class="{
                  'opacity-50 cursor-not-allowed': productStore.product?.stock_quantity === 0
                }">
                <span class="pi pi-credit-card text-[13px] sm:text-[14px]"></span>
                ซื้อเลย
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
