<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView name="navbar" />
  <RouterView name="sidebar" />

  <div>
    <RouterView />
  </div>
</template>
