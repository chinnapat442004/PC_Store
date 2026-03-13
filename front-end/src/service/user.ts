import http from './http'
import type { CreateUser, UpdateUser } from '@/types/User'

function getUsers(page: number, limit: number, search: string) {
  return http.get(`/users?page=${page}&limit=${limit}&search=${search}`)
}

function getUser(id: number) {
  return http.get(`/users/${id}`)
}

function addUser(user: CreateUser) {
  const formData = new FormData()
  if (user.name) formData.append('name', user.name)
  if (user.email) formData.append('email', user.email)
  if (user.password) formData.append('password', user.password)
  if (user.role) formData.append('role', user.role)

  if (user.name)
    return http.post('/users', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
}

function updateUser(id: number, user: UpdateUser) {
  console.log(user)
  const formData = new FormData()
  if (user.name) formData.append('name', user.name)
  if (user.email) formData.append('email', user.email)
  if (user.image) formData.append('image', user.image)
  if (user.enabled !== undefined) {
    formData.append('enabled', String(user.enabled))
  }

  return http.patch(`/users/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export default { getUsers, getUser, addUser, updateUser }
