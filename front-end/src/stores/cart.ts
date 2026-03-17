import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Cart } from '@/types/Cart'
import cartService from '@/service/cart'
import type { CartDetail } from '@/types/CartDetail'
import { useLoadingStore } from './loading'
import { useProductStore } from './product'
import { useAuthStore } from './auth'


export const useCartStore = defineStore('Cart', () => {
   const loadingStore = useLoadingStore()
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
  product: {
    product_id: 0,
    title: '',
    description: '',
    price: 0,
    quantity: 0,
    images: [],
    categoryId: 0,
    category: undefined
  }
}

  const editedCart = ref(<Cart>JSON.parse(JSON.stringify(initialCart)))

  const editedCartDetail = ref(<CartDetail>JSON.parse(JSON.stringify(initialCartDetail)))

  async function getCarts() {
    loadingStore.doLoad()
    if (authStore.user) {
    
      const res = await cartService.getCart(authStore.user)
      cart.value = res.data
      console.log(cart.value?.cartDetails)
    
    }
      loadingStore.finishLoad()
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

  async function clearChart() {
    cart.value = undefined
  }

  return { getCarts, addCartDetail, clearChart, cart, editedCart, editedCartDetail, update, remove }
})
