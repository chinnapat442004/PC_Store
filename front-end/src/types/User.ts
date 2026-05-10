import type { Branch } from './Branch'
import type { UserRole } from './Menu'

export type User = {
  user_id: number
  email: string
  name: string
  role: UserRole
  is_active: boolean
  address?: string
  createdAt: Date
  updatedAt: Date
  branch: Branch
}

export type CreateUser = {
  email: string
  password: string
  confirm_password: string
  name: string
  branch_id: number
}

export type UpdateUser = {
  user_id?: number
  email?: string
  name?: string
  password?: string
}

export type UpdateProfile = {
  name?: string
}

export type UpdatePassword = {
  current_password: string
  new_password: string
  confirm_password: string
}

export type ForgotPassword = {
  email: string
  new_password: string
  confirm_password: string
}
