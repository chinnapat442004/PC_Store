<script setup lang="ts">
import { onMounted, ref } from 'vue'


import { useLoadingStore } from '@/stores/loading'
import LoadingComponent from '@/components/LoadingComponent.vue'
import { useStockStore } from '@/stores/stock'
import type { StockItem } from '@/types/Stock'

const stockStore = useStockStore()

const note = ref<string>('')
onMounted(async () => {
  await stockStore.getStocks()
  console.log(stockStore.stocks)
 

})
const loadingStore = useLoadingStore()


const showDialog = ref(false)
const search = ref('')




const selectedStock = ref<StockItem | null>(null)
const quantity = ref<number>(0)


const formatDate = (date: string | Date) => {
  const d = new Date(date)

  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()

  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')

  return `${day}-${month}-${year} ${hours}:${minutes}`
}




const closeDialog = () => {

  showDialog.value = false
}



const openEdit = (stock: StockItem) => {
  selectedStock.value = stock
  quantity.value = stock.quantity
  note.value = '' 
  showDialog.value = true
}
const updateStock = async () => {
  if (!selectedStock.value) return

 
  if (quantity.value === selectedStock.value.quantity) {
    showDialog.value = false
    return
  }

  await stockStore.updateStock({
    product_id: selectedStock.value.product_id,
    quantity: quantity.value,  note: note.value || undefined,
  })

  showDialog.value = false
}


const nextPage = async () => {
  if (stockStore.page < stockStore.lastPage) {
    stockStore.page++
    await stockStore.getStocks()
  }
}

const prevPage = async () => {
  if (stockStore.page > 1) {
    stockStore.page--
    await stockStore.getStocks()
  }
}

const searchStock = async () => {
  stockStore.search = search.value
  await stockStore.getStocks()
}


const clearSearch = async () => {
  search.value = ''
 stockStore.search = ''
  stockStore.page = 1
  await stockStore.getStocks()
}
</script>

<template>
 
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-white">System Settings</h1>

        <div class="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search..."
            v-model="search"
            class="border px-3 py-2 rounded w-64"
          />

          <button class="bg-white/10 hover:bg-white/20 text-white p-2 rounded-md" @click="searchStock()">
            <span class="pi pi-search"></span>
          </button>

          <button class="bg-white/10 hover:bg-white/20 text-white p-2 rounded-md" @click="clearSearch()">
            <span class="pi pi-times"></span>
          </button>

          
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-lg overflow-hidden">
        <table class="w-full text-left text-black">
          <thead class="bg-[#383838] text-gray-300 text-sm">
            <tr>
              <th class="px-6 py-3"> Image</th>
              <th class="px-6 py-3 text-center">Name</th>
                 <th class="px-6 py-3"> Price</th>
              <th class="px-6 py-3 text-center">Quantity</th>
               <th class="px-6 py-3 text-center">Status</th>
               <th class="px-6 py-3 text-center">อัพเดทล่าสุด</th>
                    <th class="px-6 py-3 text-center">Update</th>
            </tr>
          </thead>

          <tbody class="divide-y">

             <tr v-if="stockStore.stocks.length === 0">
              <td colspan="4" class="text-center py-6 text-gray-500">ไม่พบข้อมูลที่ค้นหา</td>
            </tr>
            <tr v-for="stock in stockStore.stocks" :key="stock.id">
              <td class="text-center align-middle">
                <img
                     :src="stock.image"
                  alt=""
                  class="h-32 w-32 object-cover rounded"
                />
              </td>
         
              <td class="px-6 py-1">{{ stock.product_title }}</td>
              <td class="px-6 py-1">{{ stock.product_price }}</td>
              <td class="px-6 py-1">{{ stock.quantity }}</td>

              <td class="px-6 py-1">
<span
    class="px-2 py-1 rounded-full text-xs font-semibold"
    :class="{
      'bg-green-100 text-green-700': stock.status_label === 'in stock',
      'bg-yellow-100 text-yellow-700': stock.status_label === 'low stock',
      'bg-red-100 text-red-700': stock.status_label === 'out of stock',
    }"
  >
    {{ stock.status_label }}
  </span>
  
</td>

                           <td class="px-6 py-1">
  {{ formatDate(stock.updated_at) }}
  
</td>
           
           

            <td class="px-6 py-1 align-middle">
  <div class="flex justify-center items-center space-x-2">
   

    <button class="delete-btn" @click="openEdit(stock)">
      <span class="pi pi-sync"></span>
    </button>
  </div>
</td>
            </tr>
          </tbody>
        </table>

          <!-- Pagination -->
        <div class="flex justify-end items-center gap-4 py-4 border-t mr-3">
          <button class="px-3 py-1 border rounded hover:bg-gray-100" @click="prevPage()">
            <span class="pi pi-chevron-left text-sm"></span> Prev
          </button>

          <span class="text-sm text-gray-600">
            {{ stockStore.page }} of {{ stockStore.lastPage }}</span
          >

          <button class="px-3 py-1 border rounded hover:bg-gray-100" @click="nextPage()">
            Next <span class="pi pi-chevron-right text-sm"></span>
          </button>
        </div>
      </div>
   
   
 
  <!-- Dialog -->
  <div v-if="showDialog" class="overlay">
  <div class="dialog">
    <h2 class="text-lg font-semibold mb-4">
      Update Stock
    </h2>

    <!-- Product -->
    <div class="mb-3">
      <label class="block mb-1">Product</label>
      <input
        :value="selectedStock?.product_title || ''"
        disabled
        class="border w-full px-3 py-2 rounded bg-gray-100"
      />
    </div>

    <!-- Quantity -->
    <div class="mb-3">
      <label class="block mb-1">Quantity</label>
      <input
        v-model.number="quantity"
        type="number"
        min="0"
        class="border w-full px-3 py-2 rounded bg-gray-50"
      />
    </div>

    <div class="mb-3">
  <label class="block mb-1">Note</label>
  <textarea
    v-model="note"
    rows="3"
    placeholder="เพิ่มหมายเหตุ เช่น ปรับ stock / สินค้าชำรุด"
    class="border w-full px-3 py-2 rounded bg-gray-50"
  />
</div>

    <div class="flex justify-center gap-4">
      <button
        class="bg-red-500 text-white px-4 py-1 rounded"
        @click="closeDialog"
      >
        Cancel
      </button>

      <button
        class="bg-green-500 text-white px-4 py-1 rounded"
        @click="updateStock"
      >
        Save
      </button>
    </div>
  </div>
</div>

  

  <LoadingComponent v-model="loadingStore.loading" />
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
}
</style>