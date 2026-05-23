import type { Shipment } from '@/types/Shipment'
import http from './http'

function getShipments(page = 1, limit = 10, search = '', onlyActive = false) {
  return http.get(`/shipments?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&onlyActive=${onlyActive}`)
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
