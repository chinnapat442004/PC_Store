import type { CreateOrder, OrderStatus, UpdateOrder, UpdateTracking } from "@/types/Order";
import http from "./http";

function getOrders(page: number, limit: number, status?: OrderStatus) {


    return http.get('/orders', {
        params: {
            page,
            limit,
            ...(status && { status })
        }
    })
}

function getOrder(id: number) {
    return http.get(`/orders/${id}`)
}

function createOrder(order: CreateOrder) {

    return http.post('/orders', order)
}


function updateOrder(id: number, status: UpdateOrder) {
    return http.patch(`/orders/${id}/status`, status)
}


function updateTracking(id: number, taracking: UpdateTracking) {
    console.log("ทดสอบ", taracking)

    return http.patch(`/orders/${id}/tracking`, taracking)
}



export default { createOrder, getOrders, getOrder, updateOrder, updateTracking }