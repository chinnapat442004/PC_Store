<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth'
import { useOrderStore } from '@/stores/order'
import type { OrderStatus } from '@/types/Order'
import { computed, onMounted, ref } from 'vue'

import { formatThaiDate, } from '@/utils/formatDate'
import { useLoadingStore } from '@/stores/loading'
import LoadingComponent from '@/components/LoadingComponent.vue'
import { useUserStore } from '@/stores/user'




const userStore = useUserStore()
const loadingStore = useLoadingStore()
const authStore = useAuthStore()
const orderStore = useOrderStore()

onMounted(async () => {

    await orderStore.getOrdersByCustomer(orderStore.page,
        orderStore.limit)
    if (authStore.user)

        await userStore.getUser(authStore.user?.user_id)




})

const userInitials = computed(() => {
    if (!authStore.user?.name) return '?'

    const words = authStore.user.name.trim().split(' ')

    if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase()
    }

    return (words[0][0] + words[1][0]).toUpperCase()
})

const tabs = [
    { key: 'pending', label: 'รอชำระเงิน', status: ['pending', 'waiting_verify'] as OrderStatus[] },
    { key: 'processing', label: 'กำลังดำเนินการ', status: ['confirmed', 'picking'] as OrderStatus[] },
    { key: 'shipped', label: 'กำลังจัดส่ง', status: ['shipped'] as OrderStatus[] },
    { key: 'done', label: 'สำเร็จ', status: ['done'] as OrderStatus[] },
]

const getCountByTab = (t: typeof tabs[number]) => {
    return t.status.reduce((sum, s) => {
        return sum + (orderStore.counts?.[s] || 0)
    }, 0)
}

const isEdit = ref(false)



const startEdit = () => {

    isEdit.value = true
}

const cancelEdit = () => {
    isEdit.value = false
}

const saveProfile = async () => {
    try {
        if (userStore.editedProfile)
            await userStore.updateMyProfile(userStore.editedProfile)
        isEdit.value = false
        authStore.getCurrentUser()
    } catch (err) {
        console.error(err)
    }
}

const isChangePassword = ref(false)



const startChangePassword = () => {
    isChangePassword.value = true

}

const cancelChangePassword = () => {
    userStore.clearUpdatePassword()
    isChangePassword.value = false
}

const savePasswordUI = async () => {
    if (userStore.updatePasswordForm.new_password !== userStore.updatePasswordForm.confirm_password) {
        alert('รหัสผ่านไม่ตรงกัน')
        return
    }

    try {
        await userStore.changeMyPassword(userStore.updatePasswordForm)
        alert('เปลี่ยนรหัสผ่านสำเร็จ')
        isChangePassword.value = false
    } catch (err: any) {
        const msg = err?.response?.data?.message || 'รหัสผ่านปัจจุบันไม่ถูกต้อง'
        alert(msg)
    }
}
</script>

<template>
    <div class="flex justify-center w-full py-[30px] px-[10px] md:px-[20px]">
        <div class="max-w-[900px] w-full flex flex-col gap-2 md:gap-4">

            <div
                class="p-4 bg-white rounded-[12px] shadow-sm flex sm:flex-row sm:items-center sm:justify-between gap-3">

                <div class="flex items-center gap-4">

                    <div
                        class="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] rounded-full overflow-hidden flex items-center justify-center bg-[#637aad] text-white text-xl font-semibold">
                        {{ userInitials }}
                    </div>

                    <div class="flex flex-col">
                        <div class="font-semibold text-lg leading-tight">
                            {{ authStore.user?.name || 'Guest' }}
                        </div>

                        <div v-if="authStore.user" class="text-sm text-gray-500 sm:hidden">
                            สร้างบัญชีเมื่อ
                            <span class="font-medium text-gray-700">
                                {{ formatThaiDate(authStore.user?.createdAt) }}
                            </span>
                        </div>
                    </div>
                </div>

                <div v-if="authStore.user" class="hidden sm:block text-sm text-gray-500 text-right">
                    สร้างบัญชีเมื่อ
                    <span class="font-medium text-gray-700">
                        {{ formatThaiDate(authStore.user?.createdAt) }}
                    </span>
                </div>

            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                <div v-for="item in tabs" :key="item.key"
                    class="p-4 bg-white rounded-[12px] shadow-sm flex flex-col items-center justify-center hover:bg-gray-50 cursor-pointer transition">

                    <div class="text-sm text-gray-600">
                        {{ item.label }}
                    </div>

                    <div class="text-2xl font-bold text-[#637aad]">
                        {{ getCountByTab(item) }}
                    </div>
                </div>
            </div>

            <div class="p-4 bg-white rounded-[12px] shadow-sm">

                <div v-if="!isEdit" class="flex flex-col gap-3">

                    <div class="flex justify-between items-center">
                        <h2 class="font-semibold text-lg">ข้อมูลโปรไฟล์</h2>

                        <button @click="startEdit"
                            class="text-sm px-3 py-1 bg-[#637aad] text-white rounded hover:bg-[#4a68a8] transition">
                            แก้ไข
                        </button>
                    </div>

                    <div class="text-sm text-gray-600 space-y-1">
                        <div><strong>ชื่อ:</strong> {{ authStore.user?.name }}</div>
                        <div><strong>Email:</strong> {{ authStore.user?.email }}</div>
                    </div>
                </div>

                <div v-else-if="userStore.editedProfile" class="flex flex-col gap-3">

                    <h2 class="font-semibold text-lg">แก้ไขโปรไฟล์</h2>

                    <input v-model="userStore.editedProfile.name" type="text" placeholder="ชื่อ"
                        class="border rounded px-3 py-2 text-sm" />

                    <input v-model="userStore.editedProfile.email" type="email" placeholder="Email" disabled
                        class="border rounded px-3 py-2 text-sm bg-gray-100 cursor-not-allowed" />




                    <div class="flex gap-2 justify-end">
                        <button @click="cancelEdit" class="px-3 py-1 text-sm border rounded">
                            ยกเลิก
                        </button>

                        <button @click="saveProfile"
                            class="px-3 py-1 text-sm bg-[#637aad] text-white rounded hover:bg-[#4a68a8]">
                            บันทึก
                        </button>
                    </div>

                </div>
            </div>

            <div class="p-4 bg-white rounded-[12px] shadow-sm">

                <div v-if="!isChangePassword" class="flex justify-between items-center">
                    <h2 class="font-semibold text-lg">รหัสผ่าน</h2>

                    <button @click="startChangePassword"
                        class="text-sm px-3 py-1  bg-[#637aad] text-white rounded hover:bg-[#4a68a8] transition">
                        เปลี่ยนรหัสผ่าน
                    </button>
                </div>

                <div v-if="!isChangePassword" class="text-sm text-gray-500 mt-2">
                    คุณสามารถเปลี่ยนรหัสผ่านได้ที่นี่
                </div>

                <div v-else class="flex flex-col gap-3 mt-3">

                    <h2 class="font-semibold text-lg">เปลี่ยนรหัสผ่าน</h2>

                    <input v-model="userStore.updatePasswordForm.current_password" type="password"
                        placeholder="รหัสผ่านปัจจุบัน" class="border rounded px-3 py-2 text-sm" />

                    <input v-model="userStore.updatePasswordForm.new_password" type="password"
                        placeholder="รหัสผ่านใหม่" class="border rounded px-3 py-2 text-sm" />

                    <input v-model="userStore.updatePasswordForm.confirm_password" type="password"
                        placeholder="ยืนยันรหัสผ่านใหม่" class="border rounded px-3 py-2 text-sm" />

                    <div class="flex gap-2 justify-end">
                        <button @click="cancelChangePassword" class="px-3 py-1 text-sm border rounded">
                            ยกเลิก
                        </button>

                        <button @click="savePasswordUI"
                            class="px-3 py-1 text-sm  bg-[#637aad] text-white rounded hover:bg-[#4a68a8]">
                            บันทึก
                        </button>
                    </div>

                </div>

            </div>

        </div>
    </div>
    <LoadingComponent v-model="loadingStore.loading" />
</template>