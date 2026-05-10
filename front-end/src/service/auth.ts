import type { CreateUser, ForgotPassword } from '@/types/User'
import http from './http'

function getCurrentUserr() {
  return http.get('/auth/me')
}

function login(email: string | null, password: string | null) {
  try {
    const response = http.post(`/auth/login`, { email, password })

    return response
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } }
    throw new Error(err.response?.data?.message || 'Login failed')
  }
}

async function register(user: CreateUser) {
  return http.post('/auth/register', user)
}

async function forgotPassword(user: ForgotPassword) {
  return http.post('/auth/forgot-password', user)
}

export default { login, register, forgotPassword, getCurrentUserr }
