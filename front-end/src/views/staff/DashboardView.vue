<script setup lang="ts">
import { useDashboardStore } from '@/stores/dashboard'
import { onMounted } from 'vue'

import { useLoadingStore } from '@/stores/loading'
import LoadingComponent from '@/components/LoadingComponent.vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/order'

const dashboardStore = useDashboardStore()
const loadingStore = useLoadingStore()
const orderStore = useOrderStore()
const router = useRouter()

onMounted(async () => {
      dashboardStore.getStaffDashboard()
})


const goToOrders = (tabKey: string = 'all') => {
      orderStore.activeTab = tabKey
      router.push('/staff/orders')
}

</script>

<template>
      <div class="mb-6 space-y-6">

            <h1 class="text-2xl md:text-3xl font-bold text-white">
                  Staff Dashboard
            </h1>

            <div class="flex flex-wrap gap-4">

                  <div class="bg-white rounded-2xl p-4 shadow flex-1 min-w-[200px]">
                        <p class="text-sm text-gray-500">ออเดอร์ทั้งหมด</p>
                        <h2 class="text-2xl font-bold text-gray-900 mt-2">
                              {{ dashboardStore.staffDashboard?.orders.total || 0 }}
                        </h2>

                        <button @click="goToOrders()" class="mt-3 w-full flex items-center justify-center gap-2
         text-gray-600 py-2 rounded-lg text-sm
         transition-all duration-200 ease-out
         hover:text-gray-900 hover:scale-[1.02] active:scale-[0.98]">
                              <span class="leading-none">ดูรายการ</span>
                              <i class="pi pi-angle-right text-sm leading-none relative top-[1px]"></i>
                        </button>
                  </div>

                  <div class="bg-white rounded-2xl p-4 shadow flex-1 min-w-[200px]">
                        <p class="text-sm text-gray-500">สำเร็จแล้ว</p>
                        <h2 class="text-2xl font-bold text-green-600 mt-2">
                              {{ dashboardStore.staffDashboard?.orders.success || 0 }}
                        </h2>
                  </div>

                  <div class="bg-white rounded-2xl p-4 shadow flex-1 min-w-[200px]">
                        <p class="text-sm text-gray-500">ยกเลิก</p>
                        <h2 class="text-2xl font-bold text-red-500 mt-2">
                              {{ dashboardStore.staffDashboard?.orders.cancelled || 0 }}
                        </h2>
                  </div>

            </div>

            <div class="w-full bg-white rounded-2xl shadow p-5">

                  <div class="flex justify-between items-center mb-4">
                        <h2 class="text-lg font-semibold text-gray-800">
                              งานที่ยังค้างอยู่
                        </h2>

                        <div class="flex items-baseline gap-2">
                              <span class="text-sm text-gray-500">รวม</span>
                              <span class="text-xl font-bold text-gray-800">
                                    {{ dashboardStore.staffDashboard?.orderStatusSummary?.totalPending || 0 }}
                              </span>
                        </div>
                  </div>

                  <div class="grid gap-4 text-center
        grid-cols-2
        md:grid-cols-3
        lg:grid-cols-5">


                        <div class="bg-amber-50 rounded-xl p-4 border border-amber-100">
                              <p class="text-sm text-gray-500">รอชำระเงิน</p>

                              <p class="text-2xl font-bold text-amber-600">
                                    {{ dashboardStore.staffDashboard?.orderStatusSummary?.status.pending || 0 }}
                              </p>

                              <button @click="goToOrders('pending')" class="mt-1 mx-auto flex items-center justify-center gap-1
         text-amber-600 py-1.5 text-sm
         transition-all duration-200 ease-out
         hover:text-amber-800 hover:scale-[1.03] active:scale-[0.98]">
                                    <span class="leading-none">ดูรายการ</span>
                                    <i class="pi pi-angle-right text-sm leading-none relative top-[1px]"></i>
                              </button>
                        </div>

                        <div class="bg-sky-50 rounded-xl p-4 border border-sky-100">
                              <p class="text-sm text-gray-500">รอตรวจสลิป</p>
                              <p class="text-2xl font-bold text-sky-600">
                                    {{ dashboardStore.staffDashboard?.orderStatusSummary?.status.waiting_verify || 0
                                    }}
                              </p>

                              <button @click="goToOrders('waiting_verify')" class="mt-1 mx-auto flex items-center justify-center gap-1
         text-sky-500 py-1.5 text-sm
         transition-all duration-200 ease-out
         hover:text-sky-600 hover:scale-[1.03] active:scale-[0.98]">
                                    <span class="leading-none">ตรวจสอบ</span>
                                    <i class="pi pi-angle-right text-sm leading-none relative top-[1px]"></i>
                              </button>


                        </div>

                        <div class="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                              <p class="text-sm text-gray-500">รอดำเนินการ</p>
                              <p class="text-2xl font-bold text-indigo-600">
                                    {{ dashboardStore.staffDashboard?.orderStatusSummary?.status.confirmed || 0 }}
                              </p>



                              <button @click="goToOrders('computed')" class="mt-1 mx-auto flex items-center justify-center gap-1
         text-indigo-500 py-1.5 text-sm
         transition-all duration-200 ease-out
         hover:text-indigo-600 hover:scale-[1.03] active:scale-[0.98]">
                                    <span class="leading-none">เริ่มแพ็ค</span>
                                    <i class="pi pi-angle-right text-sm leading-none relative top-[1px]"></i>
                              </button>
                        </div>


                        <div class="bg-orange-50 rounded-xl p-4 border border-orange-100">
                              <p class="text-sm text-gray-500">กำลังแพ็ค</p>
                              <p class="text-2xl font-bold text-orange-600">
                                    {{ dashboardStore.staffDashboard?.orderStatusSummary?.status.picking || 0 }}
                              </p>

                              <button @click="goToOrders('picking')" class="mt-1 mx-auto flex items-center justify-center gap-1
         text-orange-500 py-1.5 text-sm
         transition-all duration-200 ease-out
         hover:text-orange-600 hover:scale-[1.03] active:scale-[0.98]">
                                    <span class="leading-none">กรอกเลขพัสดุ</span>
                                    <i class="pi pi-angle-right text-sm leading-none relative top-[1px]"></i>
                              </button>


                        </div>


                        <div class="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                              <p class="text-sm text-gray-500">ส่งแล้ว</p>
                              <p class="text-2xl font-bold text-emerald-600">
                                    {{ dashboardStore.staffDashboard?.orderStatusSummary?.status.shipped || 0 }}
                              </p>


                              <button @click="goToOrders('shipped')" class="mt-1 mx-auto flex items-center justify-center gap-1
         text-emerald-500 py-1.5 text-sm
         transition-all duration-200 ease-out
         hover:text-emerald-600 hover:scale-[1.03] active:scale-[0.98]">
                                    <span class="leading-none"> ปิดงาน</span>
                                    <i class="pi pi-angle-right text-sm leading-none relative top-[1px]"></i>
                              </button>


                        </div>

                  </div>
            </div>


            <div class="w-full bg-white rounded-2xl shadow p-5 h-[420px] flex flex-col">

                  <h2 class="text-lg font-semibold text-gray-800 mb-4">
                        สินค้าใกล้หมด
                  </h2>

                  <div class="flex-1 overflow-y-auto pr-2">

                        <div v-for="item in dashboardStore.staffDashboard?.lowStock" :key="item.product_id"
                              class="flex justify-between items-center py-3 border-b">
                              <span class="text-gray-700 font-medium">
                                    {{ item.product_title }}
                              </span>

                              <div class="flex items-center gap-3">
                                    <span class="text-sm text-gray-500">
                                          เหลือ {{ item.quantity }} ชิ้น
                                    </span>

                                    <span class="px-2 py-1 text-xs rounded-full font-semibold" :class="item.status === 'out of stock'
                                          ? 'bg-red-100 text-red-600'
                                          : 'bg-orange-100 text-orange-600'
                                          ">
                                          {{ item.status === 'out of stock' ? 'ของหมด' : 'เหลือน้อย' }}
                                    </span>


                              </div>
                        </div>

                  </div>
            </div>

      </div>

      <LoadingComponent v-model="loadingStore.loading" />
</template>