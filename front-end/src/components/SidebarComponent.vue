<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const page = computed(() => route.name)


const menus = [
  { name: 'dashboard', label: 'Dashboard', path: { name: 'dashboard' } },
  { name: 'user', label: 'User Management', path:{ name: 'user'} },
  { name: 'branch', label: 'Branch Management', path: { name:'branch'} },
  { name: 'category', label: 'Category Management', path: { name: 'category' } },
  { name: 'editproduct', label: 'Product Management', path: {name: 'editproduct'} },
]
</script>

<template>
  <div class="bg-[#202020] w-[240px] h-screen fixed">
    <ul class="flex flex-col gap-2 px-2 py-4">

      <li v-for="menu in menus" :key="menu.name">
        <router-link
          :to="menu.path"
          class="flex hover:bg-[#979dac] hover:text-black duration-300 rounded-[5px] p-3 font-semibold px-4 py-3"
          :class="page === menu.name
            ? 'md:bg-[#979dac] bg-[#2E2E2E] text-white'
            : 'md:bg-[#202020] text-white bg-[#202020]'"
        >
          {{ menu.label }}
        </router-link>
      </li>

    </ul>
  </div>
</template>