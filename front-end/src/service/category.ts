import type { CreateCategory } from '@/types/Category'
import http from './http'

function getCategories(onlyActive?: boolean) {
  return http.get(`/category?onlyActive=${onlyActive || false}`)
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