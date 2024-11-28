import http from './http'

function getCarts() {
  return http.get('/cart')
}

export default { getCarts }
