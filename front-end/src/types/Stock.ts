export type StockItem = {
  id: number
  quantity: number
  updated_at: string
  product_id: number
  product_title: string
  product_price: number
  image: string
  status_label:string
}


export type  UpdateStock = {
  product_id: number
  quantity: number;
  ref_id?: number
  note?: string
}