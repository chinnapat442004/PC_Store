import type { Product } from '@/types/Product'
import http from './http'

function getProducts() {
  return http.get('/product')
}

function getProduct(product: Product) {
  return http.get(`/product/${product.product_id}`)
}
export default { getProducts, getProduct }
