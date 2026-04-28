<script setup lang="ts">

import { onMounted, ref } from 'vue'
import ConfirmComponent from '@/components/dialogs/ConfirmComponent.vue'
import type { Category } from '@/types/Category'
import { useLoadingStore } from '@/stores/loading'
import LoadingComponent from '@/components/LoadingComponent.vue'
import { useCouponStore } from '@/stores/coupon'
import { formatThaiDate, } from '@/utils/formatDate'
import { formatDiscount } from '@/utils/formatDiscount'
import type { Coupon } from '@/types/Coupon'

const loadingStore = useLoadingStore()
const couponStore = useCouponStore()


const showDialog = ref(false)
const search = ref('')
const showConfirm = ref(false)
const deleteConfirm = ref(false)

onMounted(async () => {
    await couponStore.getCoupons()
})

const mode = ref<'create' | 'edit'>('create')

const openEdit = (coupon: Coupon) => {
    mode.value = 'edit'
    couponStore.setEditCoupon(coupon)
    showDialog.value = true
}

const saveCategory = async () => {
    if (mode.value === 'create') {
        await couponStore.cerateCoupon()
    } else {
        await couponStore.editCoupon()
    }

    await couponStore.getCoupons()
    // await categoryStore.getCategories()
    showDialog.value = false
    showConfirm.value = false
    // categoryStore.resetForm()
}

const closeDialog = () => {
    // categoryStore.resetForm()
    showDialog.value = false
}

const openCreateDialog = () => {
    mode.value = 'create'
    showDialog.value = true
}


const clearSearch = async () => {
    search.value = ''
    // await categoryStore.getCategories()
}

function formatCurrency(value?: number) {
    if (!value && value !== 0) return '-';
    return `${Number(value).toLocaleString()}`;
}

function getStatusLabel(coupon: Coupon) {
    if (!coupon.is_active) return 'ปิดใช้งาน';

    const now = new Date();

    if (new Date(coupon.start_date) > now) return 'ยังไม่เริ่ม';
    if (new Date(coupon.end_date) < now) return 'หมดอายุ';

    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
        return 'ใช้ครบแล้ว';
    }

    return 'ใช้งานได้';
}

function getStatusClass(coupon: Coupon) {
    if (!coupon.is_active) return 'bg-gray-200 text-gray-500';

    const now = new Date();

    if (new Date(coupon.start_date) > now) return 'bg-yellow-100 text-yellow-600';
    if (new Date(coupon.end_date) < now) return 'bg-red-100 text-red-600';

    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
        return 'bg-purple-100 text-purple-600';
    }

    return 'bg-green-100 text-green-600';
}


async function toggleActive(id: number) {
    await couponStore.toggleCouponStatus(id)
    await couponStore.getCoupons()
}
</script>

<template>



    <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-white">Coupon Management</h1>

        <div class="flex items-center gap-3">
            <input type="text" placeholder="Search Coupon ..." v-model="search" class="border px-3 py-2 rounded w-64" />

            <button class="bg-white/10 hover:bg-white/20 text-white p-2 rounded-md">
                <span class="pi pi-search"></span>
            </button>

            <button class="bg-white/10 hover:bg-white/20 text-white p-2 rounded-md" @click="clearSearch">
                <span class="pi pi-times"></span>
            </button>

            <button class="flex items-center gap-2 bg-[#637aad] hover:bg-[#4a68a8] text-white px-4 py-2 rounded-md"
                @click="openCreateDialog">
                <span class="pi pi-plus"></span>
                Create
            </button>
        </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg overflow-hidden">
        <table class="w-full text-left text-black">
            <thead class="bg-[#383838] text-gray-300 text-sm">
                <tr>
                    <th class="pl-6 pr-3 py-3">รหัสโค้ด</th>

                    <th class="px-3 py-3">ส่วนลด</th>
                    <th class="px-3 py-3">ขั้นต่ำ</th>
                    <th class="px-3 py-3">ส่วนลดสูงสุด</th>
                    <th class="px-3 py-3">การใช้งาน</th>

                    <th class="px-3 py-3">ระยะเวลา</th>
                    <th class="px-3 py-3">สถานะ</th>
                    <th class="px-3 py-3">เปิดใช้งาน</th>

                    <th class="pl-3 pr-6 py-3 text-center">จัดการ</th>
                </tr>
            </thead>

            <tbody class="divide-y">

                <tr v-if="couponStore.coupons.length === 0">
                    <td colspan="9" class="text-center py-6 text-gray-500">
                        ไม่มีข้อมูล
                    </td>
                </tr>

                <tr v-else v-for="coupon in couponStore.coupons" :key="coupon.coupon_id">

                    <!-- code -->
                    <td class="pl-6 pr-3  py-2 ">
                        <div class="font-medium">{{ coupon.code }}</div>
                        <div class="text-sm">{{ coupon.description }}</div>
                    </td>



                    <!-- discount -->
                    <td class="px-3 py-2  text-sm">
                        {{ formatDiscount(coupon.discount_type, coupon.discount_value) }}
                    </td>

                    <!-- min -->
                    <td class="px-3 py-2 text-sm ">
                        {{ formatCurrency(coupon.min_order) }}
                    </td>

                    <!-- max -->
                    <td class="px-3 py-2 text-sm ">
                        {{ coupon.max_discount ? formatCurrency(coupon.max_discount) : '-' }}
                    </td>

                    <td v-if="coupon.usage_limit" class="px-3 py-2 text-sm ">
                        {{ coupon.used_count }} / {{ coupon.usage_limit }}
                    </td>
                    <td class="px-3 py-2 text-sm " v-else>ไม่จำกัด</td>

                    <!-- start -->
                    <td class="px-3 py-2 text-sm">
                        {{ formatThaiDate(coupon.start_date) }} - {{ formatThaiDate(coupon.end_date) }}
                    </td>
                    <!-- status -->
                    <td class="px-3 py-2">
                        <span class="px-2 py-1 rounded-full text-xs font-semibold" :class="getStatusClass(coupon)">
                            {{ getStatusLabel(coupon) }}
                        </span>
                    </td>
                    <td class="px-3 py-3">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="sr-only peer" :checked="coupon.is_active" @change="toggleActive(coupon.coupon_id)

                                ">
                            <div
                                class="w-10 h-5 bg-gray-300 rounded-full peer peer-focus:ring-2 peer-focus:ring-[#637aad]/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#637aad]">
                            </div>
                            <span class="ml-2 text-sm font-medium"
                                :class="coupon.is_active ? 'text-gray-900' : 'text-gray-400'">
                                {{ coupon.is_active ? 'เปิด' : 'ปิด' }}
                            </span>
                        </label>
                    </td>


                    <!-- actions -->
                    <td class="pl-3 pr-6 py-3 flex justify-center space-x-3">
                        <button>
                            <span class=" pi pi-pencil " @click="openEdit(coupon)"></span>
                        </button>


                    </td>

                </tr>
            </tbody>
        </table>
    </div>


    <!-- Dialog -->
    <div v-if="showDialog" class="overlay">
        <div class="dialog w-[500px] max-h-[90vh] flex flex-col overflow-y-auto">

            <h2 class="text-lg font-semibold">
                {{ mode === 'create' ? 'สร้างคูปอง' : 'แก้ไขคูปอง' }}
            </h2>

            <!-- รหัสคูปอง + ประเภทส่วนลด -->
            <div class="grid grid-cols-2 gap-3 mb-3">
                <div>
                    <label class="block mb-1">รหัสคูปอง</label>
                    <input v-model="couponStore.editedCoupon.code" type="text"
                        class="border w-full px-3 py-2 rounded bg-gray-50" />
                </div>

                <div>
                    <label class="block mb-1">ประเภทส่วนลด</label>
                    <select v-model="couponStore.editedCoupon.discount_type"
                        class="border w-full px-3 py-2 rounded bg-gray-50">
                        <option value="percent">เปอร์เซ็นต์ (%)</option>
                        <option value="fixed">จำนวนเงิน (฿)</option>
                    </select>
                </div>
            </div>

            <!-- รายละเอียด (เต็มแถว) -->
            <div class="mb-3">
                <label class="block mb-1">รายละเอียด</label>
                <input v-model="couponStore.editedCoupon.description" type="text"
                    class="border w-full px-3 py-2 rounded bg-gray-50" />
            </div>

            <!-- มูลค่าส่วนลด + ขั้นต่ำ -->
            <div class="grid grid-cols-2 gap-3 mb-3">
                <div>
                    <label class="block mb-1">มูลค่าส่วนลด</label>
                    <input v-model.number="couponStore.editedCoupon.discount_value" type="number"
                        class="border w-full px-3 py-2 rounded bg-gray-50"
                        :placeholder="couponStore.editedCoupon.discount_type === 'percent' ? 'เช่น 10 (%)' : 'เช่น 100 บาท'" />
                </div>

                <div>
                    <label class="block mb-1">ยอดสั่งซื้อขั้นต่ำ</label>
                    <input v-model.number="couponStore.editedCoupon.min_order" type="number"
                        class="border w-full px-3 py-2 rounded bg-gray-50" />
                </div>
            </div>

            <!-- ส่วนลดสูงสุด + จำนวนการใช้งาน -->
            <div class="grid grid-cols-2 gap-3 mb-3">
                <div>
                    <label class="block mb-1">ส่วนลดสูงสุด</label>
                    <input v-model.number="couponStore.editedCoupon.max_discount" type="number"
                        class="border w-full px-3 py-2 rounded bg-gray-50" />
                </div>

                <div>
                    <label class="block mb-1">จำนวนครั้งที่ใช้ได้</label>
                    <input v-model.number="couponStore.editedCoupon.usage_limit" type="number"
                        class="border w-full px-3 py-2 rounded bg-gray-50" placeholder="เว้นว่าง = ไม่จำกัด" />
                </div>
            </div>

            <!-- วันที่ -->
            <div class="mb-3 grid grid-cols-2 gap-2">
                <div>
                    <label class="block mb-1">วันที่เริ่มต้น</label>
                    <input v-model="couponStore.editedCoupon.start_date" type="date"
                        class="border w-full px-3 py-2 rounded bg-gray-50" />
                </div>

                <div>
                    <label class="block mb-1">วันที่สิ้นสุด</label>
                    <input v-model="couponStore.editedCoupon.end_date" type="date"
                        class="border w-full px-3 py-2 rounded bg-gray-50" />
                </div>
            </div>

            <!-- เปิดใช้งาน -->
            <div class="mb-4 flex items-center gap-2">
                <input type="checkbox" v-model="couponStore.editedCoupon.is_active" />
                <label>เปิดใช้งาน</label>
            </div>

            <!-- ปุ่ม -->
            <div class="flex justify-center gap-4">
                <button class="bg-red-500 text-white px-4 py-1 rounded" @click="closeDialog">
                    Close
                </button>

                <button class="bg-green-500 text-white px-4 py-1 rounded" @click="showConfirm = true">
                    Save
                </button>
            </div>


        </div>
    </div>
    <ConfirmComponent :show="showConfirm" type="save" message="บันทึกข้อมูลนี้หรือไม่" @confirm="saveCategory()"
        @cancel="showConfirm = false" />

    <!-- <ConfirmComponent :show="deleteConfirm" type="delete" message="ต้องการลบข้อมูลนี้หรือไม่"
        @confirm="removeItem(categoryStore.editedCategory)" @cancel="closeDialogDelete" /> -->

    <LoadingComponent v-model="loadingStore.loading" />
</template>

<style scoped>
.overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.dialog {
    background: white;
    padding: 20px;
    border-radius: 10px;
    width: 500px;
}
</style>