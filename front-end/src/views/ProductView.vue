<script setup lang="ts">
import { ref } from 'vue'
import { useProductStore } from '../stores/product'
const productStore = useProductStore()

const number = ref(1)

function plus() {
  number.value++
}

function minus() {
  if (number.value > 1) {
    number.value--
  }
}
</script>
<template>
  <div class="flex justify-center h-screen w-full pt-[70px] bg-[#414141]">
    <div
      class="bg-[#ffffff] max-w-full sm:max-w-[600px] lg:max-w-[900px] h-auto sm:h-[400px] lg:h-[500px] shadow-xl rounded-[5px] mx-auto"
    >
      <div class="flex p-[30px] flex-row justify-between">
        <img
          :src="`http://localhost:3000/${productStore.editedProduct.images[0].image}`"
          alt=""
          class="w-[350px] h-[350px] rounded-[5px] shadow-xl"
        />
        <div class="w-[650px] h-[350px] p-[30px]">
          <div class="pb-[50px]">
            <h1 class="text-[33px] font-medium pb-[20px]">
              {{ productStore.editedProduct.title }}
            </h1>
            <p>{{ productStore.editedProduct.description }}</p>
          </div>

          <div class="flex p-[20px] pb-[60px]">
            <div class="text-[20px] w-1/2 text-center">
              {{ productStore.editedProduct.price }}
            </div>
            <div class="flex w-1/2 justify-around">
              <div>
                <button
                  class="rounded-[5px] flex justify-center items-center text-[25px] text-[white] h-[30px] w-[30px] bg-[#4c4b4b]"
                  @click="minus"
                >
                  -
                </button>
              </div>

              <div class="text-[20px]">{{ number }}</div>
              <div>
                <button
                  class="rounded-[5px] flex justify-center items-center text-[25px] h-[30px] w-[30px] text-[white] bg-[#4c4b4b]"
                  @click="plus"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div class="flex justify-between gap-2 px-[20px]">
            <button
              class="bg-[white] text-[#637aad] w-full h-[35px] border-[2px] border-[#637aad] hover:bg-[#d6dbe7] rounded-[5px] font-bold duration-400"
            >
              ตะกร้า
            </button>
            <button
              class="bg-[#637aad] w-full h-[35px] text-[white] rounded-[5px] hover:bg-[#4a68a8] font-bold duration-400"
            >
              ซื้อ
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
