import type { CreateCategory } from '@/types/Category'
import http from './http'

function getCategories(page = 1, limit = 10, search = '', onlyActive = false) {
  return http.get(`/category?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&onlyActive=${onlyActive}`)
}

function createCategory(data: CreateCategory) {
  return http.post('/category', data)
}

function updateCategory(id: number, data: CreateCategory) {
  return http.patch(`/category/${id}`, data)
}

function toggleCategoryActive(id: number) {
  return http.patch(`/category/${id}/toggle-active`)
}

export default {
  getCategories,
  createCategory,
  updateCategory,
  toggleCategoryActive,
}
