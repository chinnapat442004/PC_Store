<script setup lang="ts">
import { useAddressStore } from '@/stores/address'
import { useAuthStore } from '@/stores/auth'

import { onMounted, } from 'vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import { OrderStatusColor, OrderStatusLabelCustomer } from '@/constants/orderStatus'


import { useLoadingStore } from '@/stores/loading'

import { useOrderStore } from '@/stores/order'
import { usePaymentStore } from '@/stores/payment'

import { useRoute } from 'vue-router'
import router from '@/router'

const authStore = useAuthStore()
const addressStore = useAddressStore()
const loadingStore = useLoadingStore()
const orderStore = useOrderStore()
const route = useRoute()
const paymentStore = usePaymentStore()
const orderId = Number(route.params.orderId as string)



onMounted(async () => {
  await authStore.getCurrentUser()
  await addressStore.getAddresses()
  orderStore.getOrderById(orderId)
  paymentStore.fetchPaymentQr(orderId)

})
















</script>

<template>
  <div class=" w-full flex  p-6 flex-col items-center">

    <div class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-3">


      <div class="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center space-y-3">

        <span class="pi pi-check-circle text-green-500 text-6xl"></span>

        <div class="text-xl font-semibold text-gray-800">
          ขอบคุณสำหรับคำสั่งซื้อ!
        </div>

        <div class="text-gray-600 text-sm">
          เราได้รับคำสั่งซื้อของคุณเรียบร้อยแล้ว
        </div>


        <div class="w-full border rounded-lg p-3 mt-3 text-sm text-left">
          <div class="flex justify-between mb-1">
            <span class="text-gray-500">เลขคำสั่งซื้อ</span>
            <span class="font-medium">#{{ orderStore.selectedOrder?.order_id }}</span>
          </div>

          <div class="flex justify-between">
            <span class="text-gray-500">สถานะ</span>
            <span class="px-3 py-1 rounded-full text-xs font-semibold"
              :class="OrderStatusColor[orderStore.selectedOrder?.order_status]" v-if="orderStore.selectedOrder">
              {{ OrderStatusLabelCustomer[orderStore.selectedOrder?.order_status] }}
            </span>

          </div>
        </div>

      </div>


      <div class="bg-white p-6 rounded-lg shadow-md h-fit">


        <div class="max-w-[750px] w-full min-w-[300px] flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-2">
          <div v-for="detail in orderStore.selectedOrder?.details" :key="detail.order_detail_id"
            class="bg-white border rounded-[10px] flex items-center gap-3 p-3 w-full">

            <img :src="detail.product_image"
              class="w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] object-cover rounded-md" />

            <div class="flex-1 flex flex-col justify-between gap-1">
              <div class="flex justify-between items-start gap-2">
                <div class="font-medium text-sm sm:text-base line-clamp-2">
                  {{ detail.product_title }}
                </div>
                <div class="text-red-500 font-medium text-sm sm:text-base whitespace-nowrap">
                  ฿{{ detail.price }}
                </div>
              </div>

              <div class="flex justify-between items-center text-sm text-gray-600">
                <div class="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-md">
                  <span class="text-xs">จำนวน</span>
                  <span class="font-medium">{{ detail.quantity }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>


        <h2 class="text-xl font-bold mt-6 mb-4">สรุปคำสั่งซื้อ</h2>

        <div class="flex justify-between mb-2 text-sm">
          <div>ราคาสินค้า</div>
          <div>฿ {{ orderStore.selectedOrder?.subtotal }}</div>
        </div>

        <div class="flex justify-between mb-2 text-sm">
          <div>ส่วนลด</div>
          <div>฿ 0.00</div>
        </div>

        <hr class="my-3" />

        <div class="flex justify-between font-bold text-lg mb-4">
          <div>ยอดรวม</div>
          <div>฿ {{ orderStore.selectedOrder?.total_amount }}</div>
        </div>


        <button class="bg-[#82d182] w-full mt-[20px] h-[35px] hover:bg-[#69c769] rounded-[10px] text-white font-medium"
          @click="router.push({ name: 'order' })">
          ดูคำสั่งซื้อทั้งหมด
        </button>
        <button @click="router.push({ name: 'home' })"
          class="bg-gray-100 w-full mt-[10px] h-[35px] hover:bg-gray-200 rounded-[10px] text-gray-700 font-medium">
          กลับหน้าหลัก
        </button>

      </div>

    </div>
  </div>


  <LoadingComponent v-model="loadingStore.loading" />
</template>