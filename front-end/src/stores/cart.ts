import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Cart } from '@/types/Cart'
import cartService from '@/service/cart'

export const useCartStore = defineStore('Cart', () => {
  const carts = ref<Cart[]>([])

  const initialCart: Cart = {
    name: '',
  }
  const editedProduct = ref(<Cart>JSON.parse(JSON.stringify(initialCart)))

  async function getCarts() {
    const res = await cartService.getCarts()
    carts.value = res.data
  }

  return { getCarts, carts }
})
