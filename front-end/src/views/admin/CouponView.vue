<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ConfirmComponent from '@/components/dialogs/ConfirmComponent.vue'
import { useLoadingStore } from '@/stores/loading'
import LoadingComponent from '@/components/LoadingComponent.vue'
import { useCouponStore } from '@/stores/coupon'
import { formatThaiDate } from '@/utils/formatDate'
import { formatDiscount } from '@/utils/formatDiscount'
import type { Coupon } from '@/types/Coupon'
import ToggleSwitch from '@/components/ToggleSwitch.vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

const loadingStore = useLoadingStore()
const couponStore = useCouponStore()

const showDialog = ref(false)
const search = ref('')
const showConfirm = ref(false)
const mode = ref<'create' | 'edit'>('create')

const couponSchema = yup.object({
  code: yup.string().required('กรุณากรอกรหัสคูปอง'),
  discount_type: yup.string().required('กรุณาเลือกประเภทส่วนลด'),
  description: yup.string().required('กรุณากรอกรายละเอียด'),
  discount_value: yup
    .number()
    .typeError('กรุณากรอกมูลค่าส่วนลด')
    .required('กรุณากรอกมูลค่าส่วนลด')
    .min(1, 'มูลค่าส่วนลดต้องมากกว่า 0'),
  min_order: yup
    .number()
    .typeError('กรุณากรอกยอดขั้นต่ำ')
    .required('กรุณากรอกยอดขั้นต่ำ')
    .min(0, 'ยอดขั้นต่ำต้องไม่ติดลบ'),
  max_discount: yup.number().nullable().notRequired(),
  usage_limit: yup.number().nullable().notRequired(),
  start_date: yup.string().required('กรุณาเลือกวันที่เริ่มต้น'),
  end_date: yup.string().required('กรุณาเลือกวันที่สิ้นสุด'),
})

const { errors, defineField, validate, resetForm } = useForm({
  validationSchema: couponSchema,
  validateOnMount: false,
})

const [code] = defineField('code')
const [discount_type] = defineField('discount_type')
const [description] = defineField('description')
const [discount_value] = defineField('discount_value')
const [min_order] = defineField('min_order')
const [max_discount] = defineField('max_discount')
const [usage_limit] = defineField('usage_limit')
const [start_date] = defineField('start_date')
const [end_date] = defineField('end_date')

const toDateInputValue = (value: string | Date | null | undefined) => {
  if (!value) return ''

  if (typeof value === 'string') {
    return value.slice(0, 10)
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

onMounted(async () => {
  await couponStore.getCoupons(1, 10, '')
})

const searchCoupon = async () => {
  couponStore.search = search.value
  couponStore.page = 1
  await couponStore.getCoupons()
}

const clearSearch = async () => {
  search.value = ''
  couponStore.search = ''
  couponStore.page = 1
  await couponStore.getCoupons()
}

const openEdit = (coupon: Coupon) => {
  mode.value = 'edit'
  couponStore.setEditCoupon(coupon)
  resetForm({
    values: {
      code: coupon.code,
      discount_type: coupon.discount_type,
      description: coupon.description,
      discount_value: coupon.discount_value,
      min_order: coupon.min_order,
      max_discount: coupon.max_discount ?? null,
      usage_limit: coupon.usage_limit ?? null,
      start_date: toDateInputValue(coupon.start_date),
      end_date: toDateInputValue(coupon.end_date),
    },
  })
  showDialog.value = true
}

const closeDialog = () => {
  showDialog.value = false
}

const openCreateDialog = () => {
  mode.value = 'create'
  resetForm({
    values: {
      code: '',
      discount_type: 'percent',
      description: '',
      discount_value: undefined,
      min_order: undefined,
      max_discount: null,
      usage_limit: null,
      start_date: '',
      end_date: '',
    },
  })
  showDialog.value = true
}

const preSave = async () => {
  const { valid } = await validate()
  if (!valid) return
  showConfirm.value = true
}

const nextPage = async () => {
  if (couponStore.page < couponStore.lastPage) {
    couponStore.page++
    await couponStore.getCoupons()
  }
}

const prevPage = async () => {
  if (couponStore.page > 1) {
    couponStore.page--
    await couponStore.getCoupons()
  }
}

const saveCategory = async () => {
  couponStore.editedCoupon.code = code.value
  couponStore.editedCoupon.discount_type = discount_type.value
  couponStore.editedCoupon.description = description.value
  couponStore.editedCoupon.discount_value = discount_value.value
  couponStore.editedCoupon.min_order = min_order.value
  couponStore.editedCoupon.max_discount = max_discount.value
  couponStore.editedCoupon.usage_limit = usage_limit.value
  couponStore.editedCoupon.start_date = start_date.value
  couponStore.editedCoupon.end_date = end_date.value

  if (mode.value === 'create') {
    await couponStore.cerateCoupon()
  } else {
    await couponStore.editCoupon()
  }

  await couponStore.getCoupons()
  showDialog.value = false
  showConfirm.value = false
}

function formatCurrency(value?: number) {
  if (!value && value !== 0) return '-'
  return `${Number(value).toLocaleString()}`
}

function getStatusLabel(coupon: Coupon) {
  if (!coupon.is_active) return 'ปิดใช้งาน'
  const now = new Date()
  if (new Date(coupon.start_date) > now) return 'ยังไม่เริ่ม'
  if (new Date(coupon.end_date) < now) return 'หมดอายุ'
  if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) return 'ใช้ครบแล้ว'
  return 'ใช้งานได้'
}

function getStatusClass(coupon: Coupon) {
  if (!coupon.is_active) return 'bg-gray-200 text-gray-500'
  const now = new Date()
  if (new Date(coupon.start_date) > now) return 'bg-yellow-100 text-yellow-600'
  if (new Date(coupon.end_date) < now) return 'bg-red-100 text-red-600'
  if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) return 'bg-purple-100 text-purple-600'
  return 'bg-green-100 text-green-600'
}
</script>

<template>
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold text-white">Coupon Management</h1>

    <div class="flex items-center gap-3">
      <input type="text" placeholder="ค้นหาคูปอง..." v-model="search" class="border px-3 py-2 rounded w-64" />
      <button class="bg-white/10 hover:bg-white/20 text-white p-2 rounded-md" @click="searchCoupon">
        <span class="pi pi-search"></span>
      </button>
      <button class="bg-white/10 hover:bg-white/20 text-white p-2 rounded-md" @click="clearSearch">
        <span class="pi pi-times"></span>
      </button>
      <button class="flex items-center gap-2 bg-[#637aad] hover:bg-[#4a68a8] text-white px-4 py-2 rounded-md"
        @click="openCreateDialog">
        <span class="pi pi-plus"></span>
        เพิ่มคูปอง
      </button>
    </div>
  </div>

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
          <td colspan="9" class="text-center py-6 text-gray-500">ไม่พบข้อมูล</td>
        </tr>
        <tr v-else v-for="coupon in couponStore.coupons" :key="coupon.coupon_id">
          <td class="pl-6 pr-3 py-2">
            <div class="font-medium">{{ coupon.code }}</div>
            <div class="text-sm">{{ coupon.description }}</div>
          </td>
          <td class="px-3 py-2 text-sm">{{ formatDiscount(coupon.discount_type, coupon.discount_value) }}</td>
          <td class="px-3 py-2 text-sm">{{ formatCurrency(coupon.min_order) }}</td>
          <td class="px-3 py-2 text-sm">{{ coupon.max_discount ? formatCurrency(coupon.max_discount) : '-' }}</td>
          <td v-if="coupon.usage_limit" class="px-3 py-2 text-sm">{{ coupon.used_count }} / {{ coupon.usage_limit }}
          </td>
          <td class="px-3 py-2 text-sm" v-else>ไม่จำกัด</td>
          <td class="px-3 py-2 text-sm">{{ formatThaiDate(coupon.start_date) }} - {{ formatThaiDate(coupon.end_date) }}
          </td>
          <td class="px-3 py-2">
            <span class="px-2 py-1 rounded-full text-xs font-semibold" :class="getStatusClass(coupon)">
              {{ getStatusLabel(coupon) }}
            </span>
          </td>
          <td class="px-3 py-3">
            <ToggleSwitch :modelValue="coupon.is_active"
              @update:modelValue="couponStore.toggleCouponActive(coupon.coupon_id).then(() => couponStore.getCoupons())" />
          </td>
          <td class="pl-3 pr-6 py-3 flex justify-center space-x-3">
            <button>
              <span class="pi pi-pencil" @click="openEdit(coupon)"></span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="flex justify-end items-center gap-4 py-4 border-t mr-3">
      <button class="px-3 py-1 border rounded hover:bg-gray-100" @click="prevPage" :disabled="couponStore.page <= 1">
        <span class="pi pi-chevron-left text-sm"></span> ก่อนหน้า
      </button>

      <span class="text-sm text-gray-600"> {{ couponStore.page }} จาก {{ couponStore.lastPage }} </span>

      <button class="px-3 py-1 border rounded hover:bg-gray-100" @click="nextPage"
        :disabled="couponStore.page >= couponStore.lastPage">
        ถัดไป <span class="pi pi-chevron-right text-sm"></span>
      </button>
    </div>
  </div>

  <div v-if="showDialog" class="overlay">
    <div class="dialog w-[500px] max-h-[90vh] flex flex-col overflow-y-auto">
      <h2 class="text-lg font-semibold mb-3">
        {{ mode === 'create' ? 'เพิ่มคูปอง' : 'แก้ไขคูปอง' }}
      </h2>

      <div class="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label class="text-sm font-medium after:content-['*'] after:text-red-500 after:ml-1">รหัสคูปอง</label>
          <input v-model="code" type="text" placeholder="กรอกรหัสคูปอง"
            class="border w-full px-3 py-2 rounded bg-gray-50" :class="{ 'border-red-500': errors.code }" />
          <p v-if="errors.code" class="text-red-500 text-xs mt-1">{{ errors.code }}</p>
        </div>

        <div>
          <label class="text-sm font-medium after:content-['*'] after:text-red-500 after:ml-1">ประเภทส่วนลด</label>
          <select v-model="discount_type" class="border w-full px-3 py-2 rounded bg-gray-50"
            :class="{ 'border-red-500': errors.discount_type }">
            <option value="percent">เปอร์เซ็นต์ (%)</option>
            <option value="fixed">จำนวนเงิน (฿)</option>
          </select>
          <p v-if="errors.discount_type" class="text-red-500 text-xs mt-1">{{ errors.discount_type }}</p>
        </div>
      </div>

      <div class="mb-3">
        <label class="text-sm font-medium after:content-['*'] after:text-red-500 after:ml-1">รายละเอียด</label>
        <input v-model="description" type="text" placeholder="กรอกรายละเอียด"
          class="border w-full px-3 py-2 rounded bg-gray-50" :class="{ 'border-red-500': errors.description }" />
        <p v-if="errors.description" class="text-red-500 text-xs mt-1">{{ errors.description }}</p>
      </div>

      <div class="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label class="text-sm font-medium after:content-['*'] after:text-red-500 after:ml-1">มูลค่าส่วนลด</label>
          <input v-model.number="discount_value" type="number" class="border w-full px-3 py-2 rounded bg-gray-50"
            :class="{ 'border-red-500': errors.discount_value }"
            :placeholder="discount_type === 'percent' ? 'เช่น 10 (%)' : 'เช่น 100 บาท'" />
          <p v-if="errors.discount_value" class="text-red-500 text-xs mt-1">{{ errors.discount_value }}</p>
        </div>

        <div>
          <label
            class="text-sm font-medium after:content-['*'] after:text-red-500 after:ml-1">ยอดสั่งซื้อขั้นต่ำ</label>
          <input v-model.number="min_order" type="number" placeholder="กรอกยอดขั้นต่ำ"
            class="border w-full px-3 py-2 rounded bg-gray-50" :class="{ 'border-red-500': errors.min_order }" />
          <p v-if="errors.min_order" class="text-red-500 text-xs mt-1">{{ errors.min_order }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label class="text-sm font-medium">ส่วนลดสูงสุด</label>
          <input v-model.number="max_discount" type="number" placeholder="กรอกส่วนลดสูงสุด"
            class="border w-full px-3 py-2 rounded bg-gray-50" />
        </div>

        <div>
          <label class="text-sm font-medium">จำนวนครั้งที่ใช้ได้</label>
          <input v-model.number="usage_limit" type="number" placeholder="เว้นว่าง = ไม่จำกัด"
            class="border w-full px-3 py-2 rounded bg-gray-50" />
        </div>
      </div>

      <div class="mb-3 grid grid-cols-2 gap-2">
        <div>
          <label class="text-sm font-medium after:content-['*'] after:text-red-500 after:ml-1">วันที่เริ่มต้น</label>
          <input v-model="start_date" type="date" class="border w-full px-3 py-2 rounded bg-gray-50"
            :class="{ 'border-red-500': errors.start_date }" />
          <p v-if="errors.start_date" class="text-red-500 text-xs mt-1">{{ errors.start_date }}</p>
        </div>

        <div>
          <label class="text-sm font-medium after:content-['*'] after:text-red-500 after:ml-1">วันที่สิ้นสุด</label>
          <input v-model="end_date" type="date" class="border w-full px-3 py-2 rounded bg-gray-50"
            :class="{ 'border-red-500': errors.end_date }" />
          <p v-if="errors.end_date" class="text-red-500 text-xs mt-1">{{ errors.end_date }}</p>
        </div>
      </div>

      <div class="flex justify-center gap-4">
        <button class="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
          @click="closeDialog">ยกเลิก</button>
        <button class="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition"
          @click="preSave">บันทึก</button>
      </div>
    </div>
  </div>

  <ConfirmComponent :show="showConfirm" type="save" message="คุณต้องการบันทึกข้อมูลนี้ใช่หรือไม่"
    @confirm="saveCategory()" @cancel="showConfirm = false" />

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
