import type { Category } from '@/types/Category'
import http from './http'

function getCategories() {
  return http.get('/category')
}

function createCategory(data: Category) {
  return http.post('/category', data)
}

function updateCategory(id: number, data: Category) {
  return http.put(`/category/${id}`, data)
}

function deleteCategory(id: number) {
  return http.delete(`/category/${id}`)
}

export default {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
}