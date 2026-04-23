import { ref } from 'vue'
import { defineStore } from 'pinia'
import userService from '../service/user'

import type { User, CreateUser, UpdateUser } from '@/types/User'
import { useLoadingStore } from './loading'
export const useUserStore = defineStore('user', () => {
  const loadingStore = useLoadingStore()
  const users = ref<User[]>([])
  const editedUser = ref<User | null>(null)

  const page = ref(1)
  const limit = ref(10)
  const lastPage = ref(1)
  const total = ref(0)
  const search = ref('')

  const createUser = ref<CreateUser>({
    email: '',
    password: '',
    name: '',
    image: '',
    role: 'customer', branch_id: 0

  })

  async function getUser(user_id: number) {
    const res = await userService.getUser(user_id)
    editedUser.value = res.data
  }

  async function getUsers(p = page.value, l = limit.value, s = search.value) {
    loadingStore.doLoad()
    const res = await userService.getUsers(p, l, s)

    users.value = res.data.data
    page.value = res.data.page
    lastPage.value = res.data.lastPage
    total.value = res.data.total
    loadingStore.finishLoad()
  }

  async function addUser(user: CreateUser) {
    try {
      const res = await userService.addUser(user)

      clearCreateUser()

      return res
    } catch (error) {
      console.error(error)
    }
  }

  async function updateUser(user: UpdateUser) {
    if (!user.user_id) return
    const res = await userService.updateUser(user.user_id, user)

    clearCreateUser()
    return res
  }

  const clearUser = () => {
    editedUser.value = null
  }

  const clearCreateUser = () => {
    createUser.value = {
      email: '',
      password: '',
      name: '',
      image: '',
      role: 'customer',
      branch_id: 0
    }
  }

  return {
    users,
    editedUser,
    page,
    limit,
    lastPage,
    total,
    search,
    createUser,
    getUser,
    getUsers,
    addUser,
    clearUser,
    clearCreateUser,
    updateUser,
  }
})
