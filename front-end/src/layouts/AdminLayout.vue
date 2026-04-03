<script setup lang="ts">
import Sidebar from '@/components/SidebarComponent.vue'
</script>

<template>
 <Sidebar/>
<div class="pl-[240px] w-full">
     <div class="h-full  lg:px-[20px] min-h-screen pt-6">
    
    <router-view />

    </div>
  </div>
</template>