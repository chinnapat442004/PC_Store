import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Category } from '../types/Category'
import categoryService from '@/service/category'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([])

  const initialCategory: Category = {
    name: '',
  }

  const editedCategory = ref<Category>(
    JSON.parse(JSON.stringify(initialCategory))
  )

  async function getCategories() {
    const res = await categoryService.getCategories()
    categories.value = res.data
  }

  async function createCategory() {
    await categoryService.createCategory(editedCategory.value)
    await getCategories()
    resetForm()
  }

  async function updateCategory(id: number) {
    await categoryService.updateCategory(id, editedCategory.value)
    await getCategories()
    resetForm()
  }

  async function deleteCategory(id: number) {
    await categoryService.deleteCategory(id)
    await getCategories()
  }

  function resetForm() {
    editedCategory.value = JSON.parse(JSON.stringify(initialCategory))
  }

  function setEditCategory(category: Category) {
    editedCategory.value = JSON.parse(JSON.stringify(category))
  }

  return {
    categories,
    editedCategory,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    resetForm,
    setEditCategory,
  }
})