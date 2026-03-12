<script setup lang="ts">
const { show, message, type } = defineProps<{
  show: boolean
  message?: string
  type?: 'save' | 'delete'
}>()

const emit = defineEmits(['confirm', 'cancel'])

function onConfirm() {
  emit('confirm')
}

function onCancel() {
  emit('cancel')
}
</script>

<template>
  <div v-if="show" class="overlay">
    <div class="dialog">
      <h3 class="title">
        {{ type === 'delete' ? 'Delete Confirmation' : 'Save Confirmation' }}
      </h3>

      <p class="message">
        {{ message }}
      </p>

      <div class="actions">
        <button class="btn cancel" @click="onCancel">Cancel</button>

        <button class="btn" :class="type === 'delete' ? 'delete' : 'save'" @click="onConfirm">
          {{ type === 'delete' ? 'Delete' : 'Save' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 320px;
  text-align: center;
}

.title {
  margin-bottom: 10px;
}

.message {
  margin-bottom: 20px;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.btn {
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: white;
}

.cancel {
  background: #ccc;
  color: black;
}

.save {
  background: #4caf50;
}

.delete {
  background: #e53935;
}
</style>
