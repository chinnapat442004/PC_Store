<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { menu, close, person } from 'ionicons/icons'
import { nextTick } from 'vue'

import { onBeforeUnmount, onMounted, ref } from 'vue'

const isMenuOpen = ref(true)
const open = ref(true)
const page = ref('home')

function show() {
  isMenuOpen.value = !isMenuOpen.value
  open.value = !open.value
}

const checkScreenSize = () => {
  isMenuOpen.value = window.innerWidth >= 768
  isMenuOpen.value = true
  open.value = true
}

onMounted(() => {
  checkScreenSize()

  window.addEventListener('resize', checkScreenSize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<template>
  <header
    class="shadow-lg py-[10px] px-[90px] md:px-[30px] bg-[#202020] fixed top-0 left-0 w-full z-50"
    :class="{ 'mb-[180px]': isMenuOpen, 'mb-[0px]': !isMenuOpen }"
  >
    <div class="flex justify-between items-center w-[92%] mx-auto md:gap-4">
      <!-- LOGO Main Menu -->
      <div class="flex justify-between items-center md:gap-10">
        <div><a href="javascript:void(0)" class="text-[3.7vh] text-[white]">LOGO</a></div>

        <div
          id="collapseMenu"
          class="md:static absolute min-h-[2vh] left-0 top-[70px] w-full items-center md:bg-[#202020] bg-[#cbcbcb]"
          :class="{ hidden: !isMenuOpen }"
        >
          <ul class="flex md:flex-row flex-col md:gap-4 items-center justify-center">
            <li
              @click="
                async () => {
                  page = 'home'
                  await nextTick()
                }
              "
            >
              <router-link
                :to="{ name: 'home' }"
                class="md:w-[80px] w-[400px] md:h-[40px] h-[60px] md:hover:text-[#333] font-semibold text-[15px] hover:bg-[#6d717a] duration-300 rounded-[5px] flex items-center justify-center"
                :class="
                  page === 'home'
                    ? 'md:bg-[#979dac] bg-[#6d717a]  text-black '
                    : 'md:bg-[#202020] md:text-white bg-[#a0a0a1]'
                "
              >
                Home
              </router-link>
            </li>
            <li
              @click="
                async () => {
                  page = 'shop'
                  await nextTick()
                }
              "
            >
              <router-link
                :to="{ name: 'shop' }"
                class="md:w-[80px] w-[400px] md:h-[40px] h-[60px] md:hover:text-[#333] font-semibold text-[15px] hover:bg-[#6d717a] duration-300 rounded-[5px] flex items-center justify-center"
                :class="
                  page === 'shop'
                    ? 'md:bg-[#979dac] bg-[#6d717a]  text-black '
                    : 'md:bg-[#202020] md:text-white bg-[#a0a0a1]'
                "
              >
                Shop
              </router-link>
            </li>
            <li
              @click="
                async () => {
                  page = 'cart'
                  await nextTick()
                }
              "
            >
              <router-link
                :to="{ name: 'cart' }"
                class="md:w-[80px] w-[400px] md:h-[40px] h-[60px] md:hover:text-[#333] font-semibold text-[15px] hover:bg-[#6d717a] duration-300 rounded-[5px] flex items-center justify-center"
                :class="
                  page === 'cart'
                    ? 'md:bg-[#979dac] bg-[#6d717a]  md:text-black '
                    : 'md:bg-[#202020] md:text-white bg-[#a0a0a1]'
                "
              >
                Cart
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <div
          class="flex items-center md:w-[300px] w-[200px] p-2 bg-[#a0a0a1] rounded-[30px] shadow-md"
        >
          <input
            type="text"
            placeholder="ค้นหาสินค้า"
            class="flex-grow bg-transparent outline-none text-black placeholder-black px-2"
          />
          <button
            class="text-white bg-[#6d717a] hover:bg-[#202020] rounded-lg px-3 py-1 ml-2 transition"
          >
            ค้นหา
          </button>
        </div>
      </div>

      <!-- Login Menu -->
      <div>
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
      <div id="loginMenu" class="flex gap-4 items-center mt-4 md:mt-0">
        <!-- <li>
            <a
              href="javascript:void(0)"
              class="w-[80px] h-[40px] text-[white] hover:text-[#333] font-semibold text-[15px] hover:bg-[#979dac] duration-300 rounded-[5px] flex items-center justify-center"
              >Register</a
            >
          </li>
          <li>
            <a
              href="javascript:void(0)"
              class="w-[80px] h-[40px] text-[white] hover:text-[#333] font-semibold text-[15px] hover:bg-[#979dac] duration-300 rounded-[5px] flex items-center justify-center"
              >Login</a
            >
          </li> -->
        <button
          class="w-[40px] h-[40px] text-[white] hover:text-[#333] font-semibold text-[15px] hover:bg-[#979dac] duration-300 rounded-full flex items-center justify-center border-2"
        >
          <IonIcon :icon="person" class="text-[white] text-3xl" />
        </button>
      </div>
    </div>
  </header>
  <div></div>
</template>
