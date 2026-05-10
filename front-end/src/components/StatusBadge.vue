<template>
  <span
    :class="[
      'px-2 py-1 rounded-full text-xs font-semibold',
      modelValue ? activeClass : inactiveClass,
    ]"
  >
    {{ modelValue ? activeText : inactiveText }}
  </span>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  activeText?: string
  inactiveText?: string
  activeClass?: string
  inactiveClass?: string
}

withDefaults(defineProps<Props>(), {
  activeText: 'เปิดใช้งาน',
  inactiveText: 'ปิดใช้งาน',
  activeClass: 'bg-green-100 text-green-600',
  inactiveClass: 'bg-gray-200 text-gray-500',
})
</script>
