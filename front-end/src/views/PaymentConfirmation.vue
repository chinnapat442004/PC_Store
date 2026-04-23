<script setup lang="ts">
import { useAddressStore } from '@/stores/address'
import { useAuthStore } from '@/stores/auth'

import { onMounted, ref } from 'vue'
import LoadingComponent from '@/components/LoadingComponent.vue'



import { useLoadingStore } from '@/stores/loading'
import { usePaymentStore } from '@/stores/payment'
import { useRoute } from 'vue-router'
import { useOrderStore } from '@/stores/order'
import router from '@/router'


const authStore = useAuthStore()
const addressStore = useAddressStore()
const loadingStore = useLoadingStore()
const paymentStore = usePaymentStore()
const orderStore = useOrderStore()
const route = useRoute()
const orderId = Number(route.params.orderId as string)



onMounted(async () => {
    await authStore.getCurrentUser()
    await addressStore.getAddresses()

    orderStore.getOrderById(orderId)
    paymentStore.fetchPaymentQr(orderId)

})



const slipFile = ref<File | null>(null)
const slipPreview = ref<string | null>(null)

const onFileChange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return

    slipFile.value = file
    slipPreview.value = URL.createObjectURL(file)
}

const submitSlip = async () => {

    if (!slipFile.value) return


    await orderStore.getOrderById(orderId)

    const paymentId = paymentStore.paymentAccount?.payment_id

    if (!paymentId) {
        alert('ไม่พบ payment')
        return
    }

    await paymentStore.uploadSlip(paymentId, slipFile.value)


    router.push({
        name: 'order-succes',
        params: { orderId: orderId }
    })
}
const copyPromptPay = () => {
    navigator.clipboard.writeText('0123456789')
}

const removeSlip = () => {
    slipFile.value = null
    slipPreview.value = null
}


</script>

<template>
    <div class="min-h-screen w-full flex justify-center p-6">
        <div class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-3">

            <div class="bg-white p-6 rounded-xl shadow-md">

                <h2 class="text-xl font-semibold text-gray-800 mb-5 text-center">
                    Payment Confirmation
                </h2>


                <div class="flex justify-center mb-5">
                    <img class="w-52 h-52 object-contain border rounded-xl p-3 shadow-sm"
                        :src="paymentStore.paymentAccount?.qr_image" />
                </div>


                <div class="text-center mb-5">
                    <p class="text-gray-400 text-sm">Amount to Pay</p>
                    <p class="text-3xl font-bold text-green-600 tracking-wide">
                        ฿{{ orderStore.selectedOrder?.total_amount }}
                    </p>
                </div>


                <div class="bg-gray-50 rounded-xl p-4 space-y-3 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-500">PromptPay</span>
                        <span class="font-medium text-gray-800">{{ paymentStore.paymentAccount?.promptpay_number
                            }}</span>
                    </div>

                    <div class="flex justify-between">
                        <span class="text-gray-500">Account Name</span>
                        <span class="font-medium text-gray-800">{{ paymentStore.paymentAccount?.account_name
                            }}</span>
                    </div>
                </div>


                <button class="mt-4 w-full bg-gray-900 text-white py-2.5 rounded-xl hover:bg-gray-700 transition"
                    @click="copyPromptPay">
                    คัดลอกเลขพร้อมเพย์
                </button>

                <div class="mt-6">
                    <p class="text-sm font-medium text-gray-700 mb-2">
                        Upload Payment Slip
                    </p>

                    <label v-if="!slipFile"
                        class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-gray-400 transition">
                        <span class="text-gray-500 text-sm">
                            คลิกเพื่ออัปโหลด หรือ ลากรูปมาใส่
                        </span>

                        <input type="file" accept="image/*" class="hidden" @change="onFileChange" />
                    </label>


                    <div v-if="slipPreview" class="mt-4 relative">

                        <button @click="removeSlip"
                            class="absolute top-2 right-2 bg-black/60 text-white w-7 h-7 flex items-center justify-center rounded-full hover:bg-black transition">
                            ✕
                        </button>


                        <img :src="slipPreview" class="w-full rounded-xl border" />

                    </div>


                </div>

            </div>


            <div class="bg-white p-6 rounded-xl shadow-sm border h-fit">

                <h2 class="text-lg font-semibold text-gray-700 mb-4">
                    Order Summary
                </h2>


                <div class="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-2">

                    <div v-for="detail in orderStore.selectedOrder?.details" :key="detail.order_detail_id"
                        class="border rounded-xl flex items-center gap-3 p-3 w-full hover:bg-gray-50 transition">
                        <img :src="detail.product_image" class="w-[70px] h-[70px] object-cover rounded-md" />

                        <div class="flex-1 flex flex-col gap-1">
                            <div class="flex justify-between">
                                <div class="font-medium text-sm line-clamp-2 text-gray-800">
                                    {{ detail.product_title }}
                                </div>
                                <div class="text-gray-700 font-medium text-sm">
                                    ฿{{ detail.price }}
                                </div>
                            </div>

                            <div class="text-xs text-gray-400">
                                Qty: {{ detail.quantity }}
                            </div>
                        </div>
                    </div>

                </div>


                <div class="mt-4 text-sm space-y-2 text-gray-600">

                    <div class="flex justify-between">
                        <span>Subtotal</span>

                        <span>฿ {{ orderStore.selectedOrder?.subtotal }}</span>
                    </div>

                    <div class="flex justify-between">
                        <span>Discount</span>
                        <span>฿ {{ orderStore.selectedOrder?.discount_amount }}</span>
                    </div>

                    <hr class="my-2" />

                    <div class="flex justify-between font-medium text-gray-800">
                        <span>Total</span>
                        <span>฿ {{ orderStore.selectedOrder?.total_amount }}</span>
                    </div>

                </div>


                <div class="mt-6 bg-yellow-50 border border-yellow-200 p-3 rounded-xl text-sm text-yellow-700">
                    กรุณาชำระเงินและอัปโหลดสลิปเพื่อยืนยันการชำระเงิน
                </div>

                <button :disabled="!slipFile" @click="submitSlip"
                    class="mt-4 w-full py-2.5 rounded-xl text-white font-medium transition" :class="slipFile
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-gray-300 cursor-not-allowed'">
                    Submit Payment
                </button>
            </div>

        </div>
    </div>

    <LoadingComponent v-model="loadingStore.loading" />
</template>