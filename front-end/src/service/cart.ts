import type { ApplyCouponDto } from '@/types/Cart'
import http from './http'
import type { CartDetail } from '@/types/CartDetail'
import { toRaw } from 'vue'

function getCart() {
  return http.get('/cart')
}

function addCartDetail(cartDetail: CartDetail) {

  return http.patch('/cart', {
    productId: cartDetail.product.product_id,
    quantity: cartDetail.quantity
  })
}



function updateCart(cartDetail: CartDetail) {
  return http.patch('/cart/update', {
    productId: cartDetail.product.product_id,
    quantity: cartDetail.quantity
  })
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