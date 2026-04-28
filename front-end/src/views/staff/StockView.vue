<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useStockStore } from '@/stores/stock'
import { useLoadingStore } from '@/stores/loading'
import type { StockItem } from '@/types/Stock'
import { formatThaiDateTime } from '@/utils/formatDate'

const stockStore = useStockStore()
const loadingStore = useLoadingStore()


const tab = ref<'stock' | 'history'>('stock')
const search = ref('')

const showDialog = ref(false)
const selectedStock = ref<StockItem | null>(null)
const quantity = ref(0)
const note = ref('')


onMounted(async () => {
  await fetchData()
})


watch(tab, async () => {
  stockStore.page = 1
  await fetchData()
})


const formatQty = (qty: number, type: string) => {
  if (type === 'IN') return `+${qty}`
  if (type === 'OUT') return `-${qty}`
  return qty
}

const fetchData = async () => {
  if (tab.value === 'stock') {
    await stockStore.getStocks()
  } else {
    await stockStore.getMovements()
  }
}


const searchData = async () => {
  stockStore.search = search.value
  stockStore.page = 1
  await fetchData()
}

const clearSearch = async () => {
  search.value = ''
  stockStore.search = ''
  stockStore.page = 1
  await fetchData()
}


const nextPage = async () => {
  if (stockStore.page < stockStore.lastPage) {
    stockStore.page++
    await fetchData()
  }
}

const prevPage = async () => {
  if (stockStore.page > 1) {
    stockStore.page--
    await fetchData()
  }
}


const openEdit = (stock: StockItem) => {
  selectedStock.value = stock
  quantity.value = stock.quantity
  note.value = ''
  showDialog.value = true
}
const closeDialog = () => {
  showDialog.value = false
}

const updateStock = async () => {
  if (!selectedStock.value) return
  if (quantity.value === selectedStock.value.quantity) {
    showDialog.value = false
    return
  }

  await stockStore.updateStock({
    product_id: selectedStock.value.product_id,
    quantity: quantity.value,
    note: note.value || undefined,
  })
  showDialog.value = false
}

</script>

<template>

  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold text-white">Stock Management</h1>

    <div class="flex items-center gap-3">
      <input type="text" placeholder="Search..." v-model="search" class="border px-3 py-2 rounded w-64" />

      <button class="bg-white/10 hover:bg-white/20 text-white p-2 rounded-md" @click="searchData()">
        <span class="pi pi-search"></span>
      </button>

      <button class="bg-white/10 hover:bg-white/20 text-white p-2 rounded-md" @click="clearSearch()">
        <span class="pi pi-times"></span>
      </button>


    </div>
  </div>

  <div class="inline-flex bg-gray-100  mb-4 rounded-xl">

    <button @click="tab = 'stock'" class="px-4 py-2 text-sm rounded-lg transition" :class="tab === 'stock'
      ? 'bg-white shadow text-black'
      : 'text-gray-500'">
      สินค้าคงเหลือ
    </button>

    <button @click="tab = 'history'" class="px-4 py-2 text-sm rounded-lg transition" :class="tab === 'history'
      ? 'bg-white shadow text-black'
      : 'text-gray-500'">
      ประวัติ
    </button>

  </div>



  <!-- Table -->
  <div v-if="tab === 'stock'" class="bg-white rounded-lg overflow-hidden">
    <table class="w-full text-left  text-black">
      <thead class="bg-[#383838] text-gray-300 text-sm">
        <tr>
          <th class="px-6 py-3 "> รูปภาพ </th>
          <th class="px-6 py-3 ">ชื่อสินค้า</th>
          <th class="px-6 py-3"> ราคา</th>
          <th class="px-6 py-3 ">จำนวน</th>
          <th class="px-6 py-3 ">สถานะ </th>
          <th class="px-6 py-3 ">อัพเดทล่าสุด</th>
          <th class="px-6 py-3 "> จัดการสต็อก</th>
        </tr>
      </thead>

      <tbody class="divide-y">

        <tr v-if="stockStore.stocks.length === 0">
          <td colspan="4" class="text-center py-6 text-gray-500">ไม่พบข้อมูลที่ค้นหา</td>
        </tr>
        <tr v-for="stock in stockStore.stocks" :key="stock.id">
          <td class="text-center align-middle">
            <img :src="stock.image" alt="" class="h-32 w-32 object-cover rounded" />
          </td>

          <td class="px-6 py-1">{{ stock.product_title }}</td>
          <td class="px-6 py-1">{{ stock.product_price }}</td>
          <td class="px-6 py-1">{{ stock.quantity }}</td>

          <td class="px-6 py-1">
            <span class="px-2 py-1 rounded-full text-xs font-semibold" :class="{
              'bg-green-100 text-green-700': stock.status_label === 'in stock',
              'bg-yellow-100 text-yellow-700': stock.status_label === 'low stock',
              'bg-red-100 text-red-700': stock.status_label === 'out of stock',
            }">
              {{ stock.status_label }}
            </span>

          </td>

          <td class="px-6 py-1">
            {{ formatThaiDateTime(stock.updated_at) }}
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
        {{ stockStore.page }} of {{ stockStore.lastPage }}</span>

      <button class="px-3 py-1 border rounded hover:bg-gray-100" @click="nextPage()">
        Next <span class="pi pi-chevron-right text-sm"></span>
      </button>
    </div>
  </div>



  <div v-else class="bg-white rounded-lg overflow-hidden">
    <table class="w-full text-left  text-black ">
      <thead class="bg-[#383838] text-gray-300 text-sm">
        <tr>

          <th class="px-6 py-3 ">ชื่อสินค้า</th>
          <th class="px-6 py-3"> จำนวน</th>
          <th class="px-6 py-3 ">ประเภท</th>
          <th class="px-6 py-3 ">หมายเหตุ</th>
          <th class="px-6 py-3 ">อ้างอิง</th>
          <th class="px-6 py-3 ">วันที่สร้าง</th>

        </tr>
      </thead>

      <tbody class="divide-y">

        <tr v-if="stockStore.movements.length === 0">
          <td colspan="4" class="text-center py-6 text-gray-500">ไม่พบข้อมูลที่ค้นหา</td>
        </tr>
        <tr v-for="movement in stockStore.movements" :key="movement.id">
          <td class="px-6 py-3">{{ movement.product_title }}</td>
          <td class="px-6 py-3" :class="{
            'text-green-700': movement.type === 'IN',
            'text-red-700': movement.type === 'OUT',
          }">{{ formatQty(movement.change_qty, movement.type) }}</td>

          <td class="px-6 py-3">
            <span class="px-2 py-1 rounded-full text-xs font-semibold" :class="{
              'bg-green-100 text-green-700': movement.type === 'IN',

              'bg-red-100 text-red-700': movement.type === 'OUT',
            }">
              {{ movement.type }}
            </span>
          </td>

          <td class="px-6 py-3">{{ movement.note }}

          </td>

          <td class="px-6 py-3"> {{ movement.ref ? movement.ref : '-' }}</td>

          <td class="px-6 py-3">{{ formatThaiDateTime(movement.created_at) }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="flex justify-end items-center gap-4 py-4 border-t mr-3">
      <button class="px-3 py-1 border rounded hover:bg-gray-100" @click="prevPage()">
        <span class="pi pi-chevron-left text-sm"></span> Prev
      </button>

      <span class="text-sm text-gray-600">
        {{ stockStore.page }} of {{ stockStore.lastPage }}</span>

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
        <input :value="selectedStock?.product_title || ''" disabled
          class="border w-full px-3 py-2 rounded bg-gray-100" />
      </div>

      <!-- Quantity -->
      <div class="mb-3">
        <label class="block mb-1">Quantity</label>
        <input v-model.number="quantity" type="number" min="0" class="border w-full px-3 py-2 rounded bg-gray-50" />
      </div>

      <div class="mb-3">
        <label class="block mb-1">Note</label>
        <textarea v-model="note" rows="3" placeholder="เพิ่มหมายเหตุ เช่น ปรับ stock / สินค้าชำรุด"
          class="border w-full px-3 py-2 rounded bg-gray-50" />
      </div>

      <div class="flex justify-center gap-4">
        <button class="bg-red-500 text-white px-4 py-1 rounded" @click="closeDialog">
          Cancel
        </button>

        <button class="bg-green-500 text-white px-4 py-1 rounded" @click="updateStock">
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