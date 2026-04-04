<script lang="ts" setup>
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import type { MenuItem } from '@/types/Menu'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
const route = useRoute()
const page = computed(() => route.name)
const authStore = useAuthStore()
const cartStore = useCartStore()
const checkMenu = ref(false)
const isToastActive = ref(false)

const props = defineProps<{
  menus: MenuItem[]
}>()
const isLogin = ref(localStorage.getItem('isLogin') === 'true')

function updateLoginStatus() {
  isLogin.value = localStorage.getItem('isLogin') === 'true'
}

async function logout() {
  await authStore.clearUser()
  updateLoginStatus()
  await cartStore.getCarts()
  checkMenu.value = false
 await router.replace( { name: 'login' })
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
  <div class="bg-[#202020] w-[240px] h-screen fixed">
    <ul class="flex flex-col gap-2 px-2 py-4">

      <li v-for="menu in menus" :key="menu.name">
        <router-link
          :to="menu.path"
          class="flex hover:bg-[#979dac] hover:text-black duration-300 rounded-[5px] p-3 font-semibold px-4 py-3"
          :class="page === menu.name
            ? 'md:bg-[#979dac] bg-[#2E2E2E] text-white'
            : 'md:bg-[#202020] text-white bg-[#202020]'"
        >
          {{ menu.label }}
        </router-link>
      </li>

    </ul>
  <div class="absolute bottom-0 w-full px-2 py-4">
  <button
    @click="logout"
    class="flex items-center gap-3 hover:bg-[#979dac] hover:text-black duration-300 rounded-[5px] font-semibold px-4 py-3 text-white w-full text-left"
  >
    <i class="pi pi-sign-out"></i>
    Logout
  </button>
</div>
  </div>
</template>