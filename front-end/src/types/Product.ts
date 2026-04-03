import type { Image } from './Image'
import type { Category } from './Category'
import type { OrderDetail } from './OrderDetail'


type CreateProductPayload = {
  title: string
  description: string
  price: number

  images: Image[]
  categoryId?: number
}


type UpdateProductPayload = Partial<CreateProductPayload> & {
  product_id: number
}

type Product = {
  product_id: number
  title: string
  description: string
  price: number
  quantity: number 
  orderDetail?: OrderDetail[]
  images: Image[]

  categoryId: number
  category?: Category
}

export { 
  type CreateProductPayload,
  type UpdateProductPayload,
  type Product
}