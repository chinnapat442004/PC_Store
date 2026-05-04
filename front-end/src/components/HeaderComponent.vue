<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { IonIcon } from '@ionic/vue'
import { menu, close, person } from 'ionicons/icons'
import { useRoute, useRouter } from 'vue-router'
import { onBeforeUnmount, onMounted, ref, computed, watch } from 'vue'
import { toast } from 'vue3-toastify'

const authStore = useAuthStore()
const cartStore = useCartStore()
const route = useRoute()
const router = useRouter()
const isLogin = ref(!!localStorage.getItem('access_token'))
const isMenuOpen = ref(false)
const open = ref(false)
const checkMenu = ref(false)

const isToastActive = ref(false)

const menus = [
  { name: 'home', label: 'Home', path: { name: 'home' }, activeRoutes: ['home',] },
  { name: 'shop', label: 'Shop', path: { name: 'shop' }, activeRoutes: ['shop', 'product'] },
  { name: 'cart', label: 'Cart', path: { name: 'cart' }, activeRoutes: ['cart', 'checkout'] },
]



function checkAuthStatus() {
  const token = localStorage.getItem('access_token')

  if (!token) {
    isLogin.value = false
    return
  }

  isLogin.value = true
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
  open.value = !open.value
}

function closeMenu() {
  isMenuOpen.value = false
  open.value = false
}

const checkScreenSize = () => {
  isMenuOpen.value = window.innerWidth >= 768
  open.value = false
}

onMounted(async () => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  // cartStore.getCarts() // ย้ายไปจัดการที่ App.vue
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize)
})


const userInitials = computed(() => {
  if (!authStore.user?.name) return ''

  const words = authStore.user?.name.trim().split(' ')

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase()
  }

  return (words[0][0] + words[1][0]).toUpperCase()
})



async function logout() {
  await authStore.clearUser()
  checkAuthStatus()

  window.location.reload()
  checkMenu.value = false

  if (!isToastActive.value) {
    isToastActive.value = true
    toast.success('ออกจากระบบสำเร็จ', {
      position: toast.POSITION.TOP_RIGHT,
      onClose: () => (isToastActive.value = false),
    })
  }
}

const goToProfile = () => {
  router.push({ name: 'profile' })
  checkMenu.value = false
}

const goToOrders = () => {
  router.push('/orders')
  checkMenu.value = false
}
</script>

<template>
  <header class="shadow-lg py-[10px] px-[5px] md:px-[30px] bg-[#202020] fixed top-0 left-0 w-full z-50">
    <div class="flex justify-between items-center w-[92%] mx-auto md:gap-4">

      <div class="md:hidden">
        <IonIcon @click="toggleMenu" :icon="open ? close : menu" class="text-3xl cursor-pointer text-white" />
      </div>

      <div class="flex items-center md:gap-10">
        <div class="text-[30px] text-white">LOGO </div>

        <div class="md:static absolute left-0 top-[65px] w-full bg-[#202020]"
          :class="{ 'hidden md:block': !isMenuOpen }">
          <ul class="flex md:flex-row flex-col md:gap-4 items-center justify-center">

            <li v-for="menu in menus" :key="menu.name" @click="closeMenu">
              <router-link :to="menu.path"
                class="md:w-[80px] w-[400px] md:h-[40px] h-[60px] flex items-center justify-center font-semibold rounded-[5px] duration-300 hover:bg-[#333333] md:hover:bg-[#6d717a] relative"
                :class="menu.activeRoutes.includes(route.name as string)
                  ? 'md:bg-[#979dac] bg-[#2E2E2E] text-white'
                  : 'bg-[#202020] text-white'">
                {{ menu.label }}

                <span v-if="menu.name === 'cart' && cartStore.cartDetailCount > 0"
                  class="absolute top-[-5px] right-[-5px] bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {{ cartStore.cartDetailCount }}
                </span>
              </router-link>
            </li>

          </ul>
        </div>
      </div>

      <div class="flex gap-4 items-center justify-center">
        <button @click="checkMenu = !checkMenu" class="w-[40px] h-[40px] rounded-full border-2 flex items-center justify-center
           hover:text-[#333] hover:bg-[#979dac] duration-300 overflow-hidden">


          <IonIcon v-if="!isLogin" :icon="person" class="text-2xl text-white" />


          <span v-else
            class="w-full h-full flex items-center justify-center bg-[#637aad] hover:bg-[#4a68a8] text-white font-semibold">
            {{ userInitials }}
          </span>

        </button>



        <div v-if="checkMenu && !isLogin"
          class="bg-white absolute w-[170px] h-[120px] top-14 rounded-[10px] shadow-lg flex flex-col items-center justify-center gap-2 md:right-auto right-0">
          <router-link :to="{ name: 'login' }"
            class="w-full py-2 text-center text-[14px] font-semibold text-[#333] hover:bg-[#f1f1f1] rounded-[8px]">
            Sign in
          </router-link>
          <router-link :to="{ name: 'register' }"
            class="w-full py-2 text-center text-[14px] font-semibold text-[#333] hover:bg-[#f1f1f1] rounded-[8px]">
            Register
          </router-link>
        </div>

        <div v-if="checkMenu && isLogin"
          class="bg-white absolute w-[170px] h-[150px] top-14 rounded-[10px] shadow-lg flex flex-col items-center justify-center gap-2 md:right-auto right-0">
          <button @click="goToProfile"
            class="w-full py-2 text-center text-[14px] font-semibold text-[#333] hover:bg-[#f1f1f1] rounded-[8px]">
            บัญชีของฉัน
          </button>
          <button @click="goToOrders"
            class="w-full py-2 text-center text-[14px] font-semibold text-[#333] hover:bg-[#f1f1f1] rounded-[8px]">
            คำสั่งซื้อ
          </button>
          <button @click="logout"
            class="w-full py-2 text-center text-[14px] font-semibold text-[#333] hover:bg-[#f1f1f1] rounded-[8px]">
            ออกจากระบบ
          </button>
        </div>

      </div>
    </div>

  </header>

  <div class="pb-[60px]"></div>
</template>