<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { onMounted, ref, watch } from 'vue'
import ConfirmComponent from '@/components/dialogs/ConfirmComponent.vue'
import type { CreateUser, User } from '@/types/User'
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

const branchStore = useBranchStore()
import { useForm } from 'vee-validate'
import * as yup from 'yup'

onMounted(async () => {
  await userStore.getUsers()
})



const authStore = useAuthStore()

// create schema
const createUserSchema = yup.object({
  name: yup.string().required('กรุณากรอกชื่อผู้ใช้'),
  email: yup
    .string()
    .required('กรุณากรอกอีเมล')
    .email('รูปแบบอีเมลไม่ถูกต้อง'),
  password: yup.string().required('กรุณากรอกรหัสผ่าน'),
  confirm_password: yup
    .string()
    .required('กรุณายืนยันรหัสผ่าน')
    .oneOf([yup.ref('password')], 'รหัสผ่านไม่ตรงกัน'),
  branch_id: authStore.user?.role === 'admin'
    ? yup.number().required('กรุณาเลือกสาขา')
    : yup.number().nullable().notRequired(),
})

// edit schema
const editUserSchema = yup.object({
  name: yup.string().required('กรุณากรอกชื่อผู้ใช้'),
  email: yup
    .string()
    .required('กรุณากรอกอีเมล')
    .email('รูปแบบอีเมลไม่ถูกต้อง'),
  password: yup.string().nullable().notRequired(),
})

// create form
const {
  errors: createErrors,
  defineField: defineFieldCreate,
  setFieldValue: setFieldValueCreate,
  validate: validateCreate,
  resetForm: resetFormCreate,
} = useForm({
  validationSchema: createUserSchema,
  validateOnMount: false,
})

// edit form
const {
  errors: editErrors,
  defineField: defineFieldEdit,
  setFieldValue: setFieldValueEdit,
  validate: validateEdit,
  resetForm: resetFormEdit,
} = useForm({
  validationSchema: editUserSchema,
  validateOnMount: false,
})

const [nameCreate] = defineFieldCreate('name')
const [emailCreate] = defineFieldCreate('email')
const [passwordCreate] = defineFieldCreate('password')
const [branchCreate] = defineFieldCreate('branch_id')
const [confirmPasswordCreate] = defineFieldCreate('confirm_password')

const [nameEdit] = defineFieldEdit('name')
const [emailEdit] = defineFieldEdit('email')
const [passwordEdit] = defineFieldEdit('password')



const formUser = computed(() => {
  return mode.value === 'create' ? userStore.createUser : userStore.editedUser
})

const mode = ref<'create' | 'edit'>('create')

const openEdit = (user: User) => {
  mode.value = 'edit'
  userStore.editedUser = { ...user, password: '' }
  resetFormEdit({
    values: {
      name: user.name,
      email: user.email,
      password: '',
    }
  })
  showDialog.value = true
}

const preSave = async () => {
  if (mode.value === 'create') {
    const { valid } = await validateCreate()
    if (!valid) return
  } else {
    const { valid } = await validateEdit()
    if (!valid) return
  }
  showConfirm.value = true
}

const saveUser = async () => {
  try {
    if (mode.value === 'create') {
      const payload = {
        name: nameCreate.value,
        email: emailCreate.value,
        password: passwordCreate.value,
        confirm_password: confirmPasswordCreate.value,
        branch_id:
          authStore.user?.role === 'admin'
            ? branchCreate.value
            : authStore.user?.branch?.branch_id,
      }

      await userStore.createUser(payload as CreateUser)
    } else if (mode.value === 'edit' && userStore.editedUser) {
      const payload = {
        ...userStore.editedUser,
        name: nameEdit.value,
        email: emailEdit.value,
        password: passwordEdit.value,
        enabled: userStore.editedUser?.enabled,
      }

      await userStore.updateUserByAdmin(payload)
    }

    await userStore.getUsers()
    showDialog.value = false
    showConfirm.value = false
  } catch (err: any) {
    const status = err?.response?.status


    if (status === 409) {
      setFieldValueCreate('email', 'อีเมลนี้ถูกใช้งานแล้ว')
    }
  }
}
const closeDialog = () => {
  userStore.clearUser()
  showDialog.value = false
}

const openCreateDialog = async () => {
  mode.value = 'create'
  await branchStore.getBranches()
  resetFormCreate()
  if (authStore.user?.role === 'manager' && authStore.user.branch) {
    setFieldValueCreate('branch_id', authStore.user.branch.branch_id)
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
      <input type="text" placeholder="ค้นหาผู้ใช้..." v-model="search" class="border px-3 py-2 rounded w-64" />

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
        <span>เพิ่มผู้ใช้</span>
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
          <td colspan="6" class="text-center py-6 text-gray-500">
            ไม่พบข้อมูล
          </td>
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

    <div class="flex justify-end items-center gap-4 py-4 border-t mr-3">
      <button class="px-3 py-1 border rounded hover:bg-gray-100" @click="prevPage()">
        <span class="pi pi-chevron-left text-sm"></span> ก่อนหน้า
      </button>

      <span class="text-sm text-gray-600">
        {{ userStore.page }} จาก {{ userStore.lastPage }}</span>

      <button class="px-3 py-1 border rounded hover:bg-gray-100" @click="nextPage()">
        ถัดไป <span class="pi pi-chevron-right text-sm"></span>
      </button>
    </div>
  </div>

  <div v-if="showDialog && formUser" class="overlay">
    <div class="dialog">
      <h2 class="text-lg font-semibold mb-4">
        {{ mode === 'create' ? 'เพิ่มผู้ใช้' : 'แก้ไขผู้ใช้' }}
      </h2>

      <template v-if="mode === 'create'">
        <div class="mb-3">
          <label class="text-sm font-medium">ชื่อผู้ใช้</label>
          <input v-model="nameCreate" type="text" placeholder="กรอกชื่อผู้ใช้"
            class="border w-full px-3 py-2 rounded bg-gray-50" :class="{ 'border-red-500': createErrors.name }" />
          <p v-if="createErrors.name" class="text-red-500 text-xs mt-1">{{ createErrors.name }}</p>
        </div>

        <div class="mb-3">
          <label class="text-sm font-medium">อีเมล</label>
          <input v-model="emailCreate" type="email" placeholder="กรอกอีเมล"
            class="border w-full px-3 py-2 rounded bg-gray-50" :class="{ 'border-red-500': createErrors.email }" />
          <p v-if="createErrors.email" class="text-red-500 text-xs mt-1">{{ createErrors.email }}</p>
        </div>

        <div class="mb-3">
          <label class="text-sm font-medium">รหัสผ่าน</label>
          <input v-model="passwordCreate" type="password" placeholder="กรอกรหัสผ่าน"
            class="border w-full px-3 py-2 rounded bg-gray-50" :class="{ 'border-red-500': createErrors.password }" />
          <p v-if="createErrors.password" class="text-red-500 text-xs mt-1">{{ createErrors.password }}</p>
        </div>

        <div class="mb-3">
          <label class="text-sm font-medium">ยืนยันรหัสผ่าน</label>
          <input v-model="confirmPasswordCreate" type="password" placeholder="ยืนยันรหัสผ่าน"
            class="border w-full px-3 py-2 rounded bg-gray-50"
            :class="{ 'border-red-500': createErrors.confirm_password }" />
          <p v-if="createErrors.confirm_password" class="text-red-500 text-xs mt-1">
            {{ createErrors.confirm_password }}
          </p>
        </div>

        <div v-if="authStore.user?.role === 'admin'" class="mb-3">
          <label class="text-sm font-medium">สาขา</label>
          <select v-model="branchCreate" class="border w-full px-3 py-2 rounded bg-gray-50"
            :class="{ 'border-red-500': createErrors.branch_id }">
            <option value="" disabled>เลือกสาขา</option>
            <option v-for="b in branchStore.branches" :key="b.branch_id" :value="b.branch_id">
              {{ b.branch_name }}
            </option>
          </select>
          <p v-if="createErrors.branch_id" class="text-red-500 text-xs mt-1">{{ createErrors.branch_id }}</p>
        </div>
      </template>

      <template v-else-if="mode === 'edit' && userStore.editedUser">
        <div class="mb-3">
          <label class="text-sm font-medium">ชื่อผู้ใช้</label>
          <input v-model="nameEdit" type="text" placeholder="กรอกชื่อผู้ใช้"
            class="border w-full px-3 py-2 rounded bg-gray-50" :class="{ 'border-red-500': editErrors.name }" />
          <p v-if="editErrors.name" class="text-red-500 text-xs mt-1">{{ editErrors.name }}</p>
        </div>

        <div class="mb-3">
          <label class="text-sm font-medium">อีเมล</label>
          <input v-model="emailEdit" type="email" placeholder="กรอกอีเมล"
            class="border w-full px-3 py-2 rounded bg-gray-50" :class="{ 'border-red-500': editErrors.email }" />
          <p v-if="editErrors.email" class="text-red-500 text-xs mt-1">{{ editErrors.email }}</p>
        </div>

        <div class="mb-4">
          <label class="text-sm font-medium text-gray-700">รหัสผ่านใหม่</label>
          <div class="mt-1 border rounded-lg p-3 bg-gray-50">
            <input v-model="passwordEdit" type="password" placeholder="เว้นว่างหากไม่ต้องการเปลี่ยนรหัสผ่าน"
              class="w-full px-3 py-2 rounded bg-white border" />
            <p class="text-xs text-gray-500 mt-1">
              หากไม่ต้องการเปลี่ยนรหัสผ่าน ให้เว้นว่างไว้
            </p>
          </div>
        </div>

        <div class="mb-3">
          <label class="text-sm font-medium">สาขา</label>
          <input :value="userStore.editedUser.branch?.branch_name" type="text"
            class="border w-full px-3 py-2 rounded bg-gray-100 cursor-not-allowed" readonly />
        </div>

        <div class="mb-4">
          <label class="text-sm font-medium">สถานะ</label>
          <select v-model="userStore.editedUser.enabled" class="border w-full px-3 py-2 rounded bg-gray-50">
            <option :value="true">เปิดใช้งาน</option>
            <option :value="false">ปิดใช้งาน</option>
          </select>
        </div>
      </template>

      <div class="flex justify-center gap-4">
        <button class="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition" @click="closeDialog()">
          ยกเลิก
        </button>

        <button class="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition" @click="preSave()">
          บันทึก
        </button>
      </div>
    </div>
  </div>

  <ConfirmComponent :show="showConfirm" type="save" message="คุณต้องการบันทึกข้อมูลนี้ใช่หรือไม่" @confirm="saveUser()"
    @cancel="showConfirm = false" />

  <ConfirmComponent :show="deleteConfirm" type="delete" message="คุณต้องการลบข้อมูลนี้ใช่หรือไม่"
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