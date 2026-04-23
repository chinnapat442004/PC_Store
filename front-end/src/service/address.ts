
import type { Address } from '@/types/Address'
import http from './http'

function getAddresses() {
    return http.get('/address')
}

function getDefaultAddress() {
    return http.get('/address/default')
}

function createAddress(address: Address) {
    return http.post('/address', address)
}

function setDefaultAddress(id: number) {
    return http.post(`/address/set-default/${id}`)
}

function deleteAddress(address: Address) {
    return http.delete(`/address/${address.address_id}`)
}


function updateAddress(id: number, address: Address) {
    return http.patch(`/address/${id}`, address)
}

export default {
    getAddresses,
    getDefaultAddress,
    createAddress,
    setDefaultAddress,
    deleteAddress, updateAddress
}