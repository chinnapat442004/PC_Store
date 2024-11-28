import type { Cart } from './Cart'
import type { Product } from './Product'

type CartDetail = {
  cart_detail_id?: number

  quantity: number

  price: number

  cart: Cart

  product: Product
}
export { type CartDetail }
