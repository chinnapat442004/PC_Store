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
      // localStorage.setItem('role', res.data.employee.role)
      localStorage.setItem('isLogin', 'true')

      await router.replace({ name: 'home' })
    }
  }

  function clearUser() {
    localStorage.removeItem('user')
    localStorage.removeItem('access_token')
    localStorage.setItem('isLogin', 'false')
    user.value = null
    email.value = ''
    password.value = ''
  }

  return { login, email, password, user, clearUser }
})
