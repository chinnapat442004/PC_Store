<script setup lang="ts">
import { useLoadingStore } from '@/stores/loading'
import LoadingComponent from '@/components/LoadingComponent.vue'
import { onMounted, ref, watch } from 'vue'
import type { OrderStatus, UpdateOrder } from '@/types/Order'
import { useOrderStore } from '@/stores/order'
import { OrderStatusColor, OrderStatusLabelCustomer } from '@/constants/orderStatus'
import router from '@/router'

const orderStore = useOrderStore()
const loadingStore = useLoadingStore()

const tab = ref<(typeof tabs)[number]['key']>('all')

type Tab = {
  key: string
  label: string
  status?: OrderStatus[]
}

const tabs = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'pending', label: 'รอชำระเงิน', status: ['pending', 'waiting_verify'] as OrderStatus[] },
  { key: 'processing', label: 'กำลังดำเนินการ', status: ['confirmed', 'picking'] as OrderStatus[] },
  { key: 'shipped', label: 'กำลังจัดส่ง', status: ['shipped'] as OrderStatus[] },
  { key: 'done', label: 'สำเร็จ', status: ['done'] as OrderStatus[] },
  { key: 'cancelled', label: 'ยกเลิก', status: ['cancelled'] as OrderStatus[] },
]

onMounted(async () => {
  await fetchOrders()
})

watch(tab, async () => {
  orderStore.page = 1
  await fetchOrders()
})

const fetchOrders = async () => {
  const selectedTab = tabs.find((t) => t.key === tab.value)
  await orderStore.getOrdersByCustomer(orderStore.page, orderStore.limit, selectedTab?.status)
}

const nextPage = async () => {
  if (orderStore.page < orderStore.lastPage) {
    orderStore.page++
    await orderStore.getOrdersByCustomer()
  }
}

const prevPage = async () => {
  if (orderStore.page > 1) {
    orderStore.page--
    await orderStore.getOrdersByCustomer()
  }
}

const cancelOrder = async (orderId: number) => {
  try {
    await orderStore.updateStatus(orderId, { status: 'cancelled' })
    await fetchOrders()
  } catch (err) {
    console.error(err)
  }
}

const createUpdatePayload = (status: OrderStatus): UpdateOrder => ({
  status: status,
})

const payOrder = async (orderId: number) => {
  try {
    await fetchOrders()
    router.push({
      name: 'payment-confirmation',
      params: { orderId: orderId },
    })
  } catch (err) {
    console.error(err)
  }
}

const confirmReceived = async (orderId: number) => {
  try {
    await orderStore.updateStatus(orderId, createUpdatePayload('done'))
    await fetchOrders()
  } catch (err) {
    console.error(err)
  }
}

const getCountByTab = (t: Tab) => {
  if (t.key === 'all') {
    return Object.values(orderStore.counts || {}).reduce((sum, count) => sum + count, 0)
  }
  if (!t.status) return 0
  return t.status.reduce((sum, s) => {
    return sum + (orderStore.counts[s] || 0)
  }, 0)
}

const goToOrderDetail = (orderId: number) => {
  router.push({ name: 'order-detail', params: { orderId: orderId } })
}
</script>
<template>
  <LoadingComponent v-model="loadingStore.loading" />
  <div
    class="w-full min-h-screen flex flex-col items-center gap-2 md:gap-3 py-[10px] md:py-[30px] px-[10px] md:px-[20px]">

    <div class="w-full max-w-[750px] flex bg-gray-100 rounded-xl overflow-x-auto">
      <button v-for="t in tabs" :key="t.key" @click="tab = t.key"
        class="flex-1 min-w-[60px] py-1.5 sm:py-2 text-[10px] sm:text-xs md:text-sm font-semibold rounded-lg transition flex flex-col sm:flex-row items-center justify-center gap-0 sm:gap-1 px-1"
        :class="tab === t.key ? 'bg-white shadow text-black' : 'text-gray-500'">
        <span>{{ t.label }}</span>
        <span class="text-[9px] sm:text-[10px] md:text-xs font-bold text-red-500">
          ({{ getCountByTab(t) }})
        </span>
      </button>
    </div>

    <div v-if="!orderStore.orders || orderStore.orders.length === 0"
      class="w-full max-w-[750px] bg-white border rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-center">
      <span class="pi pi-box text-5xl mb-3 text-gray-700"></span>
      <div class="text-lg font-semibold text-gray-700 mb-1">ไม่มีรายการคำสั่งซื้อ</div>
      <div class="text-sm text-gray-500 mb-4">ยังไม่มีคำสั่งซื้อในหมวดนี้</div>
    </div>

    <template v-else>
      <div v-for="order in orderStore.orders" :key="order.order_id"
        class="bg-white p-3 sm:p-4 rounded-xl w-full max-w-[750px] shadow-sm border flex flex-col gap-2 sm:gap-3 cursor-pointer hover:shadow-md transition-shadow"
        @click="goToOrderDetail(order.order_id)">
        <!-- Order header -->
        <div class="flex flex-wrap justify-between items-start gap-1">
          <div class="flex flex-wrap gap-1 sm:gap-2 items-center">
            <div class="font-semibold text-xs sm:text-sm">ออเดอร์ #{{ order.order_id }}</div>
            <div class="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
              สาขา {{ order.branch.branch_name }}
            </div>
          </div>
          <span class="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold"
            :class="OrderStatusColor[order.order_status]">
            {{ OrderStatusLabelCustomer[order.order_status] }}
          </span>
        </div>

        <div class="border-t"></div>

        <!-- Order items -->
        <div class="flex flex-col gap-2">
          <div v-for="detail in order.details" :key="detail.order_detail_id" class="flex items-center gap-2">
            <img :src="detail.product_image"
              class="w-[40px] h-[40px] sm:w-[55px] sm:h-[55px] object-cover rounded-md border flex-shrink-0" />
            <div class="flex-1 flex flex-col gap-0.5 min-w-0">
              <div class="flex justify-between items-start gap-1">
                <div class="font-medium text-xs sm:text-sm line-clamp-2 flex-1 min-w-0">
                  {{ detail.product_title }}
                </div>
                <div class="text-red-500 font-semibold text-xs sm:text-sm whitespace-nowrap ml-1">
                  ฿{{ detail.price }}
                </div>
              </div>
              <div class="text-[10px] sm:text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md w-fit">
                จำนวน {{ detail.quantity }}
              </div>
            </div>
          </div>
        </div>

        <div class="border-t"></div>

        <!-- Footer: total + actions -->
        <div class="flex justify-between items-center gap-2">
          <div class="font-semibold text-xs sm:text-sm">รวม ฿{{ order.total_amount }}</div>

          <div class="flex flex-wrap gap-1 sm:gap-2 justify-end" @click.stop>
            <button class="px-2 sm:px-3 py-1 text-[10px] sm:text-xs border rounded-lg hover:bg-gray-100 transition"
              @click="goToOrderDetail(order.order_id)">
              ดูรายละเอียด
            </button>

            <template v-if="order.order_status === 'pending'">
              <button
                class="px-2 sm:px-3 py-1 text-[10px] sm:text-xs bg-gray-200 hover:bg-gray-300 border border-gray-400 text-gray-800 rounded-lg transition"
                @click="cancelOrder(order.order_id)">
                ยกเลิก
              </button>
              <button
                class="px-2 sm:px-3 py-1 text-[10px] sm:text-xs bg-[#637aad] hover:bg-[#4a68a8] text-white rounded-lg"
                @click="payOrder(order.order_id)">
                ชำระเงิน
              </button>
            </template>

            <template v-else-if="order.order_status === 'waiting_verify'">
              <span class="text-[10px] sm:text-xs text-gray-500 self-center">รอตรวจสอบการชำระ</span>
            </template>

            <template v-else-if="order.order_status === 'shipped'">
              <button
                class="px-2 sm:px-3 py-1 text-[10px] sm:text-xs bg-[#637aad] hover:bg-[#4a68a8] text-white rounded-lg"
                @click="confirmReceived(order.order_id)">
                ยืนยันรับสินค้า
              </button>
            </template>
          </div>
        </div>
      </div>
    </template>

    <!-- Pagination -->
    <div class="flex-1 w-full max-w-[750px]">
      <div class="flex justify-center md:justify-end items-center gap-2 md:gap-4 py-2 md:py-4 md:mr-3">
        <button
          class="bg-gray-100 px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          @click="prevPage()">
          <span class="pi pi-chevron-left text-xs sm:text-sm"></span>
          <span class="hidden sm:inline"> Prev</span>
        </button>

        <span class="text-xs sm:text-sm text-white bg-[#555] px-2 sm:px-3 py-1 rounded">
          {{ orderStore.page }} / {{ orderStore.lastPage }}
        </span>

        <button
          class="bg-gray-100 px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          @click="nextPage()">
          <span class="hidden sm:inline">Next </span>
          <span class="pi pi-chevron-right text-xs sm:text-sm"></span>
        </button>
      </div>
    </div>
  </div>
  <LoadingComponent v-model="loadingStore.loading" />
</template>
