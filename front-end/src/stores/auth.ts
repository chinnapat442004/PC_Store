import { ref } from 'vue'
import { defineStore } from 'pinia'
import authService from '../service/auth'
import type { CreateUser, User } from '@/types/User'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const initialCreateUser: CreateUser = {
    email: '',
    password: '',
    confirm_password: '',
    name: '',
    branch_id: 0
  }

  const registerUser = ref<CreateUser>(structuredClone(initialCreateUser))

  const email = ref('')
  const password = ref('')
  const user = ref<User | null>(null)
  const token = ref(localStorage.getItem('access_token'))

  async function login() {
    const res = await authService.login(email.value, password.value)

    if (res) {
      localStorage.setItem('access_token', res.data.access_token)
      token.value = res.data.access_token

      await getCurrentUser()

      const role = user.value?.role

      if (role === 'admin') {
        await router.replace({ name: 'dashboard' })
      } else if (role === 'manager') {
        await router.replace({ name: 'manager-dashboard' })
      } else if (role === 'customer') {
        await router.replace({ name: 'home' })
      } else if (role === 'staff') {
        await router.replace({ name: 'staff-dashboard' })
      }
    }
  }

  async function getCurrentUser() {
    const res = await authService.getCurrentUserr()
    user.value = res.data
    return res
  }

  function clearUser() {
    localStorage.removeItem('access_token')
    token.value = null
    user.value = null
    email.value = ''
    password.value = ''
  }

  async function register(user: CreateUser) {
    try {
      const res = await authService.register(user)
      registerUser.value = structuredClone(initialCreateUser)
      return res
    } catch (error) {
      console.error(error)
    }
  }

  return {
    token,
    email,
    password,
    user,
    registerUser,
    login,
    clearUser,
    getCurrentUser,
    register
  }
})