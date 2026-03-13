export type Role = 'user' | 'employee' | 'manager' | 'admin'

export type User = {
  user_id: number
  email: string
  name: string
  image?: string
  role: Role
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
  role?: Role
  address?: string
}

export type UpdateUser = {
  user_id?: number
  email?: string
  name?: string
  image?: string
  role?: Role
  enabled?: boolean
  address?: string
}
