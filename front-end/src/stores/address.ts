import { defineStore } from 'pinia'
import { ref } from 'vue'
import addressService from '../service/address'

import { useLoadingStore } from './loading'
import type { Address } from '@/types/Address'

export const useAddressStore = defineStore('address', () => {
    const addresses = ref<Address[]>([])
    const defaultAddress = ref<Address | null>(null)


    const loadingStore = useLoadingStore()

    const initialForm: Address = {
        fullname: '',
        phone: '',
        address_detail: '',
        sub_district: '',
        district: '',
        province: '',
        zipcode: '',
        is_default: false,
    }

    const editedAddress = ref<Address>(
        structuredClone(initialForm)
    )

    async function getAddresses() {
        loadingStore.doLoad()
        const res = await addressService.getAddresses()
        addresses.value = res.data
        loadingStore.finishLoad()
    }

    async function getDefaultAddress() {
        try {
            const res = await addressService.getDefaultAddress()
            defaultAddress.value = res.data
        } catch {
            defaultAddress.value = null
        }
    }

    async function addAddress() {
        loadingStore.doLoad()
        await addressService.createAddress(editedAddress.value)
        await getAddresses()
        await getDefaultAddress()
        clearForm()
        loadingStore.finishLoad()
    }

    async function updateAddress(id: number, address: Address) {
        if (!editedAddress.value?.address_id) return

        loadingStore.doLoad()
        await addressService.updateAddress(id, address)
        await getAddresses()
        await getDefaultAddress()
        clearForm()

        loadingStore.finishLoad()
    }

    async function setDefault(address: Address) {
        loadingStore.doLoad()
        if (address.address_id)
            await addressService.setDefaultAddress(address.address_id)
        await getAddresses()
        await getDefaultAddress()
        loadingStore.finishLoad()
    }

    async function removeAddress(address: Address) {
        loadingStore.doLoad()
        await addressService.deleteAddress(address)
        await getAddresses()
        await getDefaultAddress()
        loadingStore.finishLoad()
    }

    function setForm(address: Address) {
        editedAddress.value = address

        editedAddress.value = {
            address_id: address.address_id,
            fullname: address.fullname,
            phone: address.phone,
            address_detail: address.address_detail,
            sub_district: address.sub_district,
            district: address.district,
            province: address.province,
            zipcode: address.zipcode,
            is_default: address.is_default,

        }
    }

    function clearForm() {
        editedAddress.value = JSON.parse(JSON.stringify(initialForm))
    }

    return {
        addresses,
        defaultAddress,
        editedAddress,
        initialForm,
        getAddresses,
        getDefaultAddress,
        addAddress,
        updateAddress,
        setDefault,
        removeAddress,
        setForm,
        clearForm,
    }
})