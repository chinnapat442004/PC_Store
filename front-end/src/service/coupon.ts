import type { CouponPayload } from '@/types/Coupon'
import http from './http'

function getCoupons(page: number, limit: number, search: string) {
  return http.get(`/coupon?page=${page}&limit=${limit}&search=${search}`)
}

function createCoupon(data: CouponPayload) {
  return http.post('/coupon', data)
}

function editCoupon(id: number, data: CouponPayload) {
  return http.patch(`/coupon/${id}`, data)
}

function toggleActive(id: number) {
  return http.patch(`/coupon/${id}/toggle-active`)
}

export default {
  getCoupons,
  createCoupon,
  editCoupon,
  toggleActive,
}
