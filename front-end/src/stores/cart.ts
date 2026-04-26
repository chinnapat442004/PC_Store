import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { ApplyCouponDto, Cart } from '@/types/Cart'
import cartService from '@/service/cart'
import type { CartDetail } from '@/types/CartDetail'
import { useLoadingStore } from './loading'

import { useAuthStore } from './auth'


export const useCartStore = defineStore('Cart', () => {
  const loadingStore = useLoadingStore()
  const cart = ref<Cart>()

  const authStore = useAuthStore()

  authStore.getCurrentUser()

  const initialCart: Cart = {
    subtotal: 0,
    discount_amount: 0,
    total: 0,
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


  const initialCoupon: ApplyCouponDto = {
    code: ''
  }

  const editedCode = ref(<ApplyCouponDto>{ ...initialCoupon })

  const cartDetailCount = computed(() => {
    return cart.value?.cartDetails?.length || 0
  })

  const editedCart = ref(<Cart>JSON.parse(JSON.stringify(initialCart)))

  const editedCartDetail = ref(<CartDetail>JSON.parse(JSON.stringify(initialCartDetail)))



  async function getCarts() {
    loadingStore.doLoad()
    if (authStore.user) {

      const res = await cartService.getCart()
      cart.value = res.data
      console.log(cart.value?.cartDetails)

      await cartDetailCount
    }
    loadingStore.finishLoad()
  }

  async function addCartDetail(cartDetail: CartDetail) {
    await cartService.addCartDetail(cartDetail)
  }

  async function update(cartDetail: CartDetail) {
    await cartService.updateCart(cartDetail)
  }

  async function remove(cartDetail: CartDetail) {
    if (!cartDetail.cart_detail_id) return
    return cartService.remove(cartDetail.cart_detail_id)
  }

  async function clearChart() {
    cartService.clearCart()
  }

  function applyCoupon() {
    return cartService.applyCoupon(editedCode.value)
  }

  function removeCoupon() {

    return cartService.removeCoupon()


  }

  return { getCarts, addCartDetail, clearChart, update, remove, applyCoupon, removeCoupon, cart, editedCart, editedCartDetail, cartDetailCount, editedCode }
})

