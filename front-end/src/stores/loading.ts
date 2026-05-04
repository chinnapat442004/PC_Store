import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useLoadingStore = defineStore('loading', () => {
  const loading = ref(false)
  const count = ref(0)

  function doLoad() {
    count.value++
    loading.value = true
  }

  function finishLoad() {
    count.value--
    if (count.value <= 0) {
      count.value = 0
      loading.value = false
    }
  }

  return { loading, doLoad, finishLoad }
})
