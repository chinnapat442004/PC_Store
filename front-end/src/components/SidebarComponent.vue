<script lang="ts" setup>
import { nextTick, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useRoute } from 'vue-router'

const route = useRoute()

const page = computed(() => route.name)
</script>
<template>
  <div class="bg-[#202020] w-[200px] h-screen fixed">
    <ul class="flex flex-col gap-2 px-2 py-4">
      <li
        @click="
          async () => {
            page = 'dashboard'
            await nextTick()
          }
        "
      >
        <router-link
          :to="{ name: 'dashboard' }"
          class="flex hover:bg-[#979dac] hover:text-black duration-300 rounded-[5px] p-3"
          :class="
            page === 'dashboard'
              ? 'md:bg-[#979dac] bg-[#6d717a]  text-black '
              : 'md:bg-[#202020] md:text-white bg-[#a0a0a1]'
          "
          >Dashboard</router-link
        >
      </li>
      <li>
        <router-link
          to="/editproduct"
          class="flex hover:bg-[#979dac] hover:text-black duration-300 rounded-[5px] p-3"
          :class="
            page === 'editproduct'
              ? 'md:bg-[#979dac] bg-[#6d717a]  text-black '
              : 'md:bg-[#202020] md:text-white bg-[#a0a0a1]'
          "
          >Product Management</router-link
        >
      </li>
      <li>
        <router-link
          to="/user"
          class="flex hover:bg-[#979dac] hover:text-black duration-300 rounded-[5px] p-3"
          :class="
            page === 'user'
              ? 'md:bg-[#979dac] bg-[#6d717a]  text-black '
              : 'md:bg-[#202020] md:text-white bg-[#a0a0a1]'
          "
          >User Management</router-link
        >
      </li>
      <li>
        <router-link
          to="/branch"
          class="flex hover:bg-[#979dac] hover:text-black duration-300 rounded-[5px] p-3"
          :class="
            page === 'branch'
              ? 'md:bg-[#979dac] bg-[#6d717a]  text-black '
              : 'md:bg-[#202020] md:text-white bg-[#a0a0a1]'
          "
          >Branch Management</router-link
        >
      </li>
    </ul>
  </div>

  <!-- เนื้อหาหลักจะเลื่อนไป 200px เพื่อหลีกเลี่ยง Sidebar -->
</template>

<style scoped></style>
