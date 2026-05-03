import http from './http'
import type { CreateUser, UpdatePassword, UpdateProfile, UpdateUser } from '@/types/User'

function getUsers(page: number, limit: number, search: string) {
  return http.get(`/users?page=${page}&limit=${limit}&search=${search}`)
}

function getUser(id: number) {
  return http.get(`/users/${id}`)
}

function createUser(user: CreateUser) {
  return http.post('/users', user)
}


function updateUserByAdmin(id: number, user: UpdateUser) {
  return http.patch(`/users/${id}`, user)
}


function updateMyProfile(user: UpdateProfile) {
  return http.patch('/users/me/profile', user)
}


function changeMyPassword(user: UpdatePassword) {
  return http.patch('/users/me/password', user)
}

export default {
  getUsers,
  getUser,
  createUser,
  updateUserByAdmin,
  updateMyProfile,
  changeMyPassword,
}