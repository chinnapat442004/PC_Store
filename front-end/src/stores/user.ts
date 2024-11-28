import { ref } from 'vue'
import { defineStore } from 'pinia'
import userService from '../service/user'

import type { User } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([])

  const initialUser: User = {
    email: '',
    name: '',
    password: '',
    image: '',
    role: '',
    enabled: '',
    address: '',
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

  return { users, editedUser, getUser, getUsers }
})
