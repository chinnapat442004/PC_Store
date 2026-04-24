<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { onMounted, ref } from 'vue'
import ConfirmComponent from '@/components/dialogs/ConfirmComponent.vue'
import type { User } from '@/types/User'
import { useAuthStore } from '@/stores/auth'
import { useLoadingStore } from '@/stores/loading'
import LoadingComponent from '@/components/LoadingComponent.vue'
import { computed } from 'vue'
import { useBranchStore } from '@/stores/branch'



const loadingStore = useLoadingStore()
const userStore = useUserStore()
const showDialog = ref(false)
const search = ref('')
const showConfirm = ref(false)
const deleteConfirm = ref(false)
const authStore = useAuthStore()
const branchStore = useBranchStore()

onMounted(async () => {
  await userStore.getUsers()
  await authStore.getCurrentUser()
  await branchStore.getBranches()
})





const formUser = computed(() => {
  return mode.value === 'create' ? userStore.createUser : userStore.editedUser
})

const mode = ref<'create' | 'edit'>('create')

const openEdit = (user: User) => {
  mode.value = 'edit'
  userStore.editedUser = { ...user }

  if (authStore.user?.role === 'admin') {
    userStore.createUser.role = 'manager'
  }

  if (authStore.user?.role === 'manager') {
    userStore.createUser.role = 'staff'
  }
  showDialog.value = true
}



const saveUser = async () => {

  if (mode.value === 'create') {

    await userStore.addUser(userStore.createUser)

    userStore.clearCreateUser()
  } else if (mode.value === 'edit' && userStore.editedUser) {
    await userStore.updateUser(userStore.editedUser)
    userStore.clearUser()
  }

  await userStore.getUsers()

  showDialog.value = false
  showConfirm.value = false
}
const closeDialog = () => {
  userStore.clearUser()
  showDialog.value = false
}

const openCreateDialog = () => {
  mode.value = 'create'
  userStore.clearCreateUser()
  if (authStore.user?.role === 'admin') {
    userStore.createUser.role = 'manager'
  }

  if (authStore.user?.role === 'manager') {
    userStore.createUser.role = 'staff'
  }

  showDialog.value = true
}

const nextPage = async () => {
  if (userStore.page < userStore.lastPage) {
    userStore.page++
    await userStore.getUsers()
  }
}

const prevPage = async () => {
  if (userStore.page > 1) {
    userStore.page--
    await userStore.getUsers()
  }
}

const searchUser = async () => {
  userStore.search = search.value
  await userStore.getUsers()
}



const closeDialogDelete = async () => {
  deleteConfirm.value = false
  userStore.clearUser()
}

const clearSearch = async () => {
  search.value = ''
  userStore.search = ''
  userStore.page = 1
  await userStore.getUsers()
}
</script>

<template>


  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold text-white">User Management</h1>

    <div class="flex items-center gap-3">
      <input type="text" placeholder="Search User..." v-model="search" class="border px-3 py-2 rounded w-64" />

      <button class="bg-white/10 hover:bg-white/20 text-white p-2 rounded-md flex items-center justify-center"
        @click="searchUser()">
        <span class="pi pi-search text-lg"></span>
      </button>
      <button class="bg-white/10 hover:bg-white/20 text-white p-2 rounded-md flex items-center justify-center"
        @click="clearSearch()">
        <span class="pi pi-times text-lg"></span>
      </button>
      <button
        class="flex items-center gap-2 bg-[#637aad] hover:bg-[#4a68a8]  text-white px-4 py-2 rounded-md  transition"
        @click="openCreateDialog()">
        <span class="pi pi-plus text-lg"></span>
        <span>Create</span>
      </button>
    </div>
  </div>


  <div class="bg-white rounded-lg overflow-hidden">
    <table class="w-full text-left text-black">
      <thead class="bg-[#383838] text-gray-300 text-sm">
        <tr>
          <th class="px-6 py-3">ชื่อผู้ใช้</th>
          <th class="px-6 py-3">อีเมล</th>
          <th class="px-6 py-3">บทบาท</th>
          <th class="px-6 py-3">สถานะการใช้งาน</th>
          <th class="px-6 py-3">สาขา</th>
          <th class="px-6 py-3 text-center">จัดการ</th>
        </tr>
      </thead>

      <tbody class="divide-y">
        <tr v-if="userStore.users.length === 0">
          <td colspan="4" class="text-center py-6 text-gray-500">ไม่พบข้อมูลที่ค้นหา</td>
        </tr>

        <tr v-else v-for="user in userStore.users" :key="user.user_id">
          <td class="px-6 py-1">{{ user.name }}</td>
          <td class="px-6 py-1">{{ user.email }}</td>
          <td class="px-6 py-1">{{ user.role }}</td>
          <td class="px-6 py-1">{{ user.enabled }}</td>
          <td v-if="user.branch" class="px-6 py-1">{{ user.branch.branch_name }}</td>



          <td class="px-6 py-3 flex justify-center space-x-2">
            <button class="edit-btn" @click="openEdit(user)">
              <span class="pi pi-pencil"></span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="flex justify-end items-center gap-4 py-4 border-t mr-3">
      <button class="px-3 py-1 border rounded hover:bg-gray-100" @click="prevPage()">
        <span class="pi pi-chevron-left text-sm"></span> Prev
      </button>

      <span class="text-sm text-gray-600">
        {{ userStore.page }} of {{ userStore.lastPage }}</span>

      <button class="px-3 py-1 border rounded hover:bg-gray-100" @click="nextPage()">
        Next <span class="pi pi-chevron-right text-sm"></span>
      </button>
    </div>
  </div>



  <!-- Dialog -->
  <div v-if="showDialog && formUser" class="overlay">
    <div class="dialog">
      <h2 class="text-lg font-semibold mb-4">
        {{ mode === 'create' ? 'Create User' : 'Edit User' }}
      </h2>

      <!-- Name -->
      <div v-if="mode === 'create'" class="mb-3">
        <label>User Name</label>
        <input v-model="userStore.createUser.name" type="text" placeholder="Enter user name"
          class="border w-full px-3 py-2 rounded bg-gray-50" />
      </div>

      <!-- Name -->
      <div v-if="mode === 'edit' && userStore.editedUser" class="mb-3">
        <label>User Name</label>
        <input v-model="userStore.editedUser.name" type="text" placeholder="Enter user name"
          class="border w-full px-3 py-2 rounded bg-gray-50" />
      </div>

      <!-- Email  -->
      <div v-if="mode === 'create'" class="mb-3">
        <label>Email</label>
        <input v-model="userStore.createUser.email" type="email" placeholder="Enter email"
          class="border w-full px-3 py-2 rounded bg-gray-50" />
      </div>

      <div v-if="mode === 'edit' && userStore.editedUser" class="mb-3">
        <label>Email</label>
        <input v-model="userStore.editedUser.email" type="email" placeholder="Enter email"
          class="border w-full px-3 py-2 rounded bg-gray-50" />
      </div>
      <div v-if="mode === 'create'" class="mb-3">
        <label>Password</label>
        <input v-model="userStore.createUser.password" type="password" placeholder="Enter password"
          class="border w-full px-3 py-2 rounded bg-gray-50" />
      </div>

      <div class="mb-3">
        <label>Role</label>
        <input v-model="formUser.role" class="border w-full px-3 py-2 rounded bg-gray-200" disabled />
      </div>
      <div v-if="mode === 'create'" class="mb-3">
        <label>Branch</label>

        <select v-model="userStore.createUser.branch_id" class="border w-full px-3 py-2 rounded bg-gray-50">
          <option value="" disabled>Select branch</option>

          <option v-for="b in branchStore.branches" :key="b.branch_id" :value="b.branch_id">
            {{ b.branch_name }}
          </option>
        </select>
      </div>
      <div v-if="mode === 'edit' && userStore.editedUser" class="mb-3">
        <label>Branch</label>

        <select v-model="userStore.editedUser.branch.branch_id" class="border w-full px-3 py-2 rounded bg-gray-50">
          <option value="" disabled>Select branch</option>

          <option v-for="b in branchStore.branches" :key="b.branch_id" :value="b.branch_id">
            {{ b.branch_name }}
          </option>
        </select>
      </div>
      <div v-if="mode === 'edit' && userStore.editedUser" class="mb-3">
        <label>Enabled</label>
        <select v-model="userStore.editedUser.enabled" class="border w-full px-3 py-2 rounded">
          <option :value="true">Enabled</option>
          <option :value="false">Disabled</option>
        </select>
      </div>

      <div class="flex justify-center gap-4">
        <button class="bg-red-500 text-white px-4 py-1 rounded" @click="closeDialog()">
          Close
        </button>

        <button class="bg-green-500 text-white px-4 py-1 rounded" @click="showConfirm = true">
          Save
        </button>


      </div>
    </div>
  </div>

  <ConfirmComponent :show="showConfirm" type="save" message="คุณต้องการที่จะบันทึกข้อมูลนี้" @confirm="saveUser()"
    @cancel="showConfirm = false" />

  <ConfirmComponent :show="deleteConfirm" type="delete" message="คุณต้องการที่จะลบข้อมูลนี้ใช่หรือไม่"
    @cancel="closeDialogDelete()" />
  <LoadingComponent v-model="loadingStore.loading" />
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
  border-radius: 10px;
}

.dialog {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 500px;
  overflow-y: auto;
  max-height: 90vh;
}
</style>
