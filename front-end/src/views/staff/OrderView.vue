<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useOrderStore } from '@/stores/order'
import { useLoadingStore } from '@/stores/loading'
import { OrderStatusColor, OrderStatusLabel } from '@/constants/orderStatus'
import type { Order, OrderStatus, UpdateOrder } from '@/types/Order'
import LoadingComponent from '@/components/LoadingComponent.vue'
import { useShipmentStore } from '@/stores/shipment'
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'
import { formatThaiDateTime } from '@/utils/formatDate'
import { usePaymentStore } from '@/stores/payment'
import { PaymentMethodLabel } from '@/constants/paymentMethod'

const loadingStore = useLoadingStore()
const orderStore = useOrderStore()
const shimpentStore = useShipmentStore()
const paymentStore = usePaymentStore()

const selectedShipment = ref<any>(null)
const tab = ref<typeof tabs[number]['key']>('all')

const search = ref('')


const orderDialog = ref(false)
const trackingCodeDialog = ref(false)
const checkSlipDialog = ref(false)

const tabs = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'pending', label: 'รอยืนยัน', status: 'pending' as OrderStatus },
  { key: 'waiting_verify', label: 'รอตรวจสลิป', status: 'waiting_verify' as OrderStatus },
  { key: 'computed', label: 'ยืนยันแล้ว', status: 'confirmed' as OrderStatus },
  { key: 'picking', label: 'กำลังแพ็ค', status: 'picking' as OrderStatus },
  { key: 'shipped', label: 'จัดส่งแล้ว', status: 'shipped' as OrderStatus },
  { key: 'done', label: 'สำเร็จ', status: 'done' as OrderStatus },
  { key: 'cancelled', label: 'ยกเลิก', status: 'cancelled' as OrderStatus },
]


type OrderAction = {
  icon: string
  status: OrderStatus
  text: string
  updateTo: OrderStatus
  type?: 'primary' | 'danger'
}



const orderActions: OrderAction[] = [
  {
    icon: 'pi pi-times',
    status: 'pending',
    text: 'ยกเลิกออเดอร์',
    updateTo: 'cancelled' as OrderStatus,
    type: 'danger',
  },

  {
    icon: 'pi pi-file-check',
    status: 'waiting_verify',
    text: 'ตรวจสอบสลิป',
    updateTo: 'confirmed' as OrderStatus,
  },
  {
    icon: 'pi pi-box',
    status: 'confirmed',
    text: 'เริ่มแพ็คสินค้า',
    updateTo: 'picking' as OrderStatus,
  },

  {
    icon: 'pi pi-truck',
    status: 'picking',
    text: 'ใส่เลขพัสดุ',
    updateTo: 'shipped' as OrderStatus,
  },

  {
    icon: 'pi pi-check-circle',
    status: 'shipped',
    text: 'จัดส่งสำเร็จ',
    updateTo: 'done' as OrderStatus,
  },
]



onMounted(async () => {
  await fetchOrders()
  await shimpentStore.getShipments()

})


watch(tab, async () => {
  orderStore.page = 1
  await fetchOrders()
})


watch(selectedShipment, (val) => {
  if (val) {
    shimpentStore.editedShipment.shipment_id = val.shipment_id
    orderStore.trackingForm.shipment_id = val.shipment_id
  }
})


watch(
  () => shimpentStore.shipments,
  (shipments) => {
    if (

      shimpentStore.editedShipment.shipment_id
    ) {
      selectedShipment.value =
        shipments.find(
          (c) => c.shipment_id === shimpentStore.editedShipment.shipment_id
        ) || null
    }
  },
  { immediate: true }
)






const searchData = async () => {
  orderStore.page = 1
  await orderStore.getOrders()
}

const clearSearch = async () => {
  search.value = ''
  orderStore.page = 1
  await fetchOrders()
}


const fetchOrders = async () => {
  const selectedTab = tabs.find(t => t.key === tab.value)

  await orderStore.getOrders(
    orderStore.page,
    orderStore.limit,
    selectedTab?.status
  )
}


const nextPage = async () => {
  if (orderStore.page < orderStore.lastPage) {
    orderStore.page++
    await fetchOrders()
  }
}

const prevPage = async () => {
  if (orderStore.page > 1) {
    orderStore.page--
    await fetchOrders()
  }
}




const openOrderDetail = (id: number) => {
  orderStore.getOrderById(id)
  orderDialog.value = true

}

const openTrackingCode = (id: number) => {
  orderStore.getOrderById(id)
  trackingCodeDialog.value = true
}


const openCheckSlipDialog = (id: number) => {
  orderStore.getOrderById(id)
  paymentStore.fetchPaymentTransaction(id)
  checkSlipDialog.value = true

}

const closeDialog = () => {
  orderDialog.value = false
}

const closeTrackingCodeDialog = () => {
  trackingCodeDialog.value = false
  orderStore.clearTrackingForm()
}





const getAction = (status: OrderStatus): OrderAction[] => {
  return orderActions.filter(a => a.status === status)
}


const updateStatus = async (order: Order, action: OrderAction) => {
  const payload: UpdateOrder = {
    status: action.updateTo,
  }


  if (tab.value !== 'all') {
    orderStore.orders = orderStore.orders.filter(
      o => o.order_id !== order.order_id
    )
  } else {
    const index = orderStore.orders.findIndex(
      o => o.order_id === order.order_id
    )
    if (index !== -1) {
      orderStore.orders[index].order_status = payload.status
    }
  }

  try {
    await orderStore.updateStatus(order.order_id, payload)
  } catch (err) {
    console.error(err)
    await fetchOrders()
  }
}


const handleClick = (order: Order, action: OrderAction) => {

  if (order.order_status === 'picking') {
    openTrackingCode(order.order_id)
  } else if (order.order_status === 'waiting_verify') {
    openCheckSlipDialog(order.order_id)
  } else {
    updateStatus(order, action)
  }
}


const saveTrackingCodeDialog = async () => {

  if (orderStore.selectedOrder) {
    await orderStore.updateTracking(orderStore.selectedOrder?.order_id)
    closeTrackingCodeDialog()
    orderStore.getOrders(orderStore.page,
      orderStore.limit, 'picking')
    orderStore.clearTrackingForm()
  }


}


const approveSlip = async () => {
  try {
    if (!orderStore.selectedOrder) return

    await orderStore.updateStatus(
      orderStore.selectedOrder.order_id,
      { status: 'confirmed' }
    )


    await orderStore.getOrders()
    checkSlipDialog.value = false
  } catch (err) {
    console.error(err)
  }
}

const rejectSlip = async () => {
  try {
    if (!orderStore.selectedOrder) return

    await orderStore.updateStatus(
      orderStore.selectedOrder.order_id,
      { status: 'cancelled' }
    )


    await orderStore.getOrders()
    checkSlipDialog.value = false
  } catch (err) {
    console.error(err)
  }
}

</script>

<template>

  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold text-white">Order Management</h1>

    <div class="flex items-center gap-3">
      <input type="text" placeholder="Search..." v-model="search" class="border px-3 py-2 rounded w-64" />

      <button class="bg-white/10 hover:bg-white/20 text-white p-2 rounded-md" @click="searchData()">
        <span class="pi pi-search"></span>
      </button>

      <button class="bg-white/10 hover:bg-white/20 text-white p-2 rounded-md" @click="clearSearch()">
        <span class="pi pi-times"></span>
      </button>


    </div>
  </div>

  <div class="inline-flex bg-gray-100  mb-4 rounded-xl">

    <button v-for="t in tabs" :key="t.key" @click="tab = t.key" class="px-4 py-2 text-sm rounded-lg transition" :class="tab === t.key
      ? 'bg-white shadow text-black'
      : 'text-gray-500'">
      {{ t.label }}
    </button>
  </div>


  <div class="bg-white rounded-lg overflow-hidden">
    <table class="w-full text-center  text-black">
      <thead class="bg-[#383838] text-gray-300 text-sm">
        <tr>
          <th class="px-6 py-3 "> ออเดอร์</th>
          <th class="px-6 py-3 ">ลูกค้า</th>
          <th class="px-6 py-3">วิธีชำระเงิน</th>
          <th class="px-6 py-3 ">ยอด</th>
          <th class="px-6 py-3 ">สถานะ</th>
          <th class="px-6 py-3 ">วันที่</th>
          <th class="px-6 py-3 ">ดูรายละเอียด</th>
        </tr>
      </thead>

      <tbody class="divide-y">

        <tr v-if="orderStore.orders.length === 0">
          <td colspan="7" class="text-center py-6 text-gray-500">ไม่พบข้อมูลที่ค้นหา</td>
        </tr>
        <tr v-for="order in orderStore.orders" :key="order.order_id">

          <td class="px-6 py-2">{{ order.order_id }}</td>
          <td class="px-6 py-2">{{ order.fullname }}</td>
          <td class="px-6 py-2">{{ PaymentMethodLabel[order.payment_method] }}</td>
          <td class="px-6 py-2">{{ order.total_amount }}</td>


          <td class="px-6 py-2">
            <span class="px-2 py-1 rounded-full text-xs font-semibold " :class="OrderStatusColor[order.order_status]">
              {{ OrderStatusLabel[order.order_status] }}
            </span>

          </td>

          <td class="px-6 py-1">
            {{ formatThaiDateTime(order.updated_at) }}

          </td>



          <td class="px-6 py-1 align-middle">
            <div class="flex justify-center items-center space-x-2">
              <button v-for="action in getAction(order.order_status)" :key="action.text"
                class="text-white bg-[#637aad] hover:bg-[#4a68a8] rounded-lg px-3 py-1 transition"
                @click="handleClick(order, action)">
                <span :class="action.icon"></span>
                {{ action.text }}
              </button>
              <button @click=" openOrderDetail(order.order_id)">
                <span class="pi pi-eye"></span>
              </button>


            </div>
          </td>
        </tr>
      </tbody>
    </table>


    <div class="flex justify-end items-center gap-4 py-4 border-t mr-3">
      <button class="px-3 py-1 border rounded hover:bg-gray-100" @click="prevPage()">
        <span class="pi pi-chevron-left text-sm"></span> Prev
      </button>

      <span class="text-sm text-gray-600">
        {{ orderStore.page }} of {{ orderStore.lastPage }}</span>

      <button class="px-3 py-1 border rounded hover:bg-gray-100" @click="nextPage()">
        Next <span class="pi pi-chevron-right text-sm"></span>
      </button>
    </div>
  </div>






  <!-- Dialog -->
  <div v-if="orderDialog" class="overlay">
    <div class="dialog">
      <div class="flex justify-between">
        <div class="flex items-center gap-2">

          <h2 class="text-lg font-semibold">
            ออเดอร์ {{ orderStore.selectedOrder?.order_id }}
          </h2>
          <span v-if="orderStore.selectedOrder" class="px-2 py-2 rounded-full text-xs font-semibold"
            :class="OrderStatusColor[orderStore.selectedOrder.order_status]">
            {{ OrderStatusLabel[orderStore.selectedOrder.order_status] }}
          </span>
        </div>
        <button @click="closeDialog">
          <span class="pi pi-times"></span>
        </button>
      </div>
      <label class="block mb-1">ข้อมูลลูกค้า</label>
      <div class="mb-3 p-2   bg-gray-100">
        <div> {{ orderStore.selectedOrder?.fullname }}</div>
        <div> <span class="pi pi-phone"></span> {{ orderStore.selectedOrder?.phone }}</div>
        <div> <span class="pi pi-map-marker"></span> {{ orderStore.selectedOrder?.address_detail }} {{
          orderStore.selectedOrder?.sub_district }} {{
            orderStore.selectedOrder?.district }} {{ orderStore.selectedOrder?.province }} {{
            orderStore.selectedOrder?.zipcode }}</div>

      </div>

      <label class="block mb-1 ">รายการสินค้า
      </label>
      <div class=" max-h-[250px] overflow-y-auto">
        <div class="mb-3 p-2   bg-gray-100" v-for="detail in orderStore.selectedOrder?.details"
          :key="detail.order_detail_id">
          <div class="flex-1 flex flex-col justify-between gap-1">
            <div class="flex justify-between items-start gap-2">
              <div class="text-sm sm:text-base line-clamp-2">
                {{ detail.product_title }}
              </div>
              <div class="text-red-500  text-sm sm:text-base whitespace-nowrap">
                ฿{{ detail.price }}
              </div>
            </div>
            <div class="flex justify-between items-center text-sm text-gray-600">
              <div class="flex items-center gap-2 bg-white px-2 py-1 rounded-md">
                <span class="text-xs">จำนวน</span>
                <span class="font-medium">{{ detail.quantity }}</span>
              </div>
            </div>
          </div>



        </div>
      </div>

      <div class="mb-3 flex justify-between">
        <label class="block mb-1"> ยอดรวม</label>
        <div>{{ orderStore.selectedOrder?.total_amount }}</div>

      </div>
      <div v-if="orderStore.selectedOrder?.tracking_number && orderStore.selectedOrder?.shipment"
        class="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-3">

        <div class="bg-green-100 text-green-600 p-2 rounded-full">
          <span class="pi pi-truck text-lg"></span>
        </div>


        <div class="flex flex-col text-sm">
          <div>
            <span class="text-gray-500">
              จัดส่งโดย :
            </span>

            <span class="font-medium text-gray-800">
              {{ orderStore.selectedOrder.shipment.name }}
            </span>
          </div>
          <div>
            <span class="text-gray-500 mt-1">
              หมายเลขพัสดุ :
            </span>

            <span class="font-semibold text-blue-600 tracking-wide">
              {{ orderStore.selectedOrder.tracking_number }}
            </span>
          </div>
        </div>
      </div>


    </div>
  </div>

  <div v-if="trackingCodeDialog" class="overlay">
    <div class="dialog">
      <h2 class="text-lg font-semibold mb-4">
        ใส่หมายเลขพัสดุ
      </h2>


      <div class="mb-3">
        <label class="block mb-1">ออเดอร์ {{ }}</label>
        <input v-model="orderStore.trackingForm.tracking_number" placeholder="เช่น TH123456789"
          class="border w-full px-3 py-2 rounded bg-gray-100" />
      </div>

      <div class="mb-3">
        <label>Shipment</label>

        <Listbox v-model="selectedShipment">
          <div class="relative">


            <ListboxButton
              class="w-full border border-gray-300 bg-gray-50 px-3 py-2 rounded text-left text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 flex justify-between items-center">
              <span class="truncate">
                {{ selectedShipment?.name ?? 'Select category' }}
              </span>

              <ChevronUpDownIcon class="w-4 h-4 text-gray-400" />
            </ListboxButton>


            <transition enter-active-class="transition duration-100 ease-out" enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-75 ease-in"
              leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
              <ListboxOptions
                class="absolute z-50 bottom-full mb-1 w-full max-h-60 overflow-auto rounded border border-gray-200 bg-white shadow-md text-sm">
                <ListboxOption v-for="shipment in shimpentStore.shipments" :key="shipment.shipment_id" :value="shipment"
                  v-slot="{ active, selected }">
                  <li :class="[
                    'cursor-pointer px-3 py-2 flex justify-between items-center',
                    active ? 'bg-gray-100' : '',
                  ]">
                    <span :class="selected ? 'font-medium text-gray-900' : 'text-gray-700'">
                      {{ shipment.name }}
                    </span>

                    <CheckIcon v-if="selected" class="w-4 h-4 text-gray-500" />
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>

          </div>
        </Listbox>
      </div>



      <div class="flex justify-center gap-4">
        <button class="bg-red-500 text-white px-4 py-1 rounded" @click="closeTrackingCodeDialog">
          Cancel
        </button>

        <button class="bg-green-500 text-white px-4 py-1 rounded" @click="saveTrackingCodeDialog()">
          Save
        </button>
      </div>


    </div>
  </div>



  <div v-if="checkSlipDialog" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white w-full max-w-2xl rounded-[10px] shadow-xl p-5">

      <h2 class="text-lg font-semibold text-gray-800 mb-4">
        ตรวจสอบสลิปการชำระเงิน
      </h2>

      <div class="flex gap-6">


        <div class="w-1/2">
          <div v-if="paymentStore.paymentTransaction?.slip_image" class="border rounded-xl overflow-hidden">
            <img :src="paymentStore.paymentTransaction.slip_image" alt="slip" class="w-full h-auto object-cover" />
          </div>

          <div v-else class="text-center text-gray-400 text-sm">
            ไม่มีสลิปการชำระเงิน
          </div>
        </div>


        <div class="w-1/2 flex flex-col gap-3 text-sm text-gray-700">

          <div class="flex justify-between">
            <span>ยอดที่ต้องชำระ</span>
            <span class="font-semibold">
              {{ paymentStore.paymentTransaction?.amount }} บาท
            </span>
          </div>

          <div class="flex justify-between">
            <span>วิธีชำระเงิน</span>
            <span class="font-medium" v-if="orderStore.selectedOrder">
              {{ PaymentMethodLabel[orderStore.selectedOrder.payment_method] }}
            </span>
          </div>



          <div class="flex justify-between">
            <span>วันที่ชำระ</span>
            <span>

              {{ formatThaiDateTime(paymentStore.paymentTransaction!.created_at) }}
            </span>
          </div>

        </div>
      </div>


      <div class="flex justify-end gap-3 mt-6">
        <button class="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition"
          @click="checkSlipDialog = false">
          ยกเลิก
        </button>

        <button class="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition shadow-sm"
          @click="rejectSlip()">
          ปฏิเสธสลิป
        </button>

        <button class="px-4 py-2 text-sm rounded-lg bg-green-500 text-white hover:bg-green-600 transition shadow-sm"
          @click="approveSlip()">
          อนุมัติสลิป
        </button>
      </div>

    </div>
  </div>


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
  width: 400px;
}

.checkSlip {
  background: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 475px;
  width: 100%;
}
</style>