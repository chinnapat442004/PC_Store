<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView name="sidebar" />

  <div class="content">
    <RouterView />
  </div>
</template>
