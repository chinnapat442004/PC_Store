import type { CartDetail } from './CartDetail'
import type { User } from './User'

type Cart = {
  cart_id?: number

  total_amount: number

  cartDetails: CartDetail[]

  user?: User
}
export { type Cart }
