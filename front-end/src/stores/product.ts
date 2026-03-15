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

  const page = ref(1)
  const limit = ref(10)
  const lastPage = ref(1)
  const total = ref(0)
  const search = ref('')

  async function getProducts(p = page.value, l = limit.value, s = search.value) {
    const res = await productService.getProducts(p, l, s)
    products.value = res.data.data
    page.value = res.data.page
    lastPage.value = res.data.lastPage
    total.value = res.data.total
  }

  async function getProduct(id: number) {
    loadingStore.doLoad()
    const res = await productService.getProduct(id)
    editedProduct.value = await res.data
    loadingStore.finishLoad()
  }

  return { getProducts, products, editedProduct, getProduct, initialProduct, page, limit, lastPage, total, search }
})
