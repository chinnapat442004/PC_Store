<script setup lang="ts">
import { ref, watch } from 'vue'
import axios from 'axios'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'

const userStore = useUserStore()
const authStore = useAuthStore()
const router = useRouter()
const submit = ref(false)
const isToastActive = ref(false)
const confirmPassword = ref(null)

const usernameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')

const valind = ref(true)

watch(
  [
    () => userStore.editedUser.name,
    () => userStore.editedUser.email,
    () => userStore.editedUser.password,
    () => confirmPassword,
  ],
  ([newName, newEmail, newPassword, newCofirmPassword]) => {
    if (
      (newName && usernameError.value) ||
      (newEmail && emailError.value) ||
      (newPassword && passwordError.value) ||
      (newCofirmPassword && confirmPasswordError.value)
    ) {
      usernameError.value = ''
      emailError.value = ''
      passwordError.value = ''
      confirmPasswordError.value = ''
    }
  },
)

const notify = (msg: string) => {
  if (!isToastActive.value) {
    isToastActive.value = true
    toast.error(msg, {
      position: toast.POSITION.TOP_RIGHT,
      onClose: () => (isToastActive.value = false),
    })
  }
}

const success = () => {
  toast.success('สมัครสมาชิกสำเร็จ!', {
    position: toast.POSITION.TOP_RIGHT,
    onClose: () => router.push('/login'),
  })
}

const isValidEmail = (email: string | null) => {
  if (email) return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const checkNull = () => {
  if (userStore.editedUser.name === null) {
    usernameError.value = 'กรุณากรอก username'
  }
  if (userStore.editedUser.email === null) {
    emailError.value = 'กรุณากรอก email'
  }
  if (userStore.editedUser.password === null) {
    passwordError.value = 'กรุณากรอก password'
  }
  if (confirmPassword.value === null) {
    confirmPasswordError.value = 'กรุณากรอก ยืนยัน password'
  }
  valind.value = false
}

async function onRegister() {
  submit.value = true
  try {
    userStore.editedUser.role = 'user'
    if (userStore.editedUser.password === confirmPassword.value) {
      isValidEmail(userStore.editedUser.email)
    }
    checkNull()
    console.log('dd', userStore.editedUser)
    await userStore.addUser(userStore.editedUser)

    authStore.email = userStore.editedUser.email
    authStore.password = userStore.editedUser.password
    await authStore.login()
    userStore.clearUser()
    confirmPassword.value = null
    success()
  } catch (e: unknown) {
    console.log(e)

    if (axios.isAxiosError(e)) {
      if (e.response?.status === 409) {
        notify('อีเมลนี้ถูกใช้งานแล้ว')
      } else {
        notify('สมัครสมาชิกไม่สำเร็จ')
      }
    } else {
      notify('เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ')
    }
    notify('สมัครสมาชิกไม่สำเร็จ')
  } finally {
    submit.value = false
  }
}
</script>

<template>
  <div class="flex w-full h-screen justify-center items-center bg-[#202020]">
    <div
      class="py-[25px] bg-[#414141] w-[500px] max-h-[680px] rounded-[10px] shadow-xl flex flex-col justify-center items-center"
    >
      <h1 class="text-3xl font-semibold text-white mb-6">Register</h1>
      <form @submit.prevent="onRegister" class="w-[350px]">
        <div class="mb-4">
          <label class="text-white">Username:</label>
          <input
            v-model="userStore.editedUser.name"
            type="text"
            :class="[
              'w-full px-4 py-2 mt-2 border rounded-lg',
              usernameError
                ? 'bg-red-50 border border-red-500  placeholder-red-700 '
                : 'focus:ring-[#202020]',
            ]"
            placeholder="Enter your username"
          />
          <p v-if="!valind" class="text-red-500 text-sm mt-1">
            {{ usernameError }}
          </p>
        </div>

        <div class="mb-4">
          <label class="text-white">Email:</label>
          <input
            v-model="userStore.editedUser.email"
            type="text"
            :class="[
              'w-full px-4 py-2 mt-2 border rounded-lg',
              emailError
                ? 'bg-red-50 border border-red-500  placeholder-red-700 '
                : 'focus:ring-[#202020]',
            ]"
            placeholder="Enter your email"
          />
          <p v-if="!valind" class="text-red-500 text-sm mt-1">
            {{ emailError }}
          </p>
        </div>
        <div class="mb-4">
          <label class="text-white">Password:</label>
          <input
            v-model="userStore.editedUser.password"
            type="password"
            :class="[
              'w-full px-4 py-2 mt-2 border rounded-lg',
              passwordError
                ? 'bg-red-50 border border-red-500  placeholder-red-700 '
                : 'focus:ring-[#202020]',
            ]"
            placeholder="Enter your password"
          />
          <p v-if="!valind" class="text-red-500 text-sm mt-1">
            {{ passwordError }}
          </p>
        </div>
        <div class="mb-4">
          <label class="text-white">Confirm Password:</label>
          <input
            v-model="confirmPassword"
            type="password"
            :class="[
              'w-full px-4 py-2 mt-2 border rounded-lg',
              confirmPasswordError
                ? 'bg-red-50 border border-red-500  placeholder-red-700 '
                : 'focus:ring-[#202020]',
            ]"
            placeholder="Confirm password"
          />
          <p v-if="!valind" class="text-red-500 text-sm mt-1">
            {{ confirmPasswordError }}
          </p>
        </div>
        <button
          type="submit"
          :disabled="submit"
          class="bg-[#637aad] w-full px-4 py-2 mt-2 rounded-lg text-white"
        >
          <span v-if="submit">Registering...</span>
          <span v-else>Register</span>
        </button>
      </form>
      <p class="mt-4 text-white text-sm">
        <router-link to="/login" class="text-[#637aad] hover:underline"
          >กลับไปยังหน้า Login</router-link
        >
      </p>
    </div>
  </div>
</template>
