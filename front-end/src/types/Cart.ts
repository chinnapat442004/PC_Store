import type { CartDetail } from './CartDetail'
import type { Coupon } from './Coupon'
import type { User } from './User'

type Cart = {
  cart_id?: number
  subtotal: number
  discount_amount: number
  total: number
  cartDetails: CartDetail[]
  user?: User
  coupon?: Coupon
}

type ApplyCouponDto = {
  code: string
}
export { type Cart, type ApplyCouponDto }
