import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Product } from '@/types/Product'
import productService from '@/service/product'
export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])

  const initialProduct: Product & { files: File[] } = {
    title: '',
    description: '',
    price: 0,
    sold: 0,
    images: [],
    quantity: 0,
    // category: [],
  }
  const editedProduct = ref(<Product & { files: File[] }>JSON.parse(JSON.stringify(initialProduct)))

  async function getProducts() {
    const res = await productService.getProducts()
    products.value = res.data
  }

  async function getProduct(product: Product) {
    const res = await productService.getProduct(product)
    editedProduct.value = res.data
  }

  return { getProducts, products, editedProduct, getProduct }
})
