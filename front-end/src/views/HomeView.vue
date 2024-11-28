<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { IonIcon } from '@ionic/vue'
import { arrowBackOutline, arrowForwardOutline } from 'ionicons/icons'

// ข้อมูลของกล่อง
const cards = ref([
  {
    img: 'https://resource.logitechg.com/w_1206,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/ghub-update/2024-update/g-hub-tips-and-tricks-5.jpg?v=1',
    title: 'ประสบการณ์ใหม่',
    description: 'อุปกรณ์เกมมิ่งคุณภาพสูง เช่น คีย์บอร์ด เมาส์ และหูฟังที่ตอบสนองดี',
  },
  {
    img: 'https://pbs.twimg.com/media/GcHuavAWQAAMkxR?format=jpg&name=large',
    title: 'ดีไซน์ที่ทันสมัย',
    description: 'อุปกรณ์ที่มีการออกแบบสวยงามและใช้งานได้สะดวก พร้อมไฟ RGB',
  },
  {
    img: 'https://cdn.mos.cms.futurecdn.net/FUYAofwatKBmPuUzXDNM83.jpg',
    title: 'โปรโมชั่นสุดพิเศษ',
    description: 'ข้อเสนอและส่วนลดพิเศษสำหรับเกมเมอร์ในช่วงโปรโมชั่น',
  },
  {
    img: 'https://pbs.twimg.com/media/GYmhxEsW0AAtBkl?format=jpg&name=4096x4096',
    title: 'เทคโนโลยีใหม่',
    description: 'เทคโนโลยีล่าสุด เช่น เซ็นเซอร์จับการเคลื่อนไหวและเสียงรอบทิศทาง 3D',
  },
  {
    img: 'https://static.techspot.com/articles-info/2373/images/2021-11-23-image.jpg',
    title: 'ประสิทธิภาพสูง',
    description: 'เมาส์และคีย์บอร์ดที่ตอบสนองเร็ว ทำให้เกมของคุณไหลลื่นยิ่งขึ้น',
  },
])

const currentIndex = ref(0) // index ปัจจุบัน
const visibleCards = ref(3) // จำนวนกล่องที่แสดง

// คำนวณกล่องที่แสดงใน Carousel

const updateVisibleCards = () => {
  if (window.innerWidth >= 1100) {
    visibleCards.value = 3
  } else if (window.innerWidth < 1100 && innerWidth >= 750) {
    visibleCards.value = 2
  } else if (window.innerWidth < 750) {
    visibleCards.value = 1
  }
}

onMounted(() => {
  updateVisibleCards()
  window.addEventListener('resize', updateVisibleCards)
})

watch(() => window.innerWidth, updateVisibleCards)

const visibleSlides = computed(() => {
  const start = currentIndex.value
  const end = (currentIndex.value + visibleCards.value) % cards.value.length

  if (end > start) {
    return cards.value.slice(start, end)
  } else {
    return [...cards.value.slice(start, cards.value.length), ...cards.value.slice(0, end)]
  }
})

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + cards.value.length) % cards.value.length
}

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % cards.value.length
}
</script>

<template>
  <div class="bg-[#414141] h-full w-full pt-[25px]">
    <div class="px-6 sm:px-8 lg:px-10 max-w-[1200px] mx-auto">
      <h1 class="text-white text-[36px] sm:text-[40px] lg:text-[50px]">
        ยกระดับประสบการณ์การเล่นเกมของคุณ
      </h1>
      <p class="text-white pt-4 text-sm sm:text-base lg:text-lg leading-relaxed">
        พบกับอุปกรณ์เกมมิ่งระดับพรีเมียมที่ออกแบบมาเพื่อเกมเมอร์ตัวจริง!
        ไม่ว่าจะเป็นคีย์บอร์ดที่ตอบสนองไว, เมาส์ที่แม่นยำ, หูฟังเสียงคมชัด,
        หรือเก้าอี้เกมมิ่งเพื่อความสบายตลอดวัน เรามีทุกสิ่งที่คุณต้องการเพื่อคว้าชัยชนะในทุกเกม
        สัมผัสสินค้าคุณภาพจากแบรนด์ชั้นนำ พร้อมโปรโมชันสุดพิเศษเฉพาะที่นี่เท่านั้น!
      </p>
    </div>

    <div class="flex justify-center relative mt-[50px]">
      <!-- ปุ่มเลื่อนซ้าย -->

      <!-- กล่อง Carousel -->
      <div class="flex transition-transform duration-500 ease-in-out justify-center items-center">
        <button class="transform bg-gray-500 text-white p-2 rounded-full z-20" @click="prevSlide">
          <IonIcon :icon="arrowBackOutline" />
        </button>

        <div
          class="w-[300px] h-[300px] flex-shrink-0 mx-2 bg-white rounded-[20px] shadow-lg select-"
          v-for="(card, index) in visibleSlides"
          :key="index"
        >
          <img
            :src="card.img"
            alt="Card Image"
            class="w-full h-[150px] object-cover pointer-events-none select-none rounded-t-[20px]"
          />
          <div class="pr-7 pl-7 pt-2 select-none">
            <h3 class="font-bold text-[25px] mb-[20px]">{{ card.title }}</h3>
            <p>{{ card.description }}</p>
          </div>
        </div>
        <button class="transform bg-gray-500 text-white p-2 rounded-full z-20" @click="nextSlide">
          <IonIcon :icon="arrowForwardOutline" />
        </button>
      </div>

      <!-- ปุ่มเลื่อนขวา -->
    </div>

    <div class="flex justify-center mt-4">
      <span
        v-for="(card, index) in cards"
        :key="'dot-' + index"
        @click="currentIndex = index"
        class="w-3 h-3 mx-1 rounded-full cursor-pointer"
        :class="{
          'bg-[#7194ff]': currentIndex === index,
          'bg-gray-300': currentIndex !== index,
        }"
      ></span>
    </div>

    <div class="h-[700px]"></div>
    <footer class="bg-[#202020] text-white py-5">
      <div class="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- ส่วนของข้อมูลลิขสิทธิ์ -->
        <div class="mb-4">
          <p class="text-sm">&copy; 2024 Your Company. All rights reserved.</p>
        </div>

        <!-- ส่วนของลิงก์ -->
        <div class="mb-4">
          <h3 class="font-semibold text-lg mb-2">Quick Links</h3>
          <ul class="flex space-x-6 text-gray-400 text-sm">
            <li><a href="#" class="hover:text-white">Home</a></li>
            <li><a href="#" class="hover:text-white">About</a></li>
            <li><a href="#" class="hover:text-white">Services</a></li>
            <li><a href="#" class="hover:text-white">Contact</a></li>
          </ul>
        </div>

        <!-- ส่วนของข้อมูลติดต่อ -->
        <div class="mb-4">
          <h3 class="font-semibold text-lg mb-2">Contact Us</h3>
          <p class="text-gray-400 text-sm">+1 (234) 567-890</p>
          <p class="text-gray-400 text-sm">email@example.com</p>
        </div>

        <!-- ส่วนของที่อยู่ -->
        <div class="mb-4">
          <h3 class="font-semibold text-lg mb-2">Our Address</h3>
          <p class="text-gray-400 text-sm">1234 Street Name, City, Country</p>
        </div>
      </div>
    </footer>
  </div>
</template>
