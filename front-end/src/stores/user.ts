import { ref } from 'vue'
import { defineStore } from 'pinia'
import userService from '../service/user'

import type { User } from '@/types/User'

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([])

  const initialUser: User = {
    email: null,
    name: null,
    password: null,
    image: null,
    role: null,
    enabled: true,
    address: null,
  }
  const editedUser = ref(<User>JSON.parse(JSON.stringify(initialUser)))

  async function getUser(user: User) {
    const res = await userService.getUser(user)
    editedUser.value = res.data
  }

  async function getUsers() {
    const res = await userService.getUsers()
    users.value = res.data
  }

  async function addUser(user: User) {
    return await userService.addUser(user)
  }

  const clearUser = () => {
    editedUser.value = structuredClone(initialUser)
  }

  return { users, editedUser, getUser, getUsers, addUser, clearUser }
})
