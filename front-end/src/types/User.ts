import type { Branch } from "./Branch"
import type { UserRole } from "./Menu"


export type User = {
  user_id: number
  email: string
  name: string
  image?: string
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
  image?: string
  role?: UserRole
  branch_id: number
}

export type UpdateUser = {
  user_id?: number
  email?: string
  name?: string
  image?: string
  role?: UserRole
  enabled?: boolean
  address?: string
}
