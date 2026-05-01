import { ref } from 'vue'
import { defineStore } from 'pinia'
import authService from '../service/auth'
import type { CreateUser, User } from '@/types/User'
import router from '@/router'
import { useCartStore } from './cart'


export const useAuthStore = defineStore('auth', () => {



  const initialCreateUser: CreateUser = {
    email: '',
    password: '',
    name: '',
    branch_id: 0
  }

  const registerUser = ref<CreateUser>(structuredClone(initialCreateUser))


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
      token.value = localStorage.getItem('access_token')

      if (res.data.user.role === 'admin') {
        await router.replace({ name: 'dashboard' })
      } else if (res.data.user.role === 'manager') {
        await router.replace({ name: 'manager-dashboard' })
      } else if (res.data.user.role === 'customer') {
        await router.replace({ name: 'home' })
      } else if (res.data.user.role === 'staff') {
        await router.replace({ name: 'staff-dashboard' })
      }

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

  async function register(user: CreateUser) {

    try {
      const res = await authService.register(user)

      registerUser.value = (structuredClone(initialCreateUser))

      return res
    } catch (error) {
      console.error(error)
    }
  }

  return { token, email, password, user, registerUser, login, clearUser, getCurrentUser, register }
})
