<script setup lang="ts">
defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div v-if="modelValue" class="overlay">
    <div class="loading-box">
      <img src="@/assets/Spinner@1x-1.0s-200px-200px .svg" class="loading-img select-none" />
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-box {
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-img {
  width: 120px;
}
</style>
