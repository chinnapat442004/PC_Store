import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify'

const app = createApp(App)
app.component('VueSlider', VueSlider)

app.use(createPinia())
app.use(router)
app.use(Vue3Toastify, {
  autoClose: 2400,
} as ToastContainerOptions)

app.mount('#app')
