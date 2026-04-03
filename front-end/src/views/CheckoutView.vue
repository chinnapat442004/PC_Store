<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { onMounted, ref } from 'vue'
import { computed } from 'vue'

const cartStore = useCartStore()
const authStore = useAuthStore()



const promptPayNumber = import.meta.env.VITE_PROMPTPAY_NUMBER

const grandTotal = computed(() => {
  return cartStore.cart?.total_amount || 0
})

const promptPayQR = computed(() => {
  return `https://promptpay.io/${promptPayNumber}/${grandTotal.value}.png`
})

const form = ref({
  fullname: '',
  phone: '',
  address: '',
  province: '',
  zipcode: '',
})

onMounted(async () => {
  await authStore.getCurrentUser()
  cartStore.getCarts()
 
})


const shippingMethod = ref('standard')
const paymentMethod = ref('cod')
const coupon = ref('')
</script>

<template>
  <div class="min-h-screen w-full flex justify-center p-6 ">

    <div class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">

  
      <div class="bg-white p-6 rounded-lg shadow-md">

        <h2 class="text-xl font-bold mb-4">ที่อยู่จัดส่ง</h2>

        <input v-model="form.fullname" placeholder="ชื่อ-นามสกุล"
          class="border w-full p-2 rounded mb-2" />

        <input v-model="form.phone" placeholder="เบอร์โทร"
          class="border w-full p-2 rounded mb-2" />

        <textarea v-model="form.address" placeholder="ที่อยู่"
          class="border w-full p-2 rounded mb-2"></textarea>

        <input v-model="form.province" placeholder="จังหวัด"
          class="border w-full p-2 rounded mb-2" />

        <input v-model="form.zipcode" placeholder="รหัสไปรษณีย์"
          class="border w-full p-2 rounded mb-4" />

        <hr class="my-4" />

    
        <h2 class="font-semibold mb-2">วิธีจัดส่ง</h2>

        <label class="flex items-center gap-2 mb-2">
          <input type="radio" value="standard" v-model="shippingMethod" />
          จัดส่งมาตรฐาน
        </label>

        <label class="flex items-center gap-2 mb-4">
          <input type="radio" value="express" v-model="shippingMethod" />
          จัดส่งด่วน
        </label>

        <hr class="my-4" />

    
       <hr class="my-4" />

<h2 class="font-semibold mb-3">ช่องทางชำระเงิน</h2>

<div class="space-y-3">

  <!-- COD -->
  <label class="flex items-start gap-3 border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
    <input type="radio" value="cod" v-model="paymentMethod" />
    <div>
      <div class="font-medium">เก็บเงินปลายทาง (COD)</div>
      <div class="text-xs text-gray-500">ชำระเมื่อได้รับสินค้า</div>
    </div>
  </label>



  <!-- PROMPTPAY -->
  <label class="flex flex-col gap-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50">

    <div class="flex items-start gap-3">
      <input type="radio" value="promptpay" v-model="paymentMethod" />
      <div>
        <div class="font-medium">PromptPay QR</div>
        <div class="text-xs text-gray-500">สแกนจ่ายได้ทันที</div>
      </div>
    </div>

    <div v-if="paymentMethod === 'promptpay'" class="mt-4 flex flex-col items-center">

  <img
    :src="promptPayQR"
    class="w-[200px] h-[200px] border rounded-lg"
  />

  <div class="text-sm font-medium mt-2">
    จำนวนเงิน: ฿{{ grandTotal }}
  </div>

  <div class="text-xs text-gray-500">
    สแกนเพื่อชำระเงินผ่าน PromptPay
  </div>

</div>
  </label>

</div>

      </div>

   
      <div class="bg-white p-6 rounded-lg shadow-md h-fit">

  
   <div class="max-w-[750px] w-full min-w-[300px] flex flex-col gap-2
              max-h-[350px] overflow-y-auto pr-2">


    <div
      v-for="detail in cartStore.cart?.cartDetails"
      :key="detail.cart_detail_id"
      class="bg-white border rounded-[10px] flex items-center gap-3 p-3 w-full"
    >

     
      <img
        :src="detail.product.images[0]?.image"
        class="w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] object-cover rounded-md"
      />

      <div class="flex-1 flex flex-col justify-between gap-1">

       
        <div class="flex justify-between items-start gap-2">
          <div class="font-medium text-sm sm:text-base line-clamp-2">
            {{ detail.product.title }}
          </div>

          <div class="text-red-500 font-medium text-sm sm:text-base whitespace-nowrap">
            ฿{{ detail.price }}
          </div>
        </div>

  ฃ
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

  
  <div class="flex gap-2 mb-4">
    <input
      v-model="coupon"
      placeholder="โค้ดส่วนลด"
      class="border flex-1 p-2 rounded"
    />

    <button class="bg-black text-white px-4 rounded">
      ใช้โค้ด
    </button>
  </div>


  <div class="flex justify-between mb-2 text-sm">
    <div>ราคาสินค้า</div>
    <div>฿0.00</div>
  </div>

  <div class="flex justify-between mb-2 text-sm">
    <div>ค่าจัดส่ง</div>
    <div>฿0.00</div>
  </div>

  <div class="flex justify-between mb-2 text-sm">
    <div>ส่วนลด</div>
    <div>฿0.00</div>
  </div>

  <hr class="my-3" />

  <div class="flex justify-between font-bold text-lg mb-4">
    <div>ยอดรวม</div>
    <div>฿0.00</div>
  </div>

  <button class="bg-green-600 hover:bg-green-700 text-white w-full h-[45px] rounded">
    ยืนยันคำสั่งซื้อ
  </button>

</div>

    </div>
  </div>
</template>