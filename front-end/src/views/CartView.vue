<script setup lang="ts">
import { useCartStore } from '../stores/cart'

import type { CartDetail } from '../types/CartDetail'
import { trash } from 'ionicons/icons'
import { IonIcon } from '@ionic/vue'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import LoadingComponent from '@/components/LoadingComponent.vue'
import { useLoadingStore } from '@/stores/loading'
const loadingStore = useLoadingStore()
const cartStore = useCartStore()

const authStore = useAuthStore()

onMounted(async () => {
  await authStore.getCurrentUser()
  cartStore.getCarts()
 
})

async function plus(detail: CartDetail) {
  detail.quantity++
  detail.price = detail.product.price * detail.quantity
  const cart = cartStore.cart
  if (cart) {
    cart.total_amount = cart.cartDetails.reduce((total, cartDetail) => {
      if (cartDetail.price) {
        return total + cartDetail.price
      }
      return total
    }, 0)
  }

  try {
    if (cartStore.cart) cartStore.update(cartStore.cart, detail)
  } catch (error) {
    console.error('Failed to update cart:', error)
  }
}

async function minus(detail: CartDetail) {
  if (detail.quantity > 1) {
    detail.quantity--
    detail.price = detail.product.price * detail.quantity

    const cart = cartStore.cart
    if (cart) {
      cart.total_amount = cart.cartDetails.reduce((total, cartDetail) => {
        if (cartDetail.price) {
          return total + cartDetail.price
        }
        return total
      }, 0)
    }
    try {
      if (cartStore.cart) cartStore.update(cartStore.cart, detail)
    } catch (error) {
      console.error('Failed to update cart:', error)
    }
  }
}

async function remove(cartDetail: CartDetail) {
  cartStore.remove(cartDetail)
  await cartStore.getCarts()
  const cart = cartStore.cart
  if (cart && cart.cartDetails) {
    // ลบ cartDetail ออกจาก cartDetails
    cart.cartDetails = cart.cartDetails.filter(
      (detail) => detail.cart_detail_id !== cartDetail.cart_detail_id,
    )
  }

  if (cart) {
    cart.total_amount = cart.cartDetails.reduce((total, cartDetail) => {
      if (cartDetail.price) {
        return total + cartDetail.price
      }
      return total
    }, 0)
  }
}
</script>

<template>
  <div
    class="flex justify-center w-full h-full min-h-screen gap-3 md:flex-nowrap flex-wrap bg-[#414141] px-[40px] pt-[30px] m-auto pb-[20px]"
  >
    <div class="max-w-[750px] w-full min-w-[300px] flex flex-col gap-3 h-full">
      <div
        v-for="detail in cartStore.cart?.cartDetails"
        :key="detail.cart_detail_id"
        class="bg-white rounded-[10px] h-auto flex sm:h-[120px] px-[5px] md:px-[10px] lg:px-[30px] mx-auto w-full"
      >
        <div class="flex  items-center ">
          <img
            :src="detail.product.images[0]?.image"
            alt=""
            class="w-[100px] h-[100px] object-cover rounded-[5px] "
          />
        </div>
        <div class="w-full pt-2 pb-4 px-7 flex flex-col justify-around gap-3 sm:gap-0">
          <div class="flex justify-between items-center">
            <div class="font-medium">{{ detail.product.title }}</div>
            <div
              class="flex transition-transform duration-500 ease-in-out justify-center items-center"
            >
           <div class="font-medium text-red-400 text-sm md:text-base">฿{{ detail.price }} </div>
            </div>
          </div>

          <div class="flex flex-row  justify-between gap-3 sm:gap-0">
            <!-- <div class="flex md:w-1/4 sm:w-1/3 w-1/2 justify-between">
              <div>
                <button
                  class="rounded-[5px] flex justify-center items-center text-[25px] text-[white] h-[30px] w-[30px] bg-[#4c4b4b]"
                  @click="minus(detail)"
                >
                  -
                </button>
              </div>

              <div class="text-[20px]">{{ detail.quantity }}</div>
              <div>
                <button
                  class="rounded-[5px] flex justify-center items-center text-[25px] h-[30px] w-[30px] text-[white] bg-[#4c4b4b]"
                  @click="plus(detail)"
                >
                  +
                </button>
              </div>
            </div> -->

            <div class="flex items-center gap-4 bg-gray-100 px-2 py-1 rounded-lg">
                <button
                  class="rounded-md flex justify-center items-center text-white h-[27px] w-[27px] bg-[#4c4b4b] hover:bg-gray-800 transition active:scale-95"
                  @click="minus(detail)"
                >
                  <span class="mb-1">-</span>
                </button>

                <div class="text-[10px] md:text-[14px] font-medium min-w-[30px] text-center">{{ detail.quantity}}</div>

                <button
                  class="rounded-md flex justify-center items-center  h-[27px] w-[27px] text-white bg-[#4c4b4b] hover:bg-gray-800 transition active:scale-95"
              @click="plus(detail)"
                >
                  <span class="mb-1">+</span>
                </button>
              </div>

            
            <div class="flex gap-4 items-center">
                     <div
              class="flex transition-transform duration-500 ease-in-out justify-center items-center"
            >
              <button
                class="bg-[#da6969] w-[30px] h-[30px] text-white rounded-[5px] hover:bg-[#d94f4f]"
                @click="remove(detail)"
              >
                <IonIcon class="" :icon="trash" />
              </button>
            </div>

              
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white max-w-[750px] w-full   md:w-[400px] rounded-[10px] p-[20px] h-[250px]">
      <div>
        <div class="flex justify-between">
          <div>ยอดรวม</div>
          <div>{{ cartStore.cart?.total_amount }}</div>
        </div>
        <div>
          <button class="bg-[#82d182] w-full mt-[60px] h-[35px] hover:bg-[#69c769] rounded-[10px]">
            ชำระเงิน
          </button>
        </div>
      </div>
    </div>
  </div>

  
   <LoadingComponent v-model="loadingStore.loading" />
</template>
