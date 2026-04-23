
import { defineStore } from 'pinia'
import { ref } from 'vue'
import paymentService from '@/service/payment'
import { useLoadingStore } from './loading'
import type { PaymentAccount, PaymentTransaction } from '@/types/Payment'

export const usePaymentStore = defineStore('payment', () => {
    const paymentAccount = ref<PaymentAccount>()
    const paymentTransaction = ref<PaymentTransaction>()
    const loadingStore = useLoadingStore()


    const fetchPaymentQr = async (orderId: number) => {
        try {
            loadingStore.doLoad()
            const res = await paymentService.getPaymentQr(orderId)
            paymentAccount.value = res.data
        } catch (err) {
            console.error(err)
        } finally {
            loadingStore.finishLoad()
        }
    }

    const fetchPaymentTransaction = async (orderId: number) => {
        try {
            loadingStore.doLoad()
            const res = await paymentService.getPaymentByOrder(orderId)
            paymentTransaction.value = res.data
        } catch (err) {
            console.error(err)
        } finally {
            loadingStore.finishLoad()
        }
    }

    const uploadSlip = async (orderId: number, file: File) => {
        try {
            loadingStore.doLoad()

            await paymentService.uploadSlip(orderId, file)

            await fetchPaymentQr(orderId)

        } catch (err) {
            console.error(err)
        } finally {
            loadingStore.finishLoad()
        }
    }
    return {
        paymentAccount,
        paymentTransaction,
        fetchPaymentQr, fetchPaymentTransaction,
        uploadSlip
    }
})