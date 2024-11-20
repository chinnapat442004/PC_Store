import http from './http'

function getProducts() {
  return http.get('/product')
}
export default { getProducts }
