
import type { Shipment } from '@/types/Shipment'
import http from './http'

function getShipments() {
    return http.get('/shipments')
}

function createShipment(data: Shipment) {
    return http.post('/shipments', data)
}

function updateShipment(id: number, data: Shipment) {
    return http.put(`/shipments/${id}`, data)
}

function deleteShipment(id: number) {
    return http.delete(`/shipments/${id}`)
}

export default {
    getShipments,
    createShipment,
    updateShipment,
    deleteShipment,
}