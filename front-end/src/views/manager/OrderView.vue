<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useOrderStore } from '@/stores/order'
import { useLoadingStore } from '@/stores/loading'
import { OrderStatusColor, OrderStatusLabel } from '@/constants/orderStatus'
import LoadingComponent from '@/components/LoadingComponent.vue'

const orderStore = useOrderStore()
const loadingStore = useLoadingStore()

const tab = ref<'order' | 'history'>('order')
const search = ref('')
const showDialog = ref(false)


const formatDate = (date: string | Date) => {
  const d = new Date(date)

  return `${String(d.getDate()).padStart(2, '0')}-${String(
    d.getMonth() + 1
  ).padStart(2, '0')}-${d.getFullYear()} ${String(d.getHours()).padStart(
    2,
    '0'
  )}:${String(d.getMinutes()).padStart(2, '0')}`
}



onMounted(async () => {
  await orderStore.getOrders()
})


watch(tab, async () => {
  orderStore.page = 1
  await orderStore.getOrders()
})


const searchData = async () => {
  // orderStore.search = search.value
  orderStore.page = 1
  await orderStore.getOrders()
}

const clearSearch = async () => {
  search.value = ''
  // orderStore.search = ''
  orderStore.page = 1
  await orderStore.getOrders()
}

const nextPage = async () => {
  if (orderStore.page < orderStore.lastPage) {
    orderStore.page++
    await orderStore.getOrders()
  }
}

const prevPage = async () => {
  if (orderStore.page > 1) {
    orderStore.page--
    await orderStore.getOrders()
  }
}


const openOrderDetail = (id: number) => {
  orderStore.getOrderById(id)
  showDialog.value = true

}

const closeDialog = () => {
  showDialog.value = false
}


</script>

<template>

  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold text-white">Order Management</h1>

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

  <!-- Table -->
  <div v-if="tab === 'order'" class="bg-white rounded-lg overflow-hidden">
    <table class="w-full text-left  text-black">
      <thead class="bg-[#383838] text-gray-300 text-sm">
        <tr>
          <th class="px-6 py-3 "> ออเดอร์</th>
          <th class="px-6 py-3 ">ลูกค้า</th>
          <th class="px-6 py-3">วิธีชำระเงิน</th>
          <th class="px-6 py-3 ">ยอด</th>
          <th class="px-6 py-3 ">สถานะ</th>
          <th class="px-6 py-3 ">วันที่</th>
          <th class="px-6 py-3 ">ดูรายละเอียด</th>
        </tr>
      </thead>

      <tbody class="divide-y">

        <tr v-if="orderStore.orders.length === 0">
          <td colspan="4" class="text-center py-6 text-gray-500">ไม่พบข้อมูลที่ค้นหา</td>
        </tr>
        <tr v-for="order in orderStore.orders" :key="order.address_detail">

          <td class="px-6 py-2">{{ order.order_id }}</td>
          <td class="px-6 py-2">{{ order.fullname }}</td>
          <td class="px-6 py-2">{{ order.payment_method }}</td>
          <td class="px-6 py-2">{{ order.total_amount }}</td>


          <td class="px-6 py-2">
            <span class="px-2 py-2 rounded-full text-xs font-semibold" :class="OrderStatusColor[order.order_status]">
              {{ OrderStatusLabel[order.order_status] }}
            </span>

          </td>

          <td class="px-6 py-1">
            {{ formatDate(order.updated_at) }}

          </td>



          <td class="px-6 py-1 align-middle">
            <div class="flex justify-center items-center space-x-2">


              <button @click=" openOrderDetail(order.order_id)">
                <span class="pi pi-eye"></span>
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
        {{ orderStore.page }} of {{ orderStore.lastPage }}</span>

      <button class="px-3 py-1 border rounded hover:bg-gray-100" @click="nextPage()">
        Next <span class="pi pi-chevron-right text-sm"></span>
      </button>
    </div>
  </div>



  <div v-else class="bg-white rounded-lg overflow-hidden">
    <table class="w-full text-left  text-black ">
      <thead class="bg-[#383838] text-gray-300 text-sm">
        <tr>

          <th class="px-6 py-3 ">Name</th>
          <th class="px-6 py-3"> จำนวน</th>
          <th class="px-6 py-3 ">type</th>
          <th class="px-6 py-3 ">note</th>
          <th class="px-6 py-3 ">ref</th>
          <th class="px-6 py-3 ">created_at</th>

        </tr>
      </thead>


    </table>

    <!-- Pagination -->
    <div class="flex justify-end items-center gap-4 py-4 border-t mr-3">
      <button class="px-3 py-1 border rounded hover:bg-gray-100" @click="prevPage()">
        <span class="pi pi-chevron-left text-sm"></span> Prev
      </button>

      <span class="text-sm text-gray-600">
        {{ orderStore.page }} of {{ orderStore.lastPage }}</span>

      <button class="px-3 py-1 border rounded hover:bg-gray-100" @click="nextPage()">
        Next <span class="pi pi-chevron-right text-sm"></span>
      </button>
    </div>
  </div>









  <!-- Dialog -->
  <div v-if="showDialog" class="overlay">
    <div class="dialog">
      <div class="flex justify-between">
        <h2 class="text-lg font-semibold mb-4">
          ออเดอร์ {{ orderStore.selectedOrder?.order_id }}
        </h2>
        <button @click="closeDialog">
          <span class="pi pi-times"></span>
        </button>
      </div>
      <label class="block mb-1">ข้อมูลลูกค้า</label>
      <div class="mb-3 p-2   bg-gray-100">
        <div> {{ orderStore.selectedOrder?.fullname }}</div>
        <div>{{ orderStore.selectedOrder?.phone }}</div>
        <div>{{ orderStore.selectedOrder?.address_detail }} {{ orderStore.selectedOrder?.sub_district }} {{
          orderStore.selectedOrder?.district }} {{ orderStore.selectedOrder?.province }} {{
            orderStore.selectedOrder?.zipcode }}</div>

      </div>

      <label class="block mb-1 ">รายการสินค้า
      </label>
      <div class=" max-h-[250px] overflow-y-auto">
        <div class="mb-3 p-2   bg-gray-100" v-for="detail in orderStore.selectedOrder?.details"
          :key="detail.order_detail_id">
          <div class="flex-1 flex flex-col justify-between gap-1">
            <div class="flex justify-between items-start gap-2">
              <div class="text-sm sm:text-base line-clamp-2">
                {{ detail.product_title }}
              </div>
              <div class="text-red-500  text-sm sm:text-base whitespace-nowrap">
                ฿{{ detail.price }}
              </div>
            </div>
            <div class="flex justify-between items-center text-sm text-gray-600">
              <div class="flex items-center gap-2 bg-white px-2 py-1 rounded-md">
                <span class="text-xs">จำนวน</span>
                <span class="font-medium">{{ detail.quantity }}</span>
              </div>
            </div>
          </div>



        </div>
      </div>

      <div class="mb-3 flex justify-between">
        <label class="block mb-1"> ยอดรวม</label>
        <div>{{ orderStore.selectedOrder?.total_amount }}</div>

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