<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}

const goHome = () => {
  router.push({ name: 'home' })
}
</script>

<template>
  <div
    class="bg-[#414141] w-[500px] rounded-[10px] shadow-xl flex justify-center items-center flex-col py-[50px] px-[30px] text-center"
  >
    <h1 class="text-7xl font-black text-[#637aad] mb-2">403</h1>
    <h2 class="text-2xl font-semibold text-white mb-4">Access Forbidden</h2>

    <div class="w-16 h-1 bg-[#637aad] mb-6"></div>

    <p class="text-gray-300 mb-8 leading-relaxed">
      ขออภัย คุณไม่มีสิทธิ์เข้าถึงหน้านี้ <br />
      โปรดติดต่อผู้ดูแลระบบหากคุณคิดว่านี่คือข้อผิดพลาด
    </p>

    <div class="flex gap-4 w-full justify-center">
      <button
        @click="goBack"
        class="bg-white text-[#637aad] px-6 py-2 rounded-lg transition-all hover:bg-[#eaf0fb]"
      >
        ย้อนกลับ
      </button>

      <button
        @click="goHome"
        class="bg-[#637aad] hover:bg-[#4a68a8] text-white px-6 py-2 rounded-lg transition-all"
      >
        กลับหน้าหลัก
      </button>
    </div>
  </div>
</template>
