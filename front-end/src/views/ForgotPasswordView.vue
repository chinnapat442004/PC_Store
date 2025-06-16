<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const email = ref('')
const isSubmitting = ref(false)
// const isToastActive = ref(false)

const sendResetEmail = async () => {
  if (!email.value) {
    toast.error('กรุณากรอกอีเมล')
    return
  }

  isSubmitting.value = true

  try {
    toast.success('เราได้ส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว')
  } catch (err) {
    console.error(err)
    toast.error('ไม่สามารถส่งอีเมลได้ กรุณาลองใหม่อีกครั้ง')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="flex w-full h-screen justify-center items-center bg-[#202020]">
    <div class="bg-[#414141] w-[500px] p-8 rounded-[10px] shadow-xl">
      <h1 class="text-3xl font-semibold text-white text-center mb-6">ลืมรหัสผ่าน</h1>

      <form @submit.prevent="sendResetEmail" class="space-y-6">
        <div>
          <label for="email" class="block text-white font-medium mb-2">Email:</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#202020]"
            placeholder="กรอกอีเมลที่ใช้ลงทะเบียน"
          />
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full bg-[#637aad] text-white py-2 rounded-lg hover:bg-[#556b95]"
        >
          <span v-if="isSubmitting">กำลังส่ง...</span>
          <span v-else>ส่งลิงก์รีเซ็ตรหัสผ่าน</span>
        </button>
      </form>

      <div class="mt-6 text-center">
        <router-link to="/login" class="text-[#637aad] hover:underline text-sm">
          กลับไปหน้าเข้าสู่ระบบ
        </router-link>
      </div>
    </div>
  </div>
</template>
