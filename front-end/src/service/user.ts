import http from './http'
import type { CreateUser, UpdateUser } from '@/types/User'

function getUsers(page: number, limit: number, search: string) {
  return http.get(`/users?page=${page}&limit=${limit}&search=${search}`)
}

function getUser(id: number) {
  return http.get(`/users/${id}`)
}

async function addUser(user: CreateUser) {
  try {
    const formData = new FormData()

    if (user.name) formData.append('name', user.name)
    if (user.email) formData.append('email', user.email)
    if (user.password) formData.append('password', user.password)
    if (user.role) formData.append('role', user.role)
    formData.append('branch_id', user.branch_id.toString())

    const res = await http.post('/users', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return res
  } catch (error: any) {
    console.error('AddUser Error:', {
      message: error?.message,
      response: error?.response?.data,
      status: error?.response?.status,
    })

    throw error
  }
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
