import http from './http'
import type { User } from '@/types/User'

function getUsers() {
  return http.get('/user')
}

function getUser(user: User) {
  return http.get(`/user/${user.user_id}`)
}

function addUser(user: User) {
  const formData = new FormData()
  if (user.name) formData.append('name', user.name)
  if (user.email) formData.append('email', user.email)
  if (user.password) formData.append('password', user.password)
  if (user.role) formData.append('role', user.role)
  if (user.name) formData.append('enabled', String(user.enabled))
  if (user.address) formData.append('address', user.address)
  if (user.name)
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`)
    })
  return http.post('/user', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export default { getUsers, getUser, addUser }
