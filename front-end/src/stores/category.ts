import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Category } from '../types/Category'
import categoryService from '@/service/category'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([])

  const initialProduct: Category = {
    name: '',
  }
  const editedProduct = ref(<Category>JSON.parse(JSON.stringify(initialProduct)))

  async function getCategories() {
    const res = await categoryService.getCategories()
    categories.value = res.data
  }

  return { categories, getCategories, editedProduct }
})
