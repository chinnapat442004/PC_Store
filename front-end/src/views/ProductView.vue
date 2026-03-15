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
const search = ref('')
const route = useRoute()
onMounted(async () => {
  cartStore.getCart()
  const id = await Number(route.params.id as string) //
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
  cartStore.getCart()
}

async function addCart() {
  if (!authStore.token) {
    router.replace({ name: 'login' })
  } else {
    cartStore.editedCartDetail.quantity = number.value
    if (cartStore.cart) cartStore.addCartDetail(cartStore.cart, cartStore.editedCartDetail)
    await cartStore.getCart()
    addProduct()
  }
}

const searchProduct = async () => {
  productStore.search = search.value
  await productStore.getProducts()
}

</script>
<template>
  <LoadingComponent v-model="loadingStore.loading" />

  <div class="flex justify-center  flex-1 w-full pt-[40px] md:pt-[70px] bg-[#414141] px-[15px] pb-[40px] md:pb-0 min-h-screen">
    <div
      v-show="!loadingStore.loading"
      class="bg-[#ffffff] w-full max-w-[900px] shadow-xl rounded-[10px] mx-auto overflow-hidden h-fit"
    >
      <div class="flex flex-col md:flex-row p-[15px] sm:p-[30px]">
        <!-- Product Image -->
        <div class=" flex justify-center items-start md:mr-[20px] lg:mr-[30px] w-full md:w-auto shrink-0 mb-6 md:mb-0">
          <img
            :src="productStore.editedProduct.images && productStore.editedProduct.images.length > 0 ? `http://localhost:3000/${productStore.editedProduct.images[0].image}` : ''"
            alt="Product Image"
            class="w-full max-w-[350px] aspect-square object-cover rounded-[10px]   border-gray-200"
          />
        </div>

        <!-- Product Details -->
        <div class="flex flex-col flex-1 pb-[10px] md:pb-[30px]">
          <!-- Title & Description -->
          <div class="mb-6 md:mb-[50px]">
            <h1 class="text-[22px] md:text-[26px]  font-bold leading-tight mb-3">
              {{ productStore.editedProduct.title }}
            </h1>
            <p class="text-gray-600 text-sm md:text-base leading-relaxed break-words whitespace-pre-wrap">{{ productStore.editedProduct.description }}</p>
          </div>

          <div class="mt-auto">
            <!-- Price and Quantity Control -->
            <div class="flex flex-col sm:flex-row items-center sm:items-center justify-between mb-8 gap-6 sm:gap-0">
              <div class="text-[18px] md:text-[20px] font-bold text-red-400 shrink-0">
                ฿{{ productStore.editedProduct.price?.toLocaleString() || 0 }} 
              </div>
              
              <div class="flex items-center gap-4 bg-gray-100 px-4 py-2 rounded-lg">
                <button
                  class="rounded-md flex justify-center items-center text-xl text-white h-[35px] w-[35px] bg-[#4c4b4b] hover:bg-gray-800 transition active:scale-95"
                  @click="minus"
                >
                  <span class="mb-1">-</span>
                </button>

                <div class="text-[18px] md:text-[20px] font-medium min-w-[30px] text-center">{{ number }}</div>

                <button
                  class="rounded-md flex justify-center items-center text-xl h-[35px] w-[35px] text-white bg-[#4c4b4b] hover:bg-gray-800 transition active:scale-95"
                  @click="plus"
                >
                  <span class="mb-1">+</span>
                </button>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row justify-between gap-3 md:gap-4 mt-4">
              <button
                class="bg-white text-[#637aad] w-full py-3 md:py-1.5 border-[2px] border-[#637aad] hover:bg-[#eaf0fb] rounded-[8px] font-semibold transition duration-300  flex justify-center items-center gap-2"
                @click="addCart"
              >
                <span class="pi pi-shopping-cart"></span>
                เพิ่มลงตะกร้า
              </button>
              <button
                class="bg-[#637aad] w-full py-3 md:py-1.5 text-white rounded-[8px] hover:bg-[#4a68a8] font-semibold transition duration-300 shadow-md hover:shadow-lg  flex justify-center items-center gap-2"
                @click="addProduct"
              >
                <span class="pi pi-credit-card"></span>
                ซื้อเลย
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
