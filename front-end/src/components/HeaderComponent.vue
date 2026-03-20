<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { IonIcon } from '@ionic/vue'
import { menu, close, person } from 'ionicons/icons'
import { useRoute } from 'vue-router'

const authStore = useAuthStore()
const cartStore = useCartStore()
const route = useRoute()

import { onBeforeUnmount, onMounted, ref, nextTick, computed } from 'vue'
import { toast } from 'vue3-toastify'

const isLogin = ref(localStorage.getItem('isLogin') === 'true')

function updateLoginStatus() {
  isLogin.value = localStorage.getItem('isLogin') === 'true'
}

const isMenuOpen = ref(false)
const open = ref(false)
// const page = ref()
const checkMenu = ref(false)
const user = ref()


const cartDetailCount = computed(() => {
  const cart = cartStore.cart
  return cart && cart.cartDetails ? cart.cartDetails.length : 0
})
const isToastActive = ref(false)

function show() {
  isMenuOpen.value = !isMenuOpen.value
  open.value = !open.value
}

const checkScreenSize = () => {
  if (window.innerWidth >= 768) {
    isMenuOpen.value = true
  } else {
    isMenuOpen.value = false
  }
  open.value = false
}

onMounted(async () => {
  checkScreenSize()
  await authStore.getCurrentUser()
  const storedUser = localStorage.getItem('user')
  user.value = storedUser ? JSON.parse(storedUser) : null
  console.log(user)
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

  checkMenu.value = await false
  isLogout()
}

const isLogout = () => {
  if (!isToastActive.value) {
    isToastActive.value = true
    
    toast.success('ออกจากระบบสำเร็จ', {
      position: toast.POSITION.TOP_RIGHT,
      onClose: () => {
        isToastActive.value = false
      },
    })
  }
}
</script>

<template>
  <header
    class="shadow-lg py-[10px] px-[5px] md:px-[30px] bg-[#202020] fixed top-0 left-0 w-full z-50  "
    :class="{ 'mb-[180px] ': isMenuOpen, 'mb-[0px]': !isMenuOpen }"
  >
    <div class="flex justify-between items-center w-[92%] mx-auto md:gap-4">
      <!-- LOGO Main Menu -->

      <div class="md:hidden">
        <IonIcon
          v-if="!open"
          @click="show"
          :icon="menu"
          class="text-3xl cursor-pointer md:hidden text-[white]"
        />
        <IonIcon
          v-if="open"
          @click="show"
          :icon="close"
          class="text-3xl cursor-pointer md:hidden text-[white]"
        />
      </div>
      <div class="flex items-center md:gap-10">
        <div><a class="text-[30px] text-[white]">LOGO</a></div>

        <div
          id="collapseMenu"
          class="md:static absolute min-h-[2vh] left-0 top-[65px] w-full items-center md:bg-[#202020] bg-[#202020]"
          :class="{ 'hidden md:block': !isMenuOpen }"
        >
          <ul class="flex md:flex-row flex-col md:gap-4 items-center justify-center">
            <li
              @click="
            isMenuOpen = false,
            open =false
                
              "
            >
              <router-link
                :to="{ name: 'home' }"
                class="md:w-[80px] w-[400px] md:h-[40px] h-[60px] md:hover:text-[#333] font-semibold text-[15px] hover:md:bg-[#6d717a] hover:bg-[#333333] duration-300 rounded-[5px] flex items-center justify-center"
                :class="
                  route.name === 'home'
                    ? 'md:bg-[#979dac] bg-[#2E2E2E]  text-white '
                    : 'md:bg-[#202020] text-white bg-[#202020]'
                "
              >
                Home
              </router-link>
            </li>
            <li
              @click="
                      isMenuOpen = false,
            open =false
              "
            >
              <router-link
                :to="{ name: 'shop' }"
                class="md:w-[80px] w-[400px] md:h-[40px] h-[60px] md:hover:text-[#333] font-semibold text-[15px] hover:md:bg-[#6d717a] hover:bg-[#333333] duration-300 rounded-[5px] flex items-center justify-center"
                :class="
                  route.path.startsWith('/shop') || route.path.startsWith('/product')
                    ? 'md:bg-[#979dac] bg-[#2E2E2E] text-white  #333333 '
                    : 'md:bg-[#202020] text-white bg-[#202020]'
                "
              >
                Shop
              </router-link>
            </li>
            <li
              @click="
                        isMenuOpen = false,
            open =false
              "
            >
              <router-link
                :to="{ name: 'cart' }"
                class="md:w-[80px] w-[400px] md:h-[40px] h-[60px] md:hover:text-[#333] font-semibold text-[15px] hover:md:bg-[#6d717a] hover:bg-[#333333] duration-300 rounded-[5px] flex items-center justify-center relative"
                :class="[
                  route.name === 'cart'
                    ? 'md:bg-[#979dac] bg-[#2E2E2E] text-white '
                    : 'md:bg-[#202020] text-white bg-[#202020]',
                ]"
              >
                Cart
                <span
                  class="absolute top-[-5px] right-[-5px] bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  v-if="cartDetailCount >= 1"
                >
                  {{ cartDetailCount }}
                </span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      

      <div id="loginMenu" class="flex gap-4 items-center justify-center">
        <div>
          <button
            @click="checkMenu = !checkMenu"
            class="w-[40px] h-[40px] text-[white] hover:text-[#333] font-semibold text-[15px] hover:bg-[#979dac] duration-300 rounded-full flex items-center justify-center border-2"
          >
            <IonIcon v-if="!isLogin" :icon="person" class="text-[white] text-3xl" />

            <img
              v-if="isLogin"
              :src="
                `http://localhost:3000/images/users/${user?.image}` ||
                'https://cdn-icons-png.flaticon.com/512/3682/3682281.png'
              "
              class="w-full h-full object-cover rounded-full"
              alt="User Profile"
            />
          </button>
        </div>

        <div
          v-if="checkMenu === true && !isLogin"
          class="bg-white absolute w-[170px] h-[120px] top-14 rounded-[10px] shadow-lg flex flex-col items-center justify-center gap-2 duration-300 md:right-auto right-0"
        >
          <router-link
            :to="{ name: 'login' }"
            class="w-full py-2 text-center text-[14px] font-semibold text-[#333] hover:bg-[#f1f1f1] rounded-[8px] block"
          >
            Sign in
          </router-link>
          <router-link
            class="w-full py-2 text-center text-[14px] font-semibold text-[#333] hover:bg-[#f1f1f1] rounded-[8px]"
            :to="{ name: 'register' }"
          >
            Register
          </router-link>
        </div>

        <div
          v-if="checkMenu === true && isLogin"
          class="   bg-white absolute w-[170px] h-[120px] top-14 rounded-[10px] shadow-lg flex flex-col items-center justify-center gap-2 duration-300 md:right-auto right-0"
        >
          <router-link
            class="w-full py-2 text-center text-[14px] font-semibold text-[#333] hover:bg-[#f1f1f1] rounded-[8px] block"
            to=""
          >
            บัญชีของฉัน
          </router-link>
          <button
            class="w-full py-2 text-center text-[14px] font-semibold text-[#333] hover:bg-[#f1f1f1] rounded-[8px]"
            @click="logout"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>
    </div>
  </header>
  <div class="pb-[60px]"></div>
</template>
