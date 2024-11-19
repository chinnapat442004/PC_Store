import type { OrderDetail } from './OrderDetail'

type Product = {
  product_id: number

  title: string

  description: string

  price: number

  sold: number

  quantity: number

  orderDetail: OrderDetail[]

  category: Category

  cartDetails: CartDetail

  images: Image
}
export { type Product }
