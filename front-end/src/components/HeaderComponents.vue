<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { menu, close } from 'ionicons/icons'
import { nextTick } from 'vue'

import { onBeforeUnmount, onMounted, ref } from 'vue'

const isMenuOpen = ref(true)
const open = ref(true)
const page = ref('cart')

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
    class="shadow-lg py-[10px] px-[50px] bg-[#202020] md:mb-[0px]"
    :class="{ 'mb-[180px]': isMenuOpen, 'mb-[0px]': !isMenuOpen }"
  >
    <div class="flex justify-between items-center w-[92%] mx-auto md:gap-4">
      <!-- LOGO Main Menu -->
      <div class="flex justify-between items-center md:gap-10">
        <div><a href="javascript:void(0)" class="text-[3.7vh] text-[white]">LOGO</a></div>

        <div
          id="collapseMenu"
          class="md:static absolute min-h-[2vh] left-0 top-[11.5%] w-full items-center md:bg-[#202020] bg-[#cbcbcb]"
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

      <!-- Login Menu -->
      <div id="loginMenu" class="flex gap-4 items-center mt-4 md:mt-0">
        <ul class="flex gap-4 items-center">
          <li>
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
          </li>
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
        </ul>
      </div>
    </div>
  </header>
  <div></div>
</template>
