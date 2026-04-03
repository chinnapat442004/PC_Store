<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { IonIcon } from '@ionic/vue'
import { menu, close, person } from 'ionicons/icons'
import { useRoute } from 'vue-router'
import { onBeforeUnmount, onMounted, ref, computed } from 'vue'
import { toast } from 'vue3-toastify'
const page = computed(() => route.name)
const authStore = useAuthStore()
const cartStore = useCartStore()
const route = useRoute()

const isLogin = ref(localStorage.getItem('isLogin') === 'true')

function updateLoginStatus() {
  isLogin.value = localStorage.getItem('isLogin') === 'true'
}

const isMenuOpen = ref(false)
const open = ref(false)
const checkMenu = ref(false)
const user = ref()
const isToastActive = ref(false)

const menus = [
  { name: 'home', label: 'Home', path: { name: 'home' } },
  { name: 'shop', label: 'Shop', path: { name: 'shop' } },
  { name: 'cart', label: 'Cart', path: { name: 'cart' } },
]
const isActive = (name: string) => route.name === name

const cartDetailCount = computed(() => {
  return cartStore.cart?.cartDetails?.length || 0
})

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
  await authStore.getCurrentUser()
  const storedUser = localStorage.getItem('user')
  user.value = storedUser ? JSON.parse(storedUser) : null
  window.addEventListener('resize', checkScreenSize)
  cartStore.getCarts()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize)
})

async function logout() {
  await authStore.clearUser()
  updateLoginStatus()
  await cartStore.getCarts()
  checkMenu.value = false

  if (!isToastActive.value) {
    isToastActive.value = true
    toast.success('ออกจากระบบสำเร็จ', {
      position: toast.POSITION.TOP_RIGHT,
      onClose: () => (isToastActive.value = false),
    })
  }
}
</script>

<template>
  <header class="shadow-lg py-[10px] px-[5px] md:px-[30px] bg-[#202020] fixed top-0 left-0 w-full z-50">
    <div class="flex justify-between items-center w-[92%] mx-auto md:gap-4">

      <div class="md:hidden">
        <IonIcon
          @click="toggleMenu"
          :icon="open ? close : menu"
          class="text-3xl cursor-pointer text-white"
        />
      </div>

      <div class="flex items-center md:gap-10">
        <div class="text-[30px] text-white">LOGO</div>

        <div
          class="md:static absolute left-0 top-[65px] w-full bg-[#202020]"
          :class="{ 'hidden md:block': !isMenuOpen }"
        >
          <ul class="flex md:flex-row flex-col md:gap-4 items-center justify-center">

            <li v-for="menu in menus" :key="menu.name" @click="closeMenu">
              <router-link
                :to="menu.path"
                class="md:w-[80px] w-[400px] md:h-[40px] h-[60px] flex items-center justify-center font-semibold rounded-[5px] duration-300 hover:bg-[#333333] md:hover:bg-[#6d717a] relative"
                :class="page === menu.name
                  ? 'md:bg-[#979dac] bg-[#2E2E2E] text-white'
                  : 'bg-[#202020] text-white'"
              >
                {{ menu.label }}

                <span
                  v-if="menu.name === 'cart' && cartDetailCount > 0"
                  class="absolute top-[-5px] right-[-5px] bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {{ cartDetailCount }}
                </span>
              </router-link>
            </li>

          </ul>
        </div>
      </div>

      <div class="flex gap-4 items-center justify-center">
        <div>
          <button
            @click="checkMenu = !checkMenu"
            class="w-[40px] h-[40px] text-white hover:text-[#333] hover:bg-[#979dac] duration-300 rounded-full flex items-center justify-center border-2"
          >
            <IonIcon v-if="!isLogin" :icon="person" class="text-3xl" />

            <img
              v-if="isLogin"
              :src="`http://localhost:3000/images/users/${user?.image}` || 'https://cdn-icons-png.flaticon.com/512/3682/3682281.png'"
              class="w-full h-full object-cover rounded-full"
            />
          </button>
        </div>

        <div
          v-if="checkMenu && !isLogin"
          class="bg-white absolute w-[170px] h-[120px] top-14 rounded-[10px] shadow-lg flex flex-col items-center justify-center gap-2 md:right-auto right-0"
        >
          <router-link
            :to="{ name: 'login' }"
            class="w-full py-2 text-center text-[14px] font-semibold text-[#333] hover:bg-[#f1f1f1] rounded-[8px]"
          >
            Sign in
          </router-link>
          <router-link
            :to="{ name: 'register' }"
            class="w-full py-2 text-center text-[14px] font-semibold text-[#333] hover:bg-[#f1f1f1] rounded-[8px]"
          >
            Register
          </router-link>
        </div>

        <div
          v-if="checkMenu && isLogin"
          class="bg-white absolute w-[170px] h-[120px] top-14 rounded-[10px] shadow-lg flex flex-col items-center justify-center gap-2 md:right-auto right-0"
        >
          <router-link
            to="/profile"
            class="w-full py-2 text-center text-[14px] font-semibold text-[#333] hover:bg-[#f1f1f1] rounded-[8px]"
          >
            บัญชีของฉัน
          </router-link>
          <button
            @click="logout"
            class="w-full py-2 text-center text-[14px] font-semibold text-[#333] hover:bg-[#f1f1f1] rounded-[8px]"
          >
            ออกจากระบบ
          </button>
        </div>

      </div>
    </div>

  </header>

  <div class="pb-[60px]"></div>
</template>