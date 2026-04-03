import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Product, CreateProductPayload } from '@/types/Product'
import productService from '@/service/product'
import { useLoadingStore } from './loading'

export const useProductStore = defineStore('product', () => {

  const products = ref<Product[]>([])
  const loadingStore = useLoadingStore()

  const initialProduct: CreateProductPayload & { files: File[] } = {
    title: '',
    description: '',
    price: 0,
  
    images: [],
    categoryId: 0,
    files: [],
  }

  const editedProduct = ref<CreateProductPayload & { files: File[] }>(
    JSON.parse(JSON.stringify(initialProduct))
  )

  const page = ref(1)
  const limit = ref(10)
  const lastPage = ref(1)
  const total = ref(0)
  const search = ref('')

  
  async function getProducts(p = page.value, l = limit.value, s = search.value) {
    loadingStore.doLoad()
    try {
      const res = await productService.getProducts(p, l, s)
      products.value = res.data.data
      page.value = res.data.page
      lastPage.value = res.data.lastPage
      total.value = res.data.total
    } finally {
      loadingStore.finishLoad()
    }
  }

  
  async function getProduct(id: number) {
    loadingStore.doLoad()
    try {
      const res = await productService.getProduct(id)
      const data: Product = res.data

      editedProduct.value = {
        title: data.title,
        description: data.description,
        price: data.price,
       
        images: data.images,
      categoryId: data.category?.category_id ?? undefined,
        files: []
      }
    } finally {
      loadingStore.finishLoad()
    }
  }

 
  async function addProduct() {
    loadingStore.doLoad()
    try {
      const res = await productService.createProduct(editedProduct.value)
      clearProduct()
      await getProducts()
      return res
    } catch (error) {
      console.error('Add product error:', error)
      throw error
    } finally {
      loadingStore.finishLoad()
    }
  }


  async function updateProduct(id: number) {
    loadingStore.doLoad()
    try {
      const res = await productService.updateProduct(id, editedProduct.value)
      clearProduct()
      await getProducts()
      return res
    } catch (error) {
      console.error('Update product error:', error)
      throw error
    } finally {
      loadingStore.finishLoad()
    }
  }


  async function deleteProduct(id: number) {
    loadingStore.doLoad()
    try {
      const res = await productService.deleteProduct(id)
      await getProducts()
      return res
    } catch (error) {
      console.error('Delete product error:', error)
      throw error
    } finally {
      loadingStore.finishLoad()
    }
  }

  function clearProduct() {
    editedProduct.value = JSON.parse(JSON.stringify(initialProduct))
  }

  return {
    getProducts,
    getProduct,
    addProduct,      
    updateProduct,  
    deleteProduct,   
    clearProduct,
    products,
    editedProduct,
    initialProduct,
    page,
    limit,
    lastPage,
    total,
    search
  }
})