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
}

export type CreateUser = {
  email: string
  password: string
  name: string
  image?: string
  role?: UserRole
  address?: string
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
