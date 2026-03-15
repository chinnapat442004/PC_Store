import { ref } from 'vue'
import { defineStore } from 'pinia'
import authService from '../service/auth'
import type { User } from '@/types/User'
import router from '@/router'
import { useCartStore } from './cart'

export const useAuthStore = defineStore('auth', () => {
  const email = ref<string>('')
  const password = ref<string>('')
  const user = ref<User | null>()
  const token = ref(localStorage.getItem('access_token'))
  async function login() {
    const res = await authService.login(email.value, password.value)

    if (res) {
      localStorage.setItem('user', JSON.stringify(res.data.user))
      localStorage.setItem('access_token', res.data.access_token)
      localStorage.setItem('role', res.data.user.role)
      localStorage.setItem('isLogin', 'true')

      if (res.data.user.role === 'admin') {
        await router.replace({ name: 'dashboard' })
      } else if (res.data.user.role === 'user') {
        await router.replace({ name: 'home' })
      }
      token.value = localStorage.getItem('access_token')
    }
  }

  async function clearUser() {
    const cartStore = useCartStore()
    localStorage.removeItem('user')
    localStorage.removeItem('access_token')
    localStorage.removeItem('role')
    localStorage.setItem('isLogin', 'false')
    token.value = null
    user.value = null
    email.value = ''
    password.value = ''
    cartStore.clearChart()
    console.log('ออกจากระบบแล้ว')
  }

  async function getCurrentUser() {
    const storedUser = localStorage.getItem('user')
    user.value = storedUser ? JSON.parse(storedUser) : null
    
  }
  if (token.value) {
    console.log('login แล้ว')
  } else {
    console.log('ยังไม่ได้ login')
  }
  return { token, email, password, user, login, clearUser, getCurrentUser }
})
