import type { Shipment } from '@/types/Shipment'
import http from './http'

function getShipments(search?: string, onlyActive?: boolean) {
  return http.get(`/shipments?search=${search || ''}&onlyActive=${onlyActive || false}`)
}

function createShipment(data: Shipment) {
  return http.post('/shipments', data)
}

function updateShipment(id: number, data: Shipment) {
  return http.put(`/shipments/${id}`, data)
}

function toggleShipmentActive(id: number) {
  return http.patch(`/shipments/${id}/toggle-active`)
}

export default {
  getShipments,
  createShipment,
  updateShipment,
  toggleShipmentActive,
}
