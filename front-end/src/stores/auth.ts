import { ref } from 'vue'
import { defineStore } from 'pinia'
import authService from '../service/auth'
import type { User } from '@/types/User'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const email = ref()
  const password = ref()
  const user = ref<User | null>()

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
    }
  }

  function clearUser() {
    localStorage.removeItem('user')
    localStorage.removeItem('access_token')
    localStorage.removeItem('role')
    localStorage.setItem('isLogin', 'false')
    user.value = null
    email.value = ''
    password.value = ''
  }

  function getCurrentUser() {
    const storedUser = localStorage.getItem('user')
    user.value = storedUser ? JSON.parse(storedUser) : null
  }

  return { login, email, password, user, clearUser, getCurrentUser }
})
