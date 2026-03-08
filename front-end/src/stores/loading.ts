import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useLoadingStore = defineStore('loading', () => {
  const loading = ref(false)

  function doLoad() {
    loading.value = true
  }

  function finishLoad() {
    loading.value = false
  }

  return { loading, doLoad, finishLoad }
})
