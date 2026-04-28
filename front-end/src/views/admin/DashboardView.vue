<script setup lang="ts">
import { useAdminDashboardStore } from '@/stores/dashboard'
import { onMounted, computed } from 'vue'

import { useLoadingStore } from '@/stores/loading'
import LoadingComponent from '@/components/LoadingComponent.vue'

const dashboardStore = useAdminDashboardStore()
const loadingStore = useLoadingStore()

onMounted(async () => {
      dashboardStore.getAdminDashboard()
})

const categories = computed(() =>
      dashboardStore.adminDashboard?.sales7days.map(item => {
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
            data: dashboardStore.adminDashboard?.sales7days.map(item => Number(item.revenue)) || []
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
      const list = dashboardStore.adminDashboard?.categorySales || []
      const total = list.reduce((sum, item) => sum + Number(item.revenue), 0)

      return list.map((item, index) => ({
            ...item,
            percent: total ? (item.revenue / total) * 100 : 0,
            color: pastelColors[index % pastelColors.length]
      }))
})
</script>

<template>
      <div class="mb-6 space-y-6">

            <h1 class="text-2xl md:text-3xl font-bold text-white">
                  Dashboard
            </h1>

            <div class="flex flex-wrap gap-4">

                  <div class="bg-white rounded-2xl p-4 shadow flex-1 min-w-[220px]">
                        <p class="text-sm text-gray-500">ยอดขายวันนี้</p>
                        <h2 class="text-xl md:text-2xl font-bold text-gray-900 mt-2">
                              {{ dashboardStore.adminDashboard?.kpi.todayRevenue.toLocaleString() }} ฿
                        </h2>
                  </div>

                  <div class="bg-white rounded-2xl p-4 shadow flex-1 min-w-[220px]">
                        <p class="text-sm text-gray-500">ยอดขายเดือนนี้</p>
                        <h2 class="text-xl md:text-2xl font-bold text-gray-900 mt-2">
                              {{ dashboardStore.adminDashboard?.kpi.monthlyRevenue.toLocaleString() }} ฿
                        </h2>
                  </div>

                  <div class="bg-white rounded-2xl p-4 shadow flex-1 min-w-[220px]">
                        <p class="text-sm text-gray-500">คำสั่งซื้อทั้งหมด</p>
                        <h2 class="text-xl md:text-2xl font-bold text-gray-900 mt-2">
                              {{ dashboardStore.adminDashboard?.kpi.orders.total }}
                        </h2>
                        <p class="text-xs text-green-500 mt-1">
                              สำเร็จ: {{ dashboardStore.adminDashboard?.kpi.orders.success }}
                        </p>
                        <p class="text-xs text-red-500">
                              ยกเลิก: {{ dashboardStore.adminDashboard?.kpi.orders.cancelled }}
                        </p>
                  </div>

                  <div class="bg-white rounded-2xl p-4 shadow flex-1 min-w-[220px]">
                        <p class="text-sm text-gray-500">ลูกค้าใหม่ในเดือนนี้</p>
                        <h2 class="text-xl md:text-2xl font-bold text-gray-900 mt-2">
                              {{ dashboardStore.adminDashboard?.kpi.newUsers }}
                        </h2>
                  </div>

            </div>

            <div class="flex flex-wrap gap-4">

                  <div class="w-full lg:flex-[3] bg-white rounded-2xl shadow p-5">
                        <div class="flex items-center justify-between mb-4">
                              <div>
                                    <h2 class="text-lg font-semibold text-gray-800">
                                          แนวโน้มยอดขาย 7 วัน
                                    </h2>
                                    <p class="text-sm text-gray-500">
                                          รายได้ย้อนหลังรายวัน
                                    </p>
                              </div>
                        </div>

                        <apexchart type="area" height="300" :options="chartOptions" :series="series" />
                  </div>

                  <div class="w-full lg:flex-[1] bg-white rounded-2xl shadow p-5">
                        <div class="space-y-4">
                              <h2 class="text-lg font-semibold text-gray-800">
                                    ยอดขายตามหมวด
                              </h2>

                              <div v-for="item in categoryPercent" :key="item.category" class="w-full">
                                    <div class="flex justify-between items-center text-sm mb-1">
                                          <span class="text-gray-700 font-medium">
                                                {{ item.category }}
                                          </span>
                                          <span class="text-gray-500">
                                                {{ item.percent.toFixed(0) }}%
                                          </span>
                                    </div>

                                    <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                          <div class="h-2 rounded-full transition-all duration-700"
                                                :style="{ width: item.percent + '%', backgroundColor: item.color }" />
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
                              <thead class="text-black text-sm">
                                    <tr>
                                          <th class="px-6 py-3">สินค้า</th>
                                          <th class="px-6 py-3">จำนวน</th>
                                    </tr>
                              </thead>

                              <tbody class="divide-y text-gray-700">
                                    <tr v-for="product in dashboardStore.adminDashboard?.topProducts"
                                          :key="product.productId">
                                          <td class="px-6 py-1">{{ product.name }}</td>
                                          <td class="px-6 py-1">
                                                {{ product.sold }}
                                          </td>
                                    </tr>
                              </tbody>
                        </table>
                  </div>

                  <div class="w-full lg:flex-[1] bg-white rounded-2xl shadow p-5">

                        <h2 class="text-lg font-semibold text-gray-800 mb-4">
                              ผู้ใช้งานในระบบ
                        </h2>

                        <div class="mb-4">
                              <p class="text-sm text-gray-500">ผู้ใช้งานทั้งหมด</p>
                              <p class="text-2xl font-bold text-gray-900">
                                    {{ dashboardStore.adminDashboard?.users.total }}
                              </p>
                        </div>

                        <div class="space-y-3">

                              <div class="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2">
                                    <span class="text-sm text-gray-600">ผู้จัดการ</span>
                                    <span class="font-semibold text-gray-800">
                                          {{ dashboardStore.adminDashboard?.users.manager }}
                                    </span>
                              </div>

                              <div class="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2">
                                    <span class="text-sm text-gray-600">พนักงาน</span>
                                    <span class="font-semibold text-gray-800">
                                          {{ dashboardStore.adminDashboard?.users.staff }}
                                    </span>
                              </div>

                              <div class="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2">
                                    <span class="text-sm text-gray-600">ลูกค้า</span>
                                    <span class="font-semibold text-gray-800">
                                          {{ dashboardStore.adminDashboard?.users.customer }}
                                    </span>
                              </div>

                        </div>

                  </div>

            </div>

      </div>
      <LoadingComponent v-model="loadingStore.loading" />
</template>