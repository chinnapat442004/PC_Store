import http from './http'
import type { User } from '@/types/user'

function getUsers() {
  return http.get('/user')
}

function getUser(user: User) {
  return http.get(`/user/${user.user_id}`)
}
export default { getUsers, getUser }
