import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Shipment } from '@/types/Shipment'
import shipmentService from '@/service/shipment'
import { useLoadingStore } from './loading'

export const useShipmentStore = defineStore('shipment', () => {
    const shipments = ref<Shipment[]>([])
    const loadingStore = useLoadingStore()
    const initialShipment: Shipment = {
        name: '',
    }

    const editedShipment = ref<Shipment>(
        JSON.parse(JSON.stringify(initialShipment))
    )

    async function getShipments(search?: string, onlyActive = false) {
        loadingStore.doLoad()
        const res = await shipmentService.getShipments(search, onlyActive)
        shipments.value = res.data
        loadingStore.finishLoad()
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


    async function toggleShipmentActive(shipment: Shipment) {
        try {
            const res = await shipmentService.toggleShipmentActive(shipment.shipment_id!)

            shipments.value = shipments.value.map((s) => {
                if (s.shipment_id === shipment.shipment_id) {
                    return {
                        ...s,
                        is_active: res.data.is_active,
                    }
                }

                return s
            })

            return res
        } catch (error) {
            console.error(error)
            throw error
        }
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
        toggleShipmentActive,
        resetForm,
        setEditShipment,
    }
})