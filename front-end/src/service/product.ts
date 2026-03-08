import http from './http'

function getProducts() {
  return http.get('/product')
}

function getProduct(id: number) {
  return http.get(`/product/${id}`)
}
export default { getProducts, getProduct }
