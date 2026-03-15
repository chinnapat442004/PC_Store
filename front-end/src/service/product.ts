import http from './http'

function getProducts(page: number, limit: number, search: string) {
  return http.get(`/product?page=${page}&limit=${limit}&search=${search}`)
}

function getProduct(id: number) {
  return http.get(`/product/${id}`)
}
export default { getProducts, getProduct }
