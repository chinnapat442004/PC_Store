import { defineStore } from "pinia";
import stockService from '@/service/stock'
import { ref } from "vue";
import type { MovementItem, StockItem, UpdateStock } from "@/types/Stock";
import { useLoadingStore } from "./loading";

export const useStockStore = defineStore('stock', () => {
  const loadingStore = useLoadingStore()
  const stocks = ref<StockItem[]>([])
  const movements = ref<MovementItem[]>([])

  const page = ref(1)
  const limit = ref(10)
  const lastPage = ref(1)
  const total = ref(0)
  const search = ref('')

  async function getStocks(p = page.value, l = limit.value, s = search.value) {
    const res = await stockService.getStocks(p, l, s)
    stocks.value = res.data.data
    page.value = res.data.page
    lastPage.value = res.data.lastPage
    total.value = res.data.total
  }


  async function getMovements(p = page.value, l = limit.value, s = search.value) {
    const res = await stockService.getmovements(p, l, s)
    movements.value = res.data.data
    page.value = res.data.page
    lastPage.value = res.data.last_page
    total.value = res.data.total
  }


  async function updateStock(stock: UpdateStock) {

    try {
      loadingStore.doLoad()

      await stockService.updateStock(stock)
      await getStocks()

    } catch (error) {
      console.error(error)
    } finally {
      loadingStore.finishLoad()
    }
  }

  return {
    stocks, page,
    limit,
    lastPage,
    total,
    search,
    movements,
    getStocks,
    updateStock, getMovements
  }
})