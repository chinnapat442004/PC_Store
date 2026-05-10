type Category = {
  category_id?: number
  name: string
  is_active: boolean
}

type CreateCategory = {
  category_id?: number
  name: string
}

export { type Category, type CreateCategory }
