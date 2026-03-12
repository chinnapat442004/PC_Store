<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { onMounted, ref } from 'vue'

const userStore = useUserStore()
const showDialog = ref(false)
onMounted(async () => {
  await userStore.getUsers()
})
</script>

<template>
  <div class="pl-[200px] w-full">
    <div class="h-full bg-[#414141] lg:px-[20px] min-h-screen pt-6">
      <div class="flex h-full justify-between">
        <h1 class="text-3xl font-bold text-white mb-6">User Management</h1>
        <button
          class="bg-blue-500 px-3 py-1 rounded text-sm hover:bg-blue-600"
          @click="showDialog = true"
        >
          Create
        </button>
      </div>
      <!-- Table -->
      <div class="bg-white rounded-lg overflow-hidden">
        <table class="w-full text-left text-black">
          <!-- Header -->
          <thead class="bg-[#383838] text-gray-300 text-sm uppercase">
            <tr>
              <th class="px-6 py-3">Name</th>
              <th class="px-6 py-3">Email</th>
              <th class="px-6 py-3">Role</th>
              <th class="px-6 py-3">Status</th>
              <th class="px-6 py-3 flex justify-center items-center">Action</th>
            </tr>
          </thead>

          <tbody class="divide-y">
            <tr v-for="user in userStore.users" :key="user.user_id">
              <td class="px-6 py-4">{{ user.name }}</td>
              <td class="px-6 py-4">{{ user.email }}</td>
              <td class="px-6 py-4">{{ user.role }}</td>

              <!-- <td class="px-6 py-4">
                <span class="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                  {{ user.status }}
                </span>
              </td> -->
              <td></td>

              <td class="px-6 py-4 flex justify-center items-center space-x-2">
                <button class="edit-btn">
                  <span class="pi pi-pencil"></span>
                </button>

                <!-- <i class="pi pi-trash"></i> -->
                <button class="delete-btn">
                  <span class="pi pi-trash"></span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div v-if="showDialog" class="overlay">
    <div class="dialog">
      <h2>Create Employee</h2>
      <p>Hello this is dialog</p>
      <input type="text" />
      <input type="text" />
      <input type="text" />
      <div class="flex justify-center gap-4">
        <button class="bg-red-500 text-white px-4 py-2 rounded" @click="showDialog = false">
          Close
        </button>
        <button class="bg-green-500 text-white px-4 py-2 rounded" @click="showDialog = false">
          Save
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 500px;
}
</style>
