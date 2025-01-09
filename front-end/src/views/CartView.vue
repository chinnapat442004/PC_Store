<script setup lang="ts">
import { useCartStore } from '../stores/cart'
import { onMounted } from 'vue'
import type { CartDetail } from '../types/CartDetail'
import { trash } from 'ionicons/icons'
import { IonIcon } from '@ionic/vue'

const cartStore = useCartStore()

onMounted(async () => {
  cartStore.getCart()
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
  await cartStore.getCart()
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
    class="flex justify-center w-full h-full min-h-screen gap-3 flex-wrap bg-[#414141] px-[40px] pt-[30px] m-auto pb-[20px]"
  >
    <div class="w-[750px] flex flex-col gap-3 h-full">
      <div
        v-for="detail in cartStore.cart?.cartDetails"
        :key="detail.cart_detail_id"
        class="bg-white rounded-[10px] h-auto flex sm:h-[120px] px-[20px] sm:px-[50px] mx-auto w-full"
      >
        <div>
          <img
            :src="`http://localhost:3000/${detail.product.images[0]?.image}`"
            alt=""
            class="w-[100px] h-[100px] rounded-[5px] shadow-xl"
          />
        </div>
        <div class="w-full pt-2 pb-4 px-7 flex flex-col justify-around gap-3 sm:gap-0">
          <div class="flex justify-between items-center">
            <div class="font-medium">{{ detail.product.title }}</div>
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

          <div class="flex sm:flex-row flex-col justify-between gap-3 sm:gap-0">
            <div class="flex md:w-1/4 sm:w-1/3 w-1/2 justify-between">
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
            </div>
            <div class="flex gap-4 items-center">
              <div>{{ detail.quantity }}</div>
              <div>X</div>
              <div>{{ detail.product.price }}</div>
              <div>=</div>
              <div class="bg-[#7092a8] p-1 rounded-[5px] text-[white]">{{ detail.price }} ฿</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white w-[400px] rounded-[10px] p-[20px] h-[250px]">
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
</template>
