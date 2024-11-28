<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import { onMounted } from 'vue'
const cartStore = useCartStore()

onMounted(async () => {
  await cartStore.getCarts()
})
</script>

<template>
  <div
    class="flex justify-center w-full h-full gap-3 flex-wrap bg-[#414141] px-[40px] pt-[30px] min-h-screen"
  >
    <div v-for="item of cartStore.carts" :key="item.cart_id" class="overflow-auto w-[700px]">
      <div
        v-for="detail in item.cartDetails"
        :key="detail.cart_detail_id"
        class="bg-white max-w-full sm:max-w-[750px] rounded-[10px] mb-[30px] h-auto flex sm:h-[120px] px-[20px] sm:px-[50px] mx-auto"
      >
        <img
          :src="`http://localhost:3000/${detail.product.images[0].image}`"
          alt=""
          class="w-[100px] h-[100px] rounded-[5px] shadow-xl"
        />
        <div class="flex justify-between">
          <div>
            <div>{{ detail.product.title }}</div>
            <div class="flex justify-between">
              <div>{{ detail.quantity }}</div>
              <div>X</div>
              <div>{{ detail.product.price }}</div>
              <div>=</div>
              <div>{{ detail.price }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white w-[350px] rounded-[10px] p-[20px] h-[250px]">
      <div>
        <div class="flex justify-between">
          <div>ยอดรวม</div>
          <div>100</div>
        </div>
        <div class="flex justify-between">
          <div>ยอดรวม</div>
          <div>100</div>
        </div>
      </div>
    </div>
  </div>
</template>
