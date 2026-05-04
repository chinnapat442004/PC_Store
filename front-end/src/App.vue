<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router'
import { useCartStore } from './stores/cart';
import { useAuthStore } from './stores/auth';
const cartStore = useCartStore()

const authStore = useAuthStore()
onMounted(async () => {
  if (authStore.token) {
    await authStore.getCurrentUser()
    // โหลดตะกร้าเฉพาะลูกค้าเท่านั้น
    if (authStore.user?.role === 'customer') {
      await cartStore.getCarts()
    }
  }
})
</script>

<template>
  <RouterView name="navbar" />
  <RouterView name="sidebar" />

  <div>
    <RouterView />
  </div>
</template>
