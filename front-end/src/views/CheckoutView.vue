  <script setup lang="ts">

  import { onMounted, ref, computed, watch } from 'vue'

  import { useForm } from 'vee-validate'
  import * as yup from 'yup'

  import LoadingComponent from '@/components/LoadingComponent.vue'

  import { useAddressStore } from '@/stores/address'
  import { useAuthStore } from '@/stores/auth'
  import { useCartStore } from '@/stores/cart'
  import { useLoadingStore } from '@/stores/loading'
  import { useOrderStore } from '@/stores/order'

  import type { Address } from '@/types/Address'
  import type { PaymentMethod } from '@/types/Payment'

  import router from '@/router'

  import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
  } from '@headlessui/vue'






  const cartStore = useCartStore()
  const authStore = useAuthStore()
  const addressStore = useAddressStore()
  const loadingStore = useLoadingStore()
  const orderStore = useOrderStore()


  const shippingMethod = ref('standard')
  const selectedAddressId = ref<number | null>(null)
  const showForm = ref(false)
  const showAddressManager = ref(false)
  const availableSubDistricts = ref<any[]>([])
  const selectedSubDistrict = ref<any>(null)
  const thaiAddressDB = ref<any[]>([])
  const selectedPayment = ref<PaymentMethod>('promptpay')


  const couponSchema = yup.object({
    code: yup.string().default('')
  })

  type CouponForm = yup.InferType<typeof couponSchema>

  const {
    handleSubmit: handleCouponSubmit,
    defineField: defineCouponField,
    errors: couponErrors,
    setFieldError,
  } = useForm<CouponForm>({
    validationSchema: couponSchema,
  })


  const [code] = defineCouponField('code')



  onMounted(async () => {
    await authStore.getCurrentUser()
    await addressStore.getAddresses()
    cartStore.getCarts()
    const defaultAddr = addressStore.addresses.find(a => a.is_default)
    if (defaultAddr?.address_id) {
      selectedAddressId.value = defaultAddr.address_id
    }
    try {
      const response = await fetch('https://raw.githubusercontent.com/earthchie/jquery.Thailand.js/master/jquery.Thailand.js/database/raw_database/raw_database.json')
      if (response.ok) {
        thaiAddressDB.value = await response.json()
      }
    } catch (error) {
      console.error(error)
    }
  })


  watch(
    selectedPayment,
    (newVal) => {
      orderStore.orderForm.payment_method = newVal
    },
    { immediate: true }
  )

  const defaultAddress = computed(() => {
    return addressStore.addresses?.find(addr => addr.is_default)
  })


  const autoFillAddress = () => {
    const selected = selectedSubDistrict.value
    if (selected) {
      addressStore.editedAddress.sub_district = selected.district
      addressStore.editedAddress.district = selected.amphoe
      addressStore.editedAddress.province = selected.province
    }
  }

  const findAddressByZipcode = async () => {
    selectedSubDistrict.value = null
    addressStore.editedAddress.sub_district = ''
    addressStore.editedAddress.district = ''
    addressStore.editedAddress.province = ''
    if (addressStore.editedAddress.zipcode.length === 5) {
      const matches = thaiAddressDB.value.filter(
        (item) => String(item.zipcode) === String(addressStore.editedAddress.zipcode)
      )
      availableSubDistricts.value = matches
      if (matches.length > 0) {
        const target = matches[0]
        selectedSubDistrict.value = target
        addressStore.editedAddress.sub_district = target.district
        addressStore.editedAddress.district = target.amphoe
        addressStore.editedAddress.province = target.province
      }
    } else {
      console.log('ไม่ผ่าน')
      availableSubDistricts.value = []
    }
  }
  const openAddForm = () => {
    addressStore.clearForm()

    selectedSubDistrict.value = null
    availableSubDistricts.value = []

    showForm.value = true
  }

  const editAddress = (addr: Address) => {
    if (!addr.address_id) return

    addressStore.setForm(addr)

    if (addr.zipcode) {
      const matches = thaiAddressDB.value.filter(
        (item) => String(item.zipcode) === String(addr.zipcode),
      )

      availableSubDistricts.value = matches

      selectedSubDistrict.value =
        matches.find((item) => item.district === addr.sub_district) || null
    }

    showForm.value = true
  }

  const handleSave = async () => {
    try {
      loadingStore.doLoad()

      if (addressStore.editedAddress.address_id) {
        console.log('update')
        console.log(addressStore.editedAddress)
        await addressStore.updateAddress(
          addressStore.editedAddress.address_id,
          addressStore.editedAddress,
        )
      } else {
        console.log('create')
        await addressStore.addAddress()
      }

      showForm.value = false
    } finally {
      loadingStore.finishLoad()
    }
  }

  const setDefaultLocal = async (address: Address) => {
    if (!address.address_id) return
    await addressStore.setDefault(address)
    selectedAddressId.value = address.address_id
    showAddressManager.value = false
  }

  const removeAddress = async (address: Address) => {
    if (confirm('ยืนยันการลบที่อยู่?')) {
      await addressStore.removeAddress(address)
    }
  }



  const paymentMethods = [{ label: 'QR พร้อมเพย์', value: 'promptpay' },
  { label: 'เก็บเงินปลายทาง', value: 'cod' }

  ];

  const goToOrderSuccess = async (code?: string) => {

    try {
      if (!selectedAddressId.value) {
        alert('กรุณาเลือกที่อยู่')
        return
      }

      if (!cartStore.cart?.cartDetails?.length) {
        alert('ไม่มีสินค้าในตะกร้า')
        return
      }

      orderStore.setOrder({
        coupon_code: code
      })

      const order = await orderStore.createOrder()

      await cartStore.clearChart()

      if (order.payment_method === 'promptpay') {
        router.push({
          name: 'payment-confirmation',
          params: { orderId: order.order_id }
        })
      } else {
        router.push({
          name: 'order-succes',
          params: { orderId: order.order_id }
        })
      }
      cartStore.getCarts()

    } catch (error) {
      console.error(error)
      alert('สั่งซื้อไม่สำเร็จ')
    }
  }


  const useCode = handleCouponSubmit(async (values) => {
    try {

      cartStore.editedCode.code = values.code
      await cartStore.applyCoupon()
      await cartStore.getCarts()
    } catch (error: any) {
      setFieldError('code', error?.response?.data?.message || 'โค้ดไม่ถูกต้อง')
    }
  })

  async function removeCoupon() {
    await cartStore.removeCoupon()
    await cartStore.getCarts()
  }
</script>

  <template>
    <div class=" w-full flex  p-6 flex-col items-center">


      <div class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-3">

        <div class="bg-white p-6 rounded-lg shadow-md">

          <div v-if="!showAddressManager">
            <h2 class="text-xl font-bold mb-4">ที่อยู่จัดส่ง</h2>

            <div v-if="defaultAddress"
              class="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
              @click="showAddressManager = true">
              <div>
                <div class="font-semibold">
                  {{ defaultAddress.fullname }} ({{ defaultAddress.phone }})
                </div>
                <div class="text-sm text-gray-600">
                  {{ defaultAddress.address_detail }}
                  ต.{{ defaultAddress.sub_district }}
                  อ.{{ defaultAddress.district }}
                  จ.{{ defaultAddress.province }}
                  {{ defaultAddress.zipcode }}
                </div>
                <div class="text-sm text-blue-500">
                  เปลี่ยน
                </div>
              </div>
            </div>

            <div v-else class="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
              @click="showAddressManager = true">
              <div>
                + เพิ่มที่อยู่
              </div>
            </div>

            <hr class="my-4" />

            <h2 class="font-semibold mb-2">วิธีจัดส่ง</h2>

            <label class="flex items-center gap-2 mb-2">
              <input type="radio" value="standard" v-model="shippingMethod" />
              จัดส่งมาตรฐาน
            </label>

            <!-- <label class="flex items-center gap-2 mb-4">
              <input type="radio" value="express" v-model="shippingMethod" />
              รับที่ร้าน
            </label> -->

            <hr class="my-4" />

            <h2 class="font-semibold mb-3">ช่องทางชำระเงิน</h2>

            <label v-for="paymentMethod in paymentMethods" :key="paymentMethod.value"
              class="flex flex-col border rounded-lg p-3 ">
              <div class="flex items-center gap-3">
                <input type="radio" :value="paymentMethod.value" v-model="selectedPayment" />
                <div>{{ paymentMethod.label }}</div>
              </div>
            </label>


          </div>

          <div v-else>
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold">จัดการที่อยู่</h2>
              <button class="text-blue-500" @click="showAddressManager = false">
                กลับ
              </button>
            </div>

            <div class="space-y-3 mb-4">
              <div v-for="addr in addressStore.addresses" :key="addr.address_id"
                class="border p-3 rounded-lg flex gap-3 items-start" :class="addr.address_id === selectedAddressId
                  ? 'bg-gray-100 border-gray-400 ring-1 ring-gray-300'
                  : 'bg-white border-gray-200'">
                <div class="flex-1">
                  <div class="flex justify-between items-start">
                    <div class="font-semibold leading-tight">
                      {{ addr.fullname }} ({{ addr.phone }})
                    </div>
                  </div>

                  <div class="text-sm text-gray-600">
                    {{ addr.address_detail }}
                    ต.{{ addr.sub_district }}
                    อ.{{ addr.district }}
                    จ.{{ addr.province }}
                    {{ addr.zipcode }}
                  </div>

                  <div class="flex justify-between mt-2 text-sm">
                    <button v-if="!addr.is_default" class="px-3 py-1 text-white rounded bg-[#82d182] hover:bg-[#69c769]"
                      @click="setDefaultLocal(addr)">
                      ตั้งเป็นที่อยู่หลัก
                    </button>

                    <span v-else class="px-3 py-1 bg-gray-200 text-gray-600 rounded">
                      ที่อยู่หลัก
                    </span>

                    <div class="flex gap-2">
                      <button class="text-blue-500" @click.stop="editAddress(addr)">
                        แก้ไข
                      </button>
                      <button class="text-red-500" @click.stop="removeAddress(addr)">
                        ลบ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button class="text-white bg-[#637aad] hover:bg-[#4a68a8] rounded-lg px-3 py-1 transition"
              @click="openAddForm">
              + เพิ่มที่อยู่
            </button>


          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md h-fit">
          <div class="max-w-[750px] w-full min-w-[300px] flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-2">
            <div v-for="detail in cartStore.cart?.cartDetails" :key="detail.cart_detail_id"
              class="bg-white border rounded-[10px] flex items-center gap-3 p-3 w-full">
              <img :src="detail.product.images[0]?.image"
                class="w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] object-cover rounded-md border" />

              <div class="flex-1 flex flex-col justify-between gap-1">
                <div class="flex justify-between items-start gap-2">
                  <div class="font-medium text-sm sm:text-base line-clamp-2">
                    {{ detail.product.title }}
                  </div>
                  <div class="text-red-500 font-medium text-sm sm:text-base whitespace-nowrap">
                    ฿{{ detail.price }}
                  </div>
                </div>
                <div class="flex justify-between items-center text-sm text-gray-600">
                  <div class="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-md">
                    <span class="text-xs">จำนวน</span>
                    <span class="font-medium">{{ detail.quantity }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h2 class="text-xl font-bold mt-6 mb-4">สรุปคำสั่งซื้อ</h2>

          <div class=" mb-4">

            <div v-if="!cartStore.cart?.coupon" class="flex flex-col gap-2">

              <div class="flex gap-2">
                <input v-model="code" placeholder="โค้ดส่วนลด" :class="[
                  'border flex-1 p-2 rounded focus:outline-none focus:ring-2',
                  couponErrors.code ? 'bg-red-50 border border-red-500 placeholder-red-700' : 'focus:ring-[#202020]'
                ]" />

                <button :disabled="!code || !code.trim()" class="text-white bg-[#637aad] hover:bg-[#4a68a8] 
          rounded-lg px-3 py-1
          disabled:bg-gray-400 disabled:text-gray-200 
          disabled:cursor-not-allowed 
          disabled:hover:bg-gray-400" @click="useCode">
                  ใช้โค้ด
                </button>
              </div>

              <p v-if="couponErrors.code" class="text-red-500 text-sm">
                {{ couponErrors.code }}
              </p>
            </div>


            <div v-else class="flex items-center justify-between bg-gray-100 rounded-lg p-3">
              <div class="flex items-center gap-2">
                <span class="text-green-600 font-semibold">
                  [ {{ cartStore.cart.coupon.code }} ]
                </span>

                <span class="text-sm text-green-600">
                  {{ cartStore.cart.coupon.description }}
                </span>
              </div>

              <button @click="removeCoupon">
                <span class="pi pi-times"></span>
              </button>
            </div>
          </div>

          <div class="flex justify-between mb-2 text-sm">
            <div>ราคา</div>
            <div>฿ {{ cartStore.cart?.subtotal }}</div>
          </div>

          <div class="flex justify-between mb-2 text-sm text-green-600">
            <div>ส่วนลด</div>
            <div>-฿{{ cartStore.cart?.discount_amount }}</div>
          </div>

          <hr class="my-3" />

          <div class="flex justify-between font-bold text-lg mb-4">
            <div>ยอดรวม</div>
            <div>฿{{ cartStore.cart?.total }}</div>
          </div>

          <button
            class="bg-[#82d182] w-full mt-[20px] h-[35px] hover:bg-[#69c769] rounded-[10px] text-white font-medium"
            v-if="cartStore.cart" @click="goToOrderSuccess(cartStore.cart.coupon?.code)">
            ยืนยันคำสั่งซื้อ
          </button>
        </div>


      </div>
    </div>

    <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center ">
      <div class="absolute inset-0 bg-black/40" @click="showForm = false"></div>

      <div class="relative w-full max-w-md max-h-[90vh] z-10">
        <div class="bg-white p-5 rounded-xl shadow-lg overflow-y-auto max-h-[90vh]">
          <h2 class="text-lg font-bold mb-4">
            {{ addressStore.editedAddress.address_id ? 'แก้ไขที่อยู่' : 'เพิ่มที่อยู่' }}
          </h2>

          <input v-model="addressStore.editedAddress.fullname" placeholder="ชื่อ-นามสกุล"
            class="border w-full mb-2 p-2 rounded bg-gray-50" />
          <input v-model="addressStore.editedAddress.phone" placeholder="เบอร์โทรศัพท์"
            class="border w-full mb-2 p-2 rounded bg-gray-50" maxlength="10" />
          <textarea v-model="addressStore.editedAddress.address_detail" placeholder="บ้านเลขที่, หมู่, ซอย, ถนน"
            class="border w-full mb-2 p-2 rounded bg-gray-50"></textarea>

          <div class="grid grid-cols-2 gap-2 mb-2">
            <div>
              <input v-model="addressStore.editedAddress.zipcode" placeholder="รหัสไปรษณีย์"
                class="border w-full p-2 rounded bg-gray-50" maxlength="5" @input="findAddressByZipcode" />
            </div>
            <div>
              <Listbox v-model="selectedSubDistrict">
                <div class="relative">
                  <ListboxButton :disabled="!availableSubDistricts.length"
                    class="w-full border border-gray-300 bg-gray-50 px-3 py-2 rounded text-left text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 flex justify-between items-center">
                    <span class="truncate">
                      {{ selectedSubDistrict?.district || 'เลือกตำบล/แขวง' }}
                    </span>
                  </ListboxButton>
                  <transition enter-active-class="transition duration-100 ease-out"
                    enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100"
                    leave-active-class="transition duration-75 ease-in" leave-from-class="opacity-100 scale-100"
                    leave-to-class="opacity-0 scale-95">
                    <ListboxOptions
                      class="absolute z-50 bottom-full mb-1 w-full max-h-60 overflow-auto rounded border border-gray-200 bg-white shadow-md text-sm">
                      <ListboxOption v-for="(item, index) in availableSubDistricts" :key="index" :value="item"
                        v-slot="{ active, selected }">
                        <li @click="autoFillAddress()" :class="[
                          'cursor-pointer px-3 py-2 flex justify-between items-center',
                          active ? 'bg-gray-100' : '',
                        ]">
                          <span :class="selected ? 'font-medium text-gray-900' : 'text-gray-700'">
                            {{ item.district }}
                          </span>
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 mb-4">
            <input v-model="addressStore.editedAddress.district" placeholder="อำเภอ/เขต"
              class="border w-full p-2 bg-gray-200 text-gray-600 rounded" readonly />
            <input v-model="addressStore.editedAddress.province" placeholder="จังหวัด"
              class="border w-full p-2 bg-gray-200 text-gray-600 rounded" readonly />
          </div>
          <div>
          </div>

          <div class="flex gap-2 justify-end">
            <button class="bg-gray-300 px-4 py-2 rounded" @click="showForm = false">
              ยกเลิก
            </button>
            <button class="bg-[#82d182] hover:bg-[#69c769] text-white px-4 py-2 rounded" @click="handleSave">
              บันทึก
            </button>

          </div>
        </div>
      </div>
    </div>
    <LoadingComponent v-model="loadingStore.loading" />
  </template>