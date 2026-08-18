<script setup>
import { ref, computed, onMounted } from 'vue'
import { timeslotsService } from '../services/timeslots.service'

// Podaci ucitani sa servisa (mock za sada) - prostorije i svi termini
const services = ref([])
const timeSlots = ref([])

// Koja prostorija je trenutno izabrana (tab) - postavlja se na prvu ucitanu
const selectedServiceId = ref(null)

// Fiksiramo godinu/mesec koji prikazujemo (mesec je 0-indeksiran, 7 = Avgust)
const year = 2026
const month = 7

onMounted(async () => {
  services.value = await timeslotsService.getServices()
  timeSlots.value = await timeslotsService.getTimeSlots()
  if (services.value.length) {
    selectedServiceId.value = services.value[0].id
  }
})

// Klik na tab prostorije - menja izabranu prostoriju i resetuje izabran dan/termin
// (da ne ostane "zaglavljen" prikaz termina iz prethodno izabrane prostorije)
function selectService(id) {
  selectedServiceId.value = id
  selectedDay.value = null
  selectedSlotId.value = null
}

// Racunamo koliko dana ima trenutni mesec (npr. 31 za avgust)
const daysInMonth = computed(() => new Date(year, month + 1, 0).getDate())

// Racunamo koliko praznih celija treba na pocetku grid-a, da bi se datum 1.
// poklopio sa ispravnim danom u nedelji (nas kalendar pocinje od Ponedeljka)
const leadingEmptyDays = computed(() => {
  const firstDayWeekday = new Date(year, month, 1).getDay() // 0=Ned, 1=Pon...6=Sub
  return (firstDayWeekday + 6) % 7 // pretvaramo da Ponedeljak bude prvi (0)
})

// Lista brojeva dana za prikaz (1, 2, 3 ... daysInMonth)
const days = computed(() =>
  Array.from({ length: daysInMonth.value }, (_, i) => i + 1)
)

// Pretvara broj dana (npr. 19) u ISO string '2026-08-19' da bismo ga poredili
// sa datumima u mock podacima
function isoDate(day) {
  const mm = String(month + 1).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  return `${year}-${mm}-${dd}`
}

// Vraca sve termine za dati dan I trenutno izabranu prostoriju
function slotsForDay(day) {
  const date = isoDate(day)
  return timeSlots.value.filter(
    (slot) => slot.serviceId === selectedServiceId.value && slot.date === date
  )
}

// Racuna status dana za bojenje kalendara:
// 'none'   - nema definisanih termina tog dana za ovu prostoriju
// 'red'    - svi termini zauzeti
// 'yellow' - deo termina slobodan, deo zauzet
// 'green'  - svi termini slobodni
function dayStatus(day) {
  const slots = slotsForDay(day)
  if (slots.length === 0) return 'none'
  const availableCount = slots.filter((s) => s.isAvailable).length
  if (availableCount === 0) return 'red'
  if (availableCount === slots.length) return 'green'
  return 'yellow'
}

// Izabran dan (broj) i izabran termin (id) - null znaci "nista izabrano"
const selectedDay = ref(null)
const selectedSlotId = ref(null)

function selectDay(day) {
  selectedDay.value = day
  selectedSlotId.value = null
}

function selectSlot(slot) {
  if (!slot.isAvailable) return // zauzeti termini se ne mogu izabrati
  selectedSlotId.value = slot.id
}

// Termini za trenutno izabran dan - ovo se prikazuje ispod kalendara
const currentDaySlots = computed(() => {
  if (!selectedDay.value) return []
  return slotsForDay(selectedDay.value)
})
</script>

<template>
  <div class="rounded-2xl border p-6" style="border-color: var(--line); background: var(--surface);">

    <!-- Tabovi za biranje prostorije -->
    <div class="flex gap-2 mb-6">
      <button
        v-for="service in services"
        :key="service.id"
        @click="selectService(service.id)"
        class="px-4 py-2 rounded-full text-sm cursor-pointer transition"
        :class="selectedServiceId === service.id ? 'text-white' : ''"
        :style="selectedServiceId === service.id
          ? 'background: var(--accent)'
          : 'border: 1px solid var(--line); color: var(--ink-soft)'"
      >
        {{ service.name }}
      </button>
    </div>

    <div class="flex items-center justify-between mb-5">
      <span class="font-display italic text-lg">Avgust 2026</span>
    </div>

    <div class="grid grid-cols-7 gap-1 text-center text-xs mb-3" style="color: var(--ink-soft);">
      <span>Pon</span><span>Uto</span><span>Sre</span><span>Čet</span>
      <span>Pet</span><span>Sub</span><span>Ned</span>
    </div>

    <!-- Kalendar dana - obojeni po statusu dostupnosti (dayStatus funkcija) -->
    <div class="grid grid-cols-7 gap-1 mb-6">
      <div v-for="n in leadingEmptyDays" :key="'empty-' + n"></div>

      <div
        v-for="day in days"
        :key="day"
        @click="selectDay(day)"
        class="aspect-square flex items-center justify-center text-xs rounded-full cursor-pointer transition"
        :class="selectedDay === day ? 'text-white font-semibold' : ''"
        :style="
          selectedDay === day
            ? 'background: var(--ink)'
            : dayStatus(day) === 'green'  ? 'background: #E4F3E8; color: #2F6B3F;'
            : dayStatus(day) === 'yellow' ? 'background: #FDF3D8; color: #92720E;'
            : dayStatus(day) === 'red'    ? 'background: #FBEAEA; color: #A33A3A;'
            : 'color: var(--ink-soft);'
        "
      >
        {{ day }}
      </div>
    </div>

    <!-- Lista termina za izabrani dan -->
    <div v-if="selectedDay">
      <p class="text-xs uppercase tracking-wider mb-3" style="color: var(--ink-soft);">
        {{ selectedDay }}. avgust — termini
      </p>

      <div v-if="currentDaySlots.length === 0" class="text-sm" style="color: var(--ink-soft);">
        Nema definisanih termina za ovaj dan.
      </div>

      <div v-else class="grid grid-cols-3 gap-2">
        <div
          v-for="slot in currentDaySlots"
          :key="slot.id"
          @click="selectSlot(slot)"
          class="text-center text-sm py-2 rounded-lg border transition"
          :class="[
            slot.isAvailable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50',
            selectedSlotId === slot.id ? 'text-white font-medium' : ''
          ]"
          :style="selectedSlotId === slot.id
            ? 'background: var(--accent); border-color: var(--accent)'
            : 'border-color: var(--line); color: var(--ink-soft)'"
        >
          {{ slot.time }}
        </div>
      </div>
    </div>
  </div>
</template>