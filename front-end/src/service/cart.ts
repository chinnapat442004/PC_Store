import type { ApplyCouponDto } from '@/types/Cart'
import http from './http'
import type { CartDetail } from '@/types/CartDetail'

function getCart() {
  return http.get('/cart')
}

function addCartDetail(cartDetail: CartDetail) {
  return http.patch('/cart', cartDetail)
}

function updateCart(cartDetail: CartDetail) {
  return http.patch('/cart/update', cartDetail)
}

function remove(cartDetailId: number) {
  return http.delete(`/cart/detail/${cartDetailId}`)
}

function clearCart() {
  return http.delete('/cart/clear')
}
function applyCoupon(code: ApplyCouponDto) {
  return http.post('/cart/apply-coupon', code)
}


function removeCoupon() {
  return http.delete('/cart/remove-coupon/')
}


export default {
  getCart,
  addCartDetail,
  updateCart,
  remove,
  clearCart,
  applyCoupon,
  removeCoupon
}