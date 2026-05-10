import type { CreateOrder, OrderStatus, UpdateOrder, UpdateTracking } from '@/types/Order'
import http from './http'

function getOrders(page: number, limit: number, status?: OrderStatus | OrderStatus[]) {
  return http.get('/orders', {
    params: {
      page,
      limit,
      ...(status && { status }),
    },
  })
}

function getOrdersByCustomer(page: number, limit: number, status?: OrderStatus | OrderStatus[]) {
  return http.get('/orders/customer', {
    params: {
      page,
      limit,
      ...(status && { status }),
    },
  })
}

function getOrder(id: number) {
  return http.get(`/orders/${id}`)
}

function getOrderByCustomer(id: number) {
  return http.get(`/orders/${id}/customer`)
}

function createOrder(order: CreateOrder) {
  console.log(order)

  return http.post('/orders', order)
}

function updateOrder(id: number, status: UpdateOrder) {
  return http.patch(`/orders/${id}/status`, status)
}

function updateTracking(id: number, taracking: UpdateTracking) {
  return http.patch(`/orders/${id}/tracking`, taracking)
}

export default {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  updateTracking,
  getOrdersByCustomer,
  getOrderByCustomer,
}
