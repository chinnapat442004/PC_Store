import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Shipment } from '@/types/Shipment'
import shipmentService from '@/service/shipment'

export const useShipmentStore = defineStore('shipment', () => {
    const shipments = ref<Shipment[]>([])

    const initialShipment: Shipment = {
        name: '',
    }

    const editedShipment = ref<Shipment>(
        JSON.parse(JSON.stringify(initialShipment))
    )

    async function getShipments() {
        const res = await shipmentService.getShipments()
        shipments.value = res.data
    }

    async function createShipment() {

        await shipmentService.createShipment(editedShipment.value)
        await getShipments()
        resetForm()
    }

    async function updateShipment(id: number) {
        await shipmentService.updateShipment(id, editedShipment.value)
        await getShipments()
        resetForm()
    }

    async function deleteShipment(id: number) {
        await shipmentService.deleteShipment(id)
        await getShipments()
    }

    function resetForm() {
        editedShipment.value = JSON.parse(JSON.stringify(initialShipment))
    }

    function setEditShipment(shipment: Shipment) {
        editedShipment.value = JSON.parse(JSON.stringify(shipment))
    }

    return {
        shipments,
        editedShipment,
        getShipments,
        createShipment,
        updateShipment,
        deleteShipment,
        resetForm,
        setEditShipment,
    }
})