<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Map, Marker, LeafletMouseEvent } from 'leaflet'
import L from 'leaflet'

const props = defineProps<{
  lat?: number | null
  lng?: number | null
}>()

const search = ref('')

const lat = ref<number | null>(props.lat ?? null)
const lng = ref<number | null>(props.lng ?? null)

const locationSelected = ref(!!props.lat && !!props.lng)

let map: Map
let marker: Marker | null = null

const emit = defineEmits<{
  (e: 'update:location', value: { lat: number; lng: number }): void
}>()

onMounted(() => {
  const defaultLat = 13.7563
  const defaultLng = 100.5018

  map = L.map('map').setView(
    locationSelected.value ? [lat.value!, lng.value!] : [defaultLat, defaultLng],
    13,
  )

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap',
  }).addTo(map)

  // ถ้าเป็น edit → สร้าง marker เลย
  if (locationSelected.value) {
    marker = L.marker([lat.value!, lng.value!], { draggable: true }).addTo(map)

    marker.on('dragend', () => {
      const pos = marker!.getLatLng()
      lat.value = pos.lat
      lng.value = pos.lng

      emit('update:location', {
        lat: lat.value!,
        lng: lng.value!,
      })
    })
  }

  map.on('click', (e: LeafletMouseEvent) => {
    lat.value = e.latlng.lat
    lng.value = e.latlng.lng

    if (!marker) {
      marker = L.marker([lat.value, lng.value], { draggable: true }).addTo(map)

      marker.on('dragend', () => {
        const pos = marker!.getLatLng()
        lat.value = pos.lat
        lng.value = pos.lng

        emit('update:location', {
          lat: lat.value!,
          lng: lng.value!,
        })
      })
    } else {
      marker.setLatLng(e.latlng)
    }

    locationSelected.value = true

    emit('update:location', {
      lat: lat.value!,
      lng: lng.value!,
    })
  })
})

const searchLocation = async () => {
  if (!search.value) return

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${search.value}`,
  )

  const data = await res.json()

  if (data.length > 0) {
    lat.value = parseFloat(data[0].lat)
    lng.value = parseFloat(data[0].lon)

    map.setView([lat.value, lng.value], 15)

    if (!marker) {
      marker = L.marker([lat.value, lng.value], { draggable: true }).addTo(map)
    } else {
      marker.setLatLng([lat.value, lng.value])
    }

    locationSelected.value = true

    emit('update:location', {
      lat: lat.value!,
      lng: lng.value!,
    })
  }
}
</script>

<template>
  <div class="space-y-3">
    <!-- Warning เฉพาะตอน create -->
    <div
      v-if="!locationSelected"
      class="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded text-sm"
    >
      กรุณาคลิกบนแผนที่เพื่อเลือกตำแหน่งของสาขา
    </div>

    <!-- Search -->
    <div class="flex gap-2">
      <input
        v-model="search"
        placeholder="Search location..."
        class="border px-3 py-2 rounded w-full"
      />

      <button @click="searchLocation" class="bg-blue-500 text-white px-4 py-2 rounded">
        Search
      </button>
    </div>

    <!-- Map -->
    <div id="map" class="h-[300px] w-full rounded"></div>

    <!-- Lat Lng -->
    <div class="flex gap-4">
      <div class="w-full">
        <label>Latitude</label>
        <input :value="lat ?? '-'" class="border px-2 py-1 rounded w-full bg-gray-100" readonly />
      </div>

      <div class="w-full">
        <label>Longitude</label>
        <input :value="lng ?? '-'" class="border px-2 py-1 rounded w-full bg-gray-100" readonly />
      </div>
    </div>
  </div>
</template>
