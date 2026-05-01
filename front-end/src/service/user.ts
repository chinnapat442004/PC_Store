import http from './http'
import type { CreateUser, UpdateUser } from '@/types/User'

function getUsers(page: number, limit: number, search: string) {
  return http.get(`/users?page=${page}&limit=${limit}&search=${search}`)
}

function getUser(id: number) {
  return http.get(`/users/${id}`)
}

async function addUser(user: CreateUser) {
  return http.post('/users', user)

}




function updateUser(id: number, user: UpdateUser) {
  console.log(user)
  return http.patch(`/users/${id}`, user)
}

export default { getUsers, getUser, addUser, updateUser, }