import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Category, CreateCategory } from '../types/Category'
import categoryService from '@/service/category'
import { useLoadingStore } from './loading'

export const useCategoryStore = defineStore('category', () => {
  const loadingStore = useLoadingStore()
  const categories = ref<Category[]>([])

  const initialCategory: CreateCategory = {
    name: '',
  }

  const editedCategory = ref<CreateCategory>(
    structuredClone(initialCategory))

  async function getCategories(onlyActive = false) {
    loadingStore.doLoad()
    const res = await categoryService.getCategories(onlyActive)
    categories.value = res.data
    loadingStore.finishLoad()
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



  async function toggleCategoryActive(category: Category) {
    try {
      const res = await categoryService.toggleCategoryActive(category.category_id!)

      categories.value = categories.value.map((c) => {
        if (c.category_id === category.category_id) {
          return {
            ...c,
            is_active: res.data.is_active,
          }
        }

        return c
      })

      return res
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  function resetForm() {
    editedCategory.value = structuredClone(initialCategory)
  }

  function setEditCategory(category: Category) {
    editedCategory.value = structuredClone(category)
  }

  return {
    categories,
    editedCategory,
    getCategories,
    createCategory,
    updateCategory,
    toggleCategoryActive,
    resetForm,
    setEditCategory,
  }
})