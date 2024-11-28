import type { OrderDetail } from './OrderDetail'
import type { Image } from './Image'

type Product = {
  product_id?: number

  title: string

  description: string

  price: number

  sold: number

  quantity: number

  orderDetail: OrderDetail[]

  images: Image[]
}
export { type Product }
