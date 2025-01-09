import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Cart } from '@/types/Cart'
import cartService from '@/service/cart'
import type { CartDetail } from '@/types/CartDetail'

import { useProductStore } from './product'
import { useAuthStore } from './auth'

export const useCartStore = defineStore('Cart', () => {
  const cart = ref<Cart>()
  const productStort = useProductStore()
  const authStore = useAuthStore()

  authStore.getCurrentUser()

  const initialCart: Cart = {
    total_amount: 0,
    cartDetails: [],
  }

  const initialCartDetail: CartDetail = {
    quantity: 0,
    product: productStort.initialProduct,
  }

  const editedCart = ref(<Cart>JSON.parse(JSON.stringify(initialCart)))

  const editedCartDetail = ref(<CartDetail>JSON.parse(JSON.stringify(initialCartDetail)))

  async function getCart() {
    if (authStore.user) {
      const res = await cartService.getCart(authStore.user)
      cart.value = res.data
    }
  }

  async function addCartDetail(cart: Cart, cartDetail: CartDetail) {
    await cartService.addCartDetail(cart, cartDetail)
  }

  async function update(cart: Cart, cartDetail: CartDetail) {
    await cartService.update(cart, cartDetail)
  }

  async function remove(cartDetail: CartDetail) {
    return cartService.remove(cartDetail)
  }

  return { getCart, addCartDetail, cart, editedCart, editedCartDetail, update, remove }
})
