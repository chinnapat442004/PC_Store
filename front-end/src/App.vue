<script setup lang="ts">
import { RouterView } from 'vue-router'
import HeaderComponents from './components/HeaderComponents.vue'
</script>

<template>
  <RouterView name="sidebar" />

  <div class="content">
    <RouterView />
  </div>
</template>
