import http from './http'

function login(email: string | null, password: string | null) {
  try {
    const response = http.post(`/auth/login`, { email, password })
    return response
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed')
  }
}

export default { login }
