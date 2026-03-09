<script setup lang="ts"></script>

<script setup lang="ts"></script>

<template>
  <div class="pl-[200px] w-full">
    <div class="h-full bg-[#414141] lg:px-[20px] min-h-screen pt-6">
      <div class="flex h-full justify-between">
        <h1 class="text-3xl font-bold text-white mb-6">User Management</h1>
        <button class="bg-blue-500 px-3 py-1 rounded text-sm hover:bg-blue-600">Create</button>
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
              <th class="px-6 py-3">Action</th>
            </tr>
          </thead>

          <!-- Body -->
          <tbody class="divide-y">
            <tr>
              <td class="px-6 py-4">John Doe</td>
              <td class="px-6 py-4">john@example.com</td>
              <td class="px-6 py-4">Admin</td>
              <td class="px-6 py-4">
                <span class="bg-green-500 text-white text-xs px-3 py-1 rounded-full"> Active </span>
              </td>
              <td class="px-6 py-4 space-x-2">
                <button class="bg-blue-500 px-3 py-1 rounded text-sm hover:bg-blue-600">
                  Edit
                </button>
                <button class="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-600">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
