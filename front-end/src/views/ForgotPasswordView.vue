<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const loading = ref(false)
const success = ref(false)

const onSubmit = async () => {
  loading.value = true
  // Mock API call
  setTimeout(() => {
    loading.value = false
    success.value = true
  }, 1000)
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900 px-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-extrabold text-gray-900">Forgot Password</h2>
        <p class="mt-2 text-sm text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
        If an account exists for {{ email }}, you will receive a password reset link shortly.
      </div>

      <form v-else @submit.prevent="onSubmit" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
          <div class="mt-1">
            <input id="email" v-model="email" name="email" type="email" autocomplete="email" required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="you@example.com" />
          </div>
        </div>

        <div>
          <button type="submit" :disabled="loading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
            <span v-if="loading">Sending...</span>
            <span v-else>Send reset link</span>
          </button>
        </div>
      </form>

      <div class="mt-6 text-center">
        <router-link to="/login" class="font-medium text-indigo-600 hover:text-indigo-500 text-sm">
          Back to login
        </router-link>
      </div>
    </div>
  </div>
</template>
