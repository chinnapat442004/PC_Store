export type StockItem = {
  id: number
  quantity: number
  updated_at: string
  product_id: number
  product_title: string
  product_price: number
  image: string
  status_label: string
}


export type UpdateStock = {
  product_id: number
  quantity: number;
  ref_id?: number
  note?: string
}

export type MovementItem = {
  id: number
  product_id: number
  product_title: string
  change_qty: number
  type: 'IN' | 'OUT'
  note: string | null
  created_at: string
  ref: number | null
}