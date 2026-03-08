import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Product } from '@/types/Product'
import productService from '@/service/product'
import { useLoadingStore } from './loading'
export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const loadingStore = useLoadingStore()

  const initialProduct: Product & { files: File[] } = {
    title: '',
    description: '',
    price: 0,
    sold: 0,
    images: [],
    quantity: 0,
    files: [],
  }
  const editedProduct = ref(<Product & { files: File[] }>JSON.parse(JSON.stringify(initialProduct)))

  async function getProducts() {
    const res = await productService.getProducts()
    products.value = res.data
  }

  async function getProduct(id: number) {
    loadingStore.doLoad()
    const res = await productService.getProduct(id)
    editedProduct.value = await res.data
    loadingStore.finishLoad()
  }

  return { getProducts, products, editedProduct, getProduct, initialProduct }
})
