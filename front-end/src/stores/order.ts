import type { CreateOrder, Order, OrderStatus, UpdateOrder, UpdateTracking } from '@/types/Order'
import { defineStore } from 'pinia'
import orderService from '@/service/order'
import { ref } from 'vue'
import { useLoadingStore } from './loading'

export const useOrderStore = defineStore('order', () => {
    const loadingStore = useLoadingStore()

    const orders = ref<Order[]>([])
    const initialCreateOrder: CreateOrder = {
        payment_method: 'promptpay',
        is_buy_now: false
    }

    const initialtrackingForm: UpdateTracking = {
        tracking_number: '',
        shipment_id: 0
    }

    const activeTab = ref<string>('all')

    const counts = ref<Record<OrderStatus, number>>({} as Record<OrderStatus, number>)
    const selectedOrder = ref<Order | null>(null)

    const orderForm = ref<CreateOrder>(structuredClone(initialCreateOrder))

    const trackingForm = ref<UpdateTracking>(structuredClone(initialtrackingForm))

    const page = ref(1)
    const limit = ref(10)
    const lastPage = ref(1)
    const total = ref(0)
    const status = ref<OrderStatus | OrderStatus[]>()


    const handleOrderResponse = (res: any) => {
        orders.value = res.data.data
        counts.value = res.data.counts || {}
        total.value = res.data.total
        lastPage.value = res.data.lastPage
    }

    async function getOrders(p = page.value, l = limit.value, s: OrderStatus | OrderStatus[] | undefined = status.value) {
        loadingStore.doLoad()
        try {
            const res = s ? await orderService.getOrders(p, l, s) : await orderService.getOrders(p, l)
            handleOrderResponse(res)
        } finally {
            loadingStore.finishLoad()
        }
    }

    async function getOrdersByCustomer(p = page.value, l = limit.value, s: OrderStatus | OrderStatus[] | undefined = status.value) {
        loadingStore.doLoad()
        try {
            const res = s ? await orderService.getOrdersByCustomer(p, l, s) : await orderService.getOrdersByCustomer(p, l)
            handleOrderResponse(res)
        } finally {
            loadingStore.finishLoad()
        }
    }

    async function getOrderByCustomer(orderId: number) {
        loadingStore.doLoad()
        try {
            const res = await orderService.getOrderByCustomer(orderId)
            selectedOrder.value = res.data
        } finally {
            loadingStore.finishLoad()
        }
    }

    async function getOrderById(orderId: number) {
        loadingStore.doLoad()
        try {
            const res = await orderService.getOrder(orderId)
            selectedOrder.value = res.data
        } finally {
            loadingStore.finishLoad()
        }
    }

    function setOrder(data: Partial<CreateOrder>) {
        orderForm.value = { ...orderForm.value, ...data }
    }

    function clearOrder() {
        orderForm.value = { ...initialCreateOrder }
    }

    function clearTrackingForm() {
        trackingForm.value = { ...initialtrackingForm }
    }

    async function createOrder() {
        loadingStore.doLoad()

        try {
            const { data } = await orderService.createOrder(orderForm.value)
            clearOrder()
            return data
        } catch (err) {
            console.error(err)
            throw err
        } finally {
            loadingStore.finishLoad()
        }
    }

    async function updateStatus(orderId: number, updateOrder: UpdateOrder) {
        loadingStore.doLoad()
        try {
            await orderService.updateOrder(orderId, updateOrder)

            const index = orders.value.findIndex(o => o.order_id === orderId)
            if (index !== -1) {
                orders.value[index].order_status = updateOrder.status
            }
        } finally {
            loadingStore.finishLoad()
        }
    }

    async function updateTracking(orderId: number) {
        loadingStore.doLoad()

        try {
            await orderService.updateTracking(orderId, trackingForm.value)
        } catch (err) {
            console.error(err)
            alert('อัปเดต Tracking ไม่สำเร็จ')
        } finally {
            loadingStore.finishLoad()
        }
    }

    return {
        setOrder,
        createOrder,
        getOrders, getOrderById, updateStatus, updateTracking, clearTrackingForm, getOrdersByCustomer, getOrderByCustomer,
        orderForm, orders, page, limit, status, lastPage, selectedOrder, counts, total, trackingForm, activeTab,
    }
})