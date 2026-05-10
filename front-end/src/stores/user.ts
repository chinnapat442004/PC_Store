import { ref } from 'vue'
import { defineStore } from 'pinia'
import userService from '../service/user'
import authService from '@/service/auth'

import type {
  User,
  CreateUser,
  UpdateUser,
  UpdateProfile,
  UpdatePassword,
  ForgotPassword,
} from '@/types/User'

import { useLoadingStore } from './loading'

export const useUserStore = defineStore('user', () => {
  const loadingStore = useLoadingStore()

  const users = ref<User[]>([])

  // แยก profile กับ admin
  const editedProfile = ref<User | null>(null)
  const editedUser = ref<(User & { password?: string }) | null>(null)

  const page = ref(1)
  const limit = ref(10)
  const lastPage = ref(1)
  const total = ref(0)
  const search = ref('')

  const initialCreateUser: CreateUser = {
    email: '',
    password: '',
    confirm_password: '',
    name: '',
    branch_id: 0,
  }

  const initialUpdatePassword: UpdatePassword = {
    current_password: '',
    new_password: '',
    confirm_password: '',
  }

  const createUserForm = ref<CreateUser>(structuredClone(initialCreateUser))

  const updatePasswordForm = ref<UpdatePassword>(structuredClone(initialUpdatePassword))

  async function getUser(user_id: number) {
    const res = await userService.getUser(user_id)

    // customer profile
    editedProfile.value = res.data

    // admin edit (มี password)
    editedUser.value = {
      ...res.data,
      password: '',
    }
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

  async function createUser(user: CreateUser) {
    try {
      const res = await userService.createUser(user)
      clearCreateUser()
      return res
    } catch (error) {
      console.error(error)
    }
  }

  async function updateUserByAdmin(user: UpdateUser) {
    if (!user.user_id) return

    const payload: UpdateUser = {
      user_id: user.user_id,
      email: user.email,
      name: user.name,
    }

    if (user.password) {
      payload.password = user.password
    }

    const res = await userService.updateUserByAdmin(user.user_id, payload)

    clearUser()
    return res
  }

  async function updateMyProfile(payload: UpdateProfile) {
    try {
      const res = await userService.updateMyProfile(payload)
      return res
    } catch (error) {
      console.error(error)
    }
  }

  async function changeMyPassword(payload: UpdatePassword) {
    try {
      const res = await userService.changeMyPassword(payload)
      clearUpdatePassword()
      return res
    } catch (error) {
      throw error
    }
  }

  async function forgotPassword(payload: ForgotPassword) {
    try {
      const res = await authService.forgotPassword(payload)
      return res
    } catch (error) {
      console.error(error)
    }
  }

  const clearUser = () => {
    editedUser.value = null
  }

  const clearProfile = () => {
    editedProfile.value = null
  }

  const clearCreateUser = () => {
    createUserForm.value = structuredClone(initialCreateUser)
  }

  const clearUpdatePassword = () => {
    updatePasswordForm.value = structuredClone(initialUpdatePassword)
  }

  async function toggleUserActive(user_id: number) {
    try {
      const res = await userService.toggleUserActive(user_id)

      users.value = users.value.map((user) => {
        if (user.user_id === user_id) {
          return {
            ...user,
            is_active: res.data.is_active,
          }
        }

        return user
      })

      return res
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return {
    users,
    editedUser,
    editedProfile,
    page,
    limit,
    lastPage,
    total,
    search,
    createUserForm,
    updatePasswordForm,

    createUser,
    getUser,
    getUsers,
    updateUserByAdmin,
    updateMyProfile,
    changeMyPassword,
    forgotPassword,

    clearUser,
    clearProfile,
    clearCreateUser,
    clearUpdatePassword,
    toggleUserActive,
  }
})
