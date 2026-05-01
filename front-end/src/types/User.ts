import type { Branch } from "./Branch"
import type { UserRole } from "./Menu"


export type User = {
  user_id: number
  email: string
  name: string
  role: UserRole
  enabled: boolean
  address?: string
  createdAt: string
  updatedAt: string
  branch: Branch

}

export type CreateUser = {
  email: string
  password: string
  name: string
  branch_id: number
  confirm_password?: string
}

export type UpdateUser = {
  user_id?: number
  email?: string
  name?: string
  role?: UserRole
  enabled?: boolean
  address?: string
}
