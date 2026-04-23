import type { RouteLocationRaw } from 'vue-router'

export type UserRole = 'admin' | 'manager' | 'staff' | 'customer'

export interface MenuItem {
  name: string
  label: string
  path: RouteLocationRaw
}