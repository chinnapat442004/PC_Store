import type { CreateProductPayload } from '@/types/Product'
import http from './http'

function getProducts(page: number, limit: number, search: string) {
  return http.get(`/product?page=${page}&limit=${limit}&search=${search}`)
}

function getProduct(id: number) {
  return http.get(`/product/${id}`)
}

function createProduct(product: CreateProductPayload & { files?: File[] }) {
  const formData = new FormData()

  if (product.title) formData.append('title', product.title)
  if (product.description) formData.append('description', product.description)
  if (product.price !== undefined) formData.append('price', product.price.toString())
  if (product.categoryId !== undefined) formData.append('categoryId', product.categoryId.toString())

  if (product.files && product.files.length > 0) {
    product.files.forEach((file) => {
      formData.append('images', file)
    })
  }

  return http.post('/product', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}


function updateProduct(
  id: number,
  product: Partial<CreateProductPayload> & { files?: File[] }
) {
  const formData = new FormData()

  if (product.title) formData.append('title', product.title)
  if (product.description) formData.append('description', product.description)
  if (product.price !== undefined) formData.append('price', product.price.toString())
  if (product.categoryId !== undefined) formData.append('categoryId', product.categoryId.toString())

  if (product.files && product.files.length > 0) {
    product.files.forEach((file) => {
      formData.append('images', file)
    })
  }

  return http.patch(`/product/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

function deleteProduct(id: number) {
  return http.delete(`/product/${id}`)
}

export default {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
}