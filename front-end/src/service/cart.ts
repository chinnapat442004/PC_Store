import type { Cart } from '@/types/Cart'
import http from './http'
import type { User } from '@/types/User'
import type { CartDetail } from '@/types/CartDetail'

function getCart(user: User) {
  return http.get(`/cart/${user.user_id}`)
}
function addCart(cart: Cart) {
  return http.post('/cart', cart)
}

function addCartDetail(cart: Cart, cartDetail: CartDetail) {
  return http.patch(`/cart/${cart.cart_id}`, cartDetail)
}

function update(cart: Cart, cartDetail: CartDetail) {
  return http.patch(`/cart/update/${cart.cart_id}`, cartDetail)
}

function remove(cartDetail: CartDetail) {
  return http.delete(`/cart/${cartDetail.cart_detail_id}`)
}
export default { getCart, addCart, addCartDetail, update, remove }
