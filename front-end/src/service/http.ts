import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:3000',
  // timeout: 5000,
})

instance.interceptors.request.use(async (config) => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return config
})

export default instance
