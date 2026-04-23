<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { useCartStore } from '../stores/cart'

const authStore = useAuthStore()
const cartStore = useCartStore()
const submit = ref(false)
const passwordError = ref('')
const usernameError = ref('')
const loginError = ref('')
// const showValid = ref(false)
// const errorMessage = ref('')

const isToastActive = ref(false)

watch([() => authStore.email, () => authStore.password], ([newEmail, newPassword]) => {
 
  if (newEmail) {
    usernameError.value = ''
  }
  if (newPassword) {
    passwordError.value = ''
  }


  if (newEmail || newPassword) {
    loginError.value = ''
  }
})

const notify = () => {
  if (!isToastActive.value) {
    isToastActive.value = true
    toast.error('email หรือ รหัสผ่านไม่ถูกต้อง', {
      position: toast.POSITION.TOP_RIGHT,
      onClose: () => {
        isToastActive.value = false 
      },
    })
  }
}

const pass = () => {
  if (!isToastActive.value) {
    isToastActive.value = true
    toast.success('Login สำเร็จ', {
      position: toast.POSITION.TOP_RIGHT,
      onClose: () => {
        isToastActive.value = false
      },
    })
  }
}

const checkValidate = () => {
  if (authStore.email === null || authStore.email === '') {
    usernameError.value = 'กรุณากรอก Email'
  }
  if (authStore.password === null || authStore.password === '') {
    passwordError.value = 'กรุณากรอกรหัสผ่าน'
  }
  if (
    authStore.email &&
    authStore.password &&
    usernameError.value === '' &&
    passwordError.value === ''
  ) {
    loginError.value = 'email หรือ password ไม่ถูกต้อง'
  }
}
async function onSubmit() {
  submit.value = true

  try {
    await authStore.login()
    await authStore.getCurrentUser()
    await cartStore.getCarts()
  } catch (error) {
    console.log(error)
    notify()
    checkValidate()
  } finally {
    pass()
    submit.value = false
  }
}
</script>

<template>
 
    <div
      class="bg-[#414141] w-[500px] max-h-[500px] rounded-[10px] shadow-xl flex justify-center items-center flex-col py-[40px]"
    >
      <h1 class="text-3xl font-semibold text-center text-white mb-6">Sign in</h1>

    
      <form @submit.prevent="onSubmit" class="w-[350px]">

        <div class="mb-4">
          <label for="email" class="block text-white font-medium">Email:</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your email "
            v-model="authStore.email"
            :class="[
              'w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2',
              passwordError || loginError
                ? 'bg-red-50 border border-red-500  placeholder-red-700 '
                : 'focus:ring-[#202020]',
            ]"
          />
          <p v-if="usernameError" class="text-red-500 text-sm mt-1">
            {{ usernameError }}
          </p>
        </div>

     
        <div class="mb-4">
          <label for="password" class="block text-white font-medium">Password:</label>
          <div></div>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            v-model="authStore.password"
            :class="[
              'w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2',
              passwordError || loginError
                ? 'bg-red-50 border border-red-500  placeholder-red-700 '
                : 'focus:ring-[#202020]',
            ]"
          />
          <p v-if="passwordError" class="text-red-500 text-sm mt-1">
            {{ passwordError }}
          </p>
          <p v-else-if="loginError" class="text-red-500 text-sm mt-1">
            {{ loginError }}
          </p>
        </div>

 
        <div class="flex justify-center">
          <button
            type="submit"
            :disabled="submit"
            class="bg-[#637aad] hover:bg-[#4a68a8]  w-full px-4 py-2 mt-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4c5f86] text-[white]"
          >
            <span v-if="submit">Logging in...</span>
            <span v-else>Login</span>
          </button>
        </div>
      </form>
    
      <p class="mt-4 text-white text-sm">
        <router-link to="/register" class="text-[#637aad] font-medium hover:underline">
          สมัครสมาชิก
        </router-link>
        <span class="mx-2">|</span>
        <router-link to="/forgot-password" class="text-[#637aad] font-medium hover:underline">
          ลืมรหัสผ่าน?
        </router-link>
      </p>
    </div>

</template>
