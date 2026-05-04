<script setup lang="ts">
import { useDashboardStore } from '@/stores/dashboard'
import { onMounted, computed } from 'vue'

import { useLoadingStore } from '@/stores/loading'
import LoadingComponent from '@/components/LoadingComponent.vue'

const dashboardStore = useDashboardStore()
const loadingStore = useLoadingStore()

onMounted(async () => {
      dashboardStore.getManagerDashboard()
})

const categories = computed(() =>
      dashboardStore.managerDashboard?.sales7days.map(item => {
            const date = new Date(item.date)
            return date.toLocaleDateString('th-TH', {
                  day: '2-digit',
                  month: 'short'
            })
      }) || []
)

const series = computed(() => [
      {
            name: '',
            data: dashboardStore.managerDashboard?.sales7days.map(item => Number(item.revenue)) || []
      }
])

const chartOptions = computed(() => ({
      chart: {
            id: 'sales-chart',
            toolbar: { show: false },
            zoom: { enabled: false }
      },
      xaxis: {
            categories: categories.value,
            labels: {
                  style: {
                        colors: '#6b7280',
                        fontSize: '12px'
                  }
            }
      },
      yaxis: {
            labels: {
                  formatter: (val: number) => `${val.toLocaleString()} ฿`
            }
      },
      stroke: {
            curve: 'smooth',
            width: 3
      },
      dataLabels: {
            enabled: false
      },
      tooltip: {
            y: {
                  formatter: (val: number) => `${val.toLocaleString()} บาท`
            }
      },
      grid: {
            borderColor: '#e5e7eb'
      },
      fill: {
            type: 'gradient',
            gradient: {
                  shadeIntensity: 1,
                  opacityFrom: 0.4,
                  opacityTo: 0.05
            }
      }
}))

const pastelColors = [
      '#6EE7B7',
      '#93C5FD',
      '#F9A8D4',
      '#FDE68A',
      '#C4B5FD',
      '#F87171'
]

const categoryPercent = computed(() => {
      const list = dashboardStore.managerDashboard?.categorySales || []
      const total = list.reduce((sum, item) => sum + Number(item.revenue), 0)

      return list.map((item, index) => ({
            ...item,
            percent: total ? (item.revenue / total) * 100 : 0,
            color: pastelColors[index % pastelColors.length]
      }))
})



const lowStock = [
      { id: 1, name: 'โค้ก 1.5L', stock: 3 },
      { id: 2, name: 'มาม่า', stock: 5 },
      { id: 3, name: 'น้ำปลา', stock: 2 },
      { id: 4, name: 'น้ำตาล', stock: 4 }
]
</script>

<template>
      <div class="mb-6 space-y-6">

            <h1 class="text-2xl md:text-3xl font-bold text-white">
                  Manager Dashboard
            </h1>


            <div class="flex flex-wrap gap-4">

                  <div class="bg-white rounded-2xl p-4 shadow flex-1 min-w-[220px]">
                        <p class="text-sm text-gray-500">ยอดขายวันนี้</p>
                        <h2 class="text-xl md:text-2xl font-bold text-gray-900 mt-2">
                              {{ dashboardStore.managerDashboard?.kpi.todayRevenue.toLocaleString() }} ฿
                        </h2>
                  </div>

                  <div class="bg-white rounded-2xl p-4 shadow flex-1 min-w-[220px]">
                        <p class="text-sm text-gray-500">ยอดขายเดือนนี้</p>
                        <h2 class="text-xl md:text-2xl font-bold text-gray-900 mt-2">
                              {{ dashboardStore.managerDashboard?.kpi.monthlyRevenue.toLocaleString() }} ฿
                        </h2>
                  </div>
                  <div class="bg-white rounded-2xl p-4 shadow flex-1 min-w-[220px]">
                        <p class="text-sm text-gray-500">สถานะออเดอร์</p>
                        <h2 class="text-xl md:text-2xl font-bold text-gray-900 mt-2">
                              {{ dashboardStore.managerDashboard?.kpi.orders.total }}
                        </h2>
                        <p class="text-green-500 mt-2">
                              สำเร็จ: {{ dashboardStore.managerDashboard?.kpi.orders.success }}
                        </p>
                        <p class="text-red-500">
                              ยกเลิก: {{ dashboardStore.managerDashboard?.kpi.orders.cancelled }}
                        </p>
                  </div>

                  <div class="bg-white rounded-2xl p-4 shadow flex-1 min-w-[220px]">
                        <p class="text-sm text-gray-500">จำนวนพนักงานในสาขา</p>
                        <h2 class="text-xl md:text-2xl font-bold text-gray-900 mt-2">
                              {{ dashboardStore.managerDashboard?.kpi.countStaff }} คน </h2>
                  </div>

            </div>


            <div class="w-full bg-white rounded-2xl shadow p-5">
                  <div class="flex justify-between items-center mb-4">

                        <h2 class="text-lg font-semibold text-gray-800">
                              งานที่ยังค้างอยู่
                        </h2>

                        <div class="flex items-baseline gap-2">
                              <span class="text-sm text-gray-500">จำนวนทั้งหมด</span>
                              <span class="text-xl font-bold text-gray-800">
                                    {{ dashboardStore.managerDashboard?.orderStatusSummary?.totalPending || 0 }}
                              </span>
                        </div>

                  </div>
                  <div class="grid gap-4 text-center
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-5">

                        <div class="bg-amber-50 rounded-xl p-4 border border-amber-100">
                              <p class="text-sm text-gray-500">รอชำระเงิน</p>
                              <p class="text-2xl font-bold text-amber-600">
                                    {{ dashboardStore.managerDashboard?.orderStatusSummary?.status.pending || 0 }}
                              </p>
                        </div>

                        <div class="bg-sky-50 rounded-xl p-4 border border-sky-100">
                              <p class="text-sm text-gray-500">รอตรวจสลิป</p>
                              <p class="text-2xl font-bold text-sky-600">
                                    {{ dashboardStore.managerDashboard?.orderStatusSummary?.status.waiting_verify || 0
                                    }}
                              </p>
                        </div>

                        <div class="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                              <p class="text-sm text-gray-500">รอดำเนินการ</p>
                              <p class="text-2xl font-bold text-indigo-600">
                                    {{ dashboardStore.managerDashboard?.orderStatusSummary?.status.confirmed || 0 }}
                              </p>
                        </div>

                        <div class="bg-orange-50 rounded-xl p-4 border border-orange-100">
                              <p class="text-sm text-gray-500">กำลังแพ็ค</p>
                              <p class="text-2xl font-bold text-orange-600">
                                    {{ dashboardStore.managerDashboard?.orderStatusSummary?.status.picking || 0 }}
                              </p>
                        </div>

                        <div class="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                              <p class="text-sm text-gray-500">ส่งแล้ว (รอปิดงาน)</p>
                              <p class="text-2xl font-bold text-emerald-600">
                                    {{ dashboardStore.managerDashboard?.orderStatusSummary?.status.shipped || 0 }}
                              </p>
                        </div>

                  </div>
            </div>
            <div class="flex flex-wrap gap-4 items-stretch">

                  <div class="w-full lg:flex-1 bg-white rounded-2xl shadow p-5 h-[420px] flex flex-col">

                        <h2 class="text-lg font-semibold text-gray-800 mb-4">
                              แนวโน้มยอดขาย 7 วัน
                        </h2>

                        <div class="flex-1">
                              <apexchart type="area" height="100%" :options="chartOptions" :series="series" />
                        </div>

                  </div>


                  <div class="w-full lg:flex-1 bg-white rounded-2xl shadow p-5 h-[420px] flex flex-col overflow-hidden">

                        <h2 class="text-lg font-semibold text-gray-800 mb-4">
                              สินค้าใกล้หมด
                        </h2>

                        <div class="flex-1 overflow-y-auto pr-2">

                              <div v-for="item in dashboardStore.managerDashboard?.lowStock" :key="item.product_id"
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
                                                : 'bg-orange-100 text-orange-600'">
                                                {{ item.status === 'out of stock' ? 'ของหมด' : 'เหลือน้อย' }}
                                          </span>
                                    </div>
                              </div>

                        </div>

                  </div>

            </div>

            <div class="flex flex-wrap gap-4">
                  <div class="w-full lg:flex-[1] bg-white rounded-2xl shadow p-5">
                        <h2 class="text-lg font-semibold text-gray-800">
                              สินค้าขายดี Top 5
                        </h2>

                        <table class="w-full text-left text-black">
                              <thead class="text-sm">
                                    <tr>
                                          <th class=" py-2">สินค้า</th>
                                          <th class=" py-2">จำนวน</th>
                                    </tr>
                              </thead>

                              <tbody class="divide-y text-gray-700">
                                    <tr v-for="product in dashboardStore.managerDashboard?.topProducts"
                                          :key="product.productId">
                                          <td class=" py-2">{{ product.name }}</td>
                                          <td class="px-4 py-2">{{ product.sold }}</td>
                                    </tr>
                              </tbody>
                        </table>
                  </div>
                  <div class="w-full lg:flex-[1] bg-white rounded-2xl shadow p-5">
                        <h2 class="text-lg font-semibold text-gray-800 mb-4">
                              ยอดขายตามหมวด
                        </h2>

                        <div v-for="item in categoryPercent" :key="item.category" class="w-full mb-3">
                              <div class="flex justify-between text-sm mb-1">
                                    <span>{{ item.category }}</span>
                                    <span>{{ item.percent.toFixed(0) }}%</span>
                              </div>

                              <div class="w-full bg-gray-200 rounded-full h-2">
                                    <div class="h-2 rounded-full"
                                          :style="{ width: item.percent + '%', backgroundColor: item.color }" />
                              </div>
                        </div>
                  </div>

            </div>



      </div>

      <LoadingComponent v-model="loadingStore.loading" />
</template>