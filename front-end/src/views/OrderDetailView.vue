<script setup lang="ts">
import { useAddressStore } from '@/stores/address';
import { useAuthStore } from '@/stores/auth';
import { useLoadingStore } from '@/stores/loading';
import { useOrderStore } from '@/stores/order';
import { usePaymentStore } from '@/stores/payment';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import LoadingComponent from '@/components/LoadingComponent.vue'
import { OrderStatusLabelCustomer, OrderStatusIcon } from '@/constants/orderStatus'
import { formatThaiDateTime } from '@/utils/formatDate'
import type { OrderStatus, UpdateOrder } from '@/types/Order';
import router from '@/router'

const authStore = useAuthStore()
const addressStore = useAddressStore()
const loadingStore = useLoadingStore()
const orderStore = useOrderStore()
const paymentStore = usePaymentStore()

const route = useRoute()
const orderId = Number(route.params.orderId as string)

onMounted(async () => {
    await authStore.getCurrentUser()
    await addressStore.getAddresses()
    orderStore.getOrderById(orderId)
    paymentStore.fetchPaymentQr(orderId)
})

const fetchOrders = async () => {
    await orderStore.getOrders(
        orderStore.page,
        orderStore.limit,
        selectedTab?.status
    )
}
const createUpdatePayload = (status: OrderStatus): UpdateOrder => ({
    status: status
})

const confirmReceived = async (orderId: number) => {
    try {
        await orderStore.updateStatus(orderId, createUpdatePayload('done'))
        fetchOrders()
    } catch (err) {
        console.error(err)
    }
}


const payOrder = async (orderId: number) => {
    try {
        fetchOrders()
        router.push({
            name: 'payment-confirmation',
            params: { orderId: orderId }
        })
    } catch (err) {
        console.error(err)
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

</script>

<template>
    <div class="max-w-6xl mx-auto p-4 md:p-6 flex flex-col lg:flex-row gap-3 ">


        <div class="flex-1 flex flex-col gap-3">


            <div v-if="orderStore.selectedOrder?.shipment" class="bg-white p-4 rounded-xl shadow-sm border">
                <div class="font-semibold mb-2">ข้อมูลการจัดส่ง</div>

                <div class="text-sm text-gray-700">
                    <span class="font-medium">ขนส่ง:</span>
                    {{ orderStore.selectedOrder.shipment.name }}
                </div>

                <div class="text-sm text-gray-500 mt-1">
                    <span class="font-medium">เลขพัสดุ:</span>
                    {{ orderStore.selectedOrder.tracking_number }}
                </div>
            </div>


            <div class="bg-white p-4 rounded-xl shadow-sm border">
                <div class="font-semibold mb-3">รายการสินค้า</div>

                <div class="flex flex-col gap-3" v-if="orderStore.selectedOrder">
                    <div v-for="detail in orderStore.selectedOrder.details" :key="detail.order_detail_id"
                        class="flex items-center gap-3">
                        <img :src="detail.product_image"
                            class="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] object-cover rounded-md border" />

                        <div class="flex-1 flex flex-col gap-1">
                            <div class="flex justify-between items-start gap-2">
                                <div class="font-medium text-sm sm:text-base line-clamp-2">
                                    {{ detail.product_title }}
                                </div>

                                <div class="text-red-500 font-semibold text-sm sm:text-base whitespace-nowrap">
                                    ฿{{ detail.price }}
                                </div>
                            </div>

                            <div class="flex justify-between items-center text-sm text-gray-600">
                                <div class="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-md">
                                    จำนวน {{ detail.quantity }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Card: Timeline -->
            <div class="bg-white p-4 rounded-xl shadow-sm border">
                <div class="font-semibold mb-3 ">ไทม์ไลน์การจัดส่ง</div>
                <div class="border-l-2 ">

                    <div class="flex items-center gap-4  pl-4 mb-3"
                        v-for="(history, index) in orderStore.selectedOrder?.orderHistory" :key="history.id">

                        <div v-if="orderStore.selectedOrder" :class="[
                            'w-10 h-10 flex items-center justify-center rounded-full',
                            index === orderStore.selectedOrder.orderHistory.length - 1
                                ? 'bg-green-100 text-green-600'
                                : 'bg-gray-100 text-gray-400'
                        ]">
                            <span :class="[OrderStatusIcon[history.status], 'text-lg']"></span>
                        </div>
                        <div>
                            <div class="text-sm font-medium"> {{ OrderStatusLabelCustomer[history.status] }}</div>
                            <div class="text-xs text-gray-500">{{ formatThaiDateTime(history.created_at) }}</div>
                        </div>


                    </div>
                </div>
            </div>

        </div>

        <!-- RIGHT SIDE -->
        <div class="w-full lg:w-[350px] flex flex-col gap-4">

            <!-- Card: Address -->
            <div class="bg-white p-4 rounded-xl shadow-sm border">
                <div class="font-semibold mb-2">ที่อยู่จัดส่ง</div>

                <div class="text-sm text-gray-600">
                    ชื่อผู้รับ: {{ orderStore.selectedOrder?.fullname }}<br />
                    เบอร์: {{ orderStore.selectedOrder?.phone }}<br />
                    ที่อยู่: {{ orderStore.selectedOrder?.address_detail }} {{ orderStore.selectedOrder?.sub_district }}

                    {{ orderStore.selectedOrder?.district }} {{ orderStore.selectedOrder?.province }} {{
                        orderStore.selectedOrder?.zipcode }}
                </div>
            </div>

            <!-- Card: Payment Summary -->
            <div class="bg-white p-4 rounded-xl shadow-sm border">
                <div class="font-semibold mb-3">สรุปการชำระเงิน</div>

                <div class="flex justify-between text-sm">
                    <span>รวมสินค้า</span>
                    <span>{{ orderStore.selectedOrder?.subtotal }}</span>
                </div>

                <div class="flex justify-between text-sm mt-2">
                    <span>ส่วนลด</span>
                    <span>{{ orderStore.selectedOrder?.discount_amount }}</span>
                </div>

                <div class="border-t my-3"></div>

                <div class="flex justify-between font-semibold">
                    <span>ยอดรวม</span>
                    <span class="text-red-500">{{ orderStore.selectedOrder?.total_amount }}</span>
                </div>
            </div>





            <div class="bg-white p-4 rounded-xl shadow-sm border flex flex-col gap-3">
                <template v-if="orderStore.selectedOrder?.order_status === 'pending'">
                    <button class="w-full py-2 text-[13px] sm:text-[14px] md:text-[15px]
             bg-[#637aad] hover:bg-[#4a68a8] text-white rounded-lg transition"
                        @click="payOrder(orderStore.selectedOrder.order_id)">
                        ชำระเงิน
                    </button>
                    <button class="w-full py-2 text-[13px] sm:text-[14px] md:text-[15px]
              rounded-lg  bg-gray-200 hover:bg-gray-300  border border-gray-400 
           text-gray-800 transition" @click="cancelOrder(orderStore.selectedOrder.order_id)">
                        ยกเลิก
                    </button>


                </template>

                <template v-else-if="orderStore.selectedOrder?.order_status === 'waiting_verify'">
                    <div class="text-[13px] sm:text-[14px] text-gray-500 text-center py-2">
                        รอตรวจสอบการชำระเงิน
                    </div>
                </template>

                <template v-else-if="orderStore.selectedOrder?.order_status === 'shipped'">
                    <button class="w-full py-2 text-[13px] sm:text-[14px] md:text-[15px]
             bg-[#637aad] hover:bg-[#4a68a8] text-white rounded-lg transition"
                        @click="confirmReceived(orderStore.selectedOrder.order_id)">
                        ยืนยันรับสินค้า
                    </button>
                </template>

                <button class="w-full py-2 text-[13px] sm:text-[14px] md:text-[15px] 
           border rounded-lg bg-white hover:bg-gray-100 transition" @click="$router.push('/orders')">
                    ไปหน้าคำสั่งซื้อ
                </button>
            </div>

        </div>

    </div>

    <LoadingComponent v-model="loadingStore.loading" />
</template>

<style></style>
