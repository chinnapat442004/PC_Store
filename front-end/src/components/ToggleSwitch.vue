<template>
  <label class="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" class="sr-only peer" :checked="modelValue" @change="onChange" />

    <div
      class="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#637aad]"
    ></div>

    <span
      v-if="showLabel"
      class="ml-2 text-sm font-medium"
      :class="modelValue ? 'text-gray-900' : 'text-gray-400'"
    >
      {{ modelValue ? activeText : inactiveText }}
    </span>
  </label>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  activeText?: string
  inactiveText?: string
  showLabel?: boolean
}

withDefaults(defineProps<Props>(), {
  activeText: 'เปิด',
  inactiveText: 'ปิด',
  showLabel: true,
})

const emit = defineEmits(['update:modelValue', 'change'])

const onChange = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked
  emit('update:modelValue', checked)
  emit('change', checked)
}
</script>
