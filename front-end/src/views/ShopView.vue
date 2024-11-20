<script setup lang="ts">
import { useProductStore } from '../stores/product'
import { onMounted } from 'vue'

const productStore = useProductStore()

onMounted(async () => {
  await productStore.getProducts()
})
</script>

<template>
  <div class="flex justify-center h-full w-full gap-1 flex-wrap bg-[#414141] px-[40px] pt-[70px]">
    <div
      class="bg-[#ffffff] h-[1100px] w-[350px] mt-[25px] rounded-[10px] shadow-xl mr-[15px]"
    ></div>

    <div class="h-full w-[1050px] flex gap-4 py-[30px] px-[6px] flex-wrap">
      <div class="" v-for="item of productStore.products" :key="item.product_id">
        <div
          class="bg-[#ffffff] w-[245px] h-[320px] rounded-[10px] pt-[15px] shadow-xl transition-transform duration-400 hover:scale-105 cursor-pointer"
          @click="console.log('hello')"
        >
          <div class="flex justify-center">
            <img
              class="w-[200px] h-[180px] object-cover"
              :src="`http://localhost:3000/${item.images[0].image}`"
              alt=""
            />
          </div>
          <div class="flex justify-center">
            <div class="font-bold">{{ item.title }}</div>
          </div>
          <div class="flex justify-between px-[20px] pt-[50px]">
            <div>{{ item.price }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
