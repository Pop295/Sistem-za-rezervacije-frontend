<script setup>
import { ref, computed } from 'vue'
import { timeslotsService } from '../services/timeslots.service'
import { OPENING_HOUR, CLOSING_HOUR, RESERVATION_DURATION_HOURS } from '../services/mock'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

// Primamo od roditelja (ReservationCalendar.vue): koja prostorija, koji dan/datum,
// i sve postojece rezervacije za taj dan+prostoriju
const props = defineProps({
  service: { type: Object, required: true },
  day: { type: Number, required: true },
  date: { type: String, required: true },
  reservations: { type: Array, required: true }
})

// Obavestavamo roditelja kad rezervacija uspe, da osvezi podatke sa servera/mock-a
const emit = defineEmits(['reserved'])

// Ukupno radnih sati (npr. 9h do 1h = 16h) - koristimo za racunanje pozicije
// traka i granice dostupnih vremena
const totalHours = CLOSING_HOUR + 24 - OPENING_HOUR

// Lista stolova za trenutnu prostoriju, npr. [1,2,3...10]
const tables = computed(() =>
  Array.from({ length: props.service.tableCount }, (_, i) => i + 1)
)

// Sve rezervacije za jedan konkretan sto (filtrira iz svih rezervacija tog dana)
function reservationsForTable(tableNumber) {
  return props.reservations.filter((r) => r.tableNumber === tableNumber)
}

// Pretvara "18:30" u decimalni broj sati OD POCETKA RADNOG VREMENA (npr. 9.5)
// Ako je sat pre OPENING_HOUR, znaci da je posle ponoci pa dodajemo 24h
function decimalHoursSinceOpening(hourStr, minuteStr) {
  let hour = parseInt(hourStr, 10)
  const minute = parseInt(minuteStr, 10)
  if (hour < OPENING_HOUR) hour += 24
  return hour + minute / 60 - OPENING_HOUR
}

// Racuna gde (levo %, sirina %) da nacrtamo crveni segment na traci za dati
// termin - koristi se i za prikaz postojecih rezervacija na traci
function segmentStyle(startTime) {
  const [h, m] = startTime.split(':')
  const startOffset = decimalHoursSinceOpening(h, m)
  const left = (startOffset / totalHours) * 100
  const width = (RESERVATION_DURATION_HOURS / totalHours) * 100
  return { left: `${left}%`, width: `${width}%` }
}

// Koji sto je trenutno izabran (klik na traku) - null znaci nijedan
const selectedTable = ref(null)

function selectTable(tableNumber) {
  selectedTable.value = tableNumber
  errorMsg.value = ''
  successMsg.value = ''
}

// Dostupni sati za pocetak rezervacije (npr. 09..23, poslednji da se stigne
// zavrsiti do zatvaranja) - generisemo iz konstanti, ne rucno
const availableHours = computed(() => {
  const lastStartOffset = totalHours - RESERVATION_DURATION_HOURS
  const hours = []
  for (let i = 0; i <= lastStartOffset; i++) {
    hours.push(String((OPENING_HOUR + i) % 24).padStart(2, '0'))
  }
  return hours
})

// Minuti u koracima od 5 - fiksna lista, korisnik ne moze uneti nista drugo
const availableMinutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']

const selectedHour = ref(availableHours.value[0])
const selectedMinute = ref('00')

const errorMsg = ref('')
const successMsg = ref('')
const submitting = ref(false)

// Proverava da li se izabrano vreme preklapa sa NEKOM postojecom rezervacijom
// tog stola (uporedjuje intervale [start, start+trajanje))
function overlapsExisting(tableNumber, hourStr, minuteStr) {
  const newStart = decimalHoursSinceOpening(hourStr, minuteStr)
  const newEnd = newStart + RESERVATION_DURATION_HOURS

  return reservationsForTable(tableNumber).some((r) => {
    const [rh, rm] = r.startTime.split(':')
    const existingStart = decimalHoursSinceOpening(rh, rm)
    const existingEnd = existingStart + RESERVATION_DURATION_HOURS
    // Dva intervala se preklapaju ako jedan pocinje pre nego sto se drugi zavrsi
    return newStart < existingEnd && existingStart < newEnd
  })
}

async function handleReserve() {
  errorMsg.value = ''
  successMsg.value = ''

  if (overlapsExisting(selectedTable.value, selectedHour.value, selectedMinute.value)) {
    errorMsg.value = 'Ovaj termin se preklapa sa postojećom rezervacijom. Izaberite drugo vreme.'
    return
  }

  submitting.value = true
  try {
    await timeslotsService.createReservation({
      serviceId: props.service.id,
      tableNumber: selectedTable.value,
      date: props.date,
      startTime: `${selectedHour.value}:${selectedMinute.value}`,
      userId: authStore.user.id
    })
    successMsg.value = `Rezervisali ste Sto ${selectedTable.value} u ${selectedHour.value}:${selectedMinute.value}.`
    selectedTable.value = null
    emit('reserved') // roditelj osvezava listu rezervacija
  } catch (err) {
    errorMsg.value = 'Rezervacija nije uspela. Pokušajte ponovo.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div>
    <p class="text-xs uppercase tracking-wider mb-1" style="color: var(--ink-soft);">
      {{ day }}. avgust — {{ service.name }}
    </p>
    <p class="text-sm mb-5" style="color: var(--ink-soft);">
      Radno vreme 09:00 – 01:00 · rezervacija traje {{ RESERVATION_DURATION_HOURS }}h
    </p>

    <!-- Traka po svakom stolu, sa crvenim segmentima gde je vec zauzeto -->
    <div
      v-for="table in tables"
      :key="table"
      @click="selectTable(table)"
      class="flex items-center gap-3 mb-3 cursor-pointer"
    >
      <span
        class="text-xs w-14"
        :style="selectedTable === table ? 'color: var(--ink); font-weight: 600;' : 'color: var(--ink-soft);'"
      >
        Sto {{ table }}
      </span>
      <div
        class="flex-1 h-6 rounded-md relative"
        :style="selectedTable === table
          ? 'background: var(--accent-soft); outline: 2px solid var(--accent);'
          : 'background: var(--accent-soft);'"
      >
        <div
          v-for="res in reservationsForTable(table)"
          :key="res.id"
          class="absolute h-full rounded-md flex items-center justify-center text-[10px] text-white"
          :style="{ ...segmentStyle(res.startTime), background: '#C97B7B' }"
        >
          {{ res.startTime }}
        </div>
      </div>
    </div>

    <!-- Panel za izbor vremena, prikazuje se tek kad je sto izabran -->
    <div v-if="selectedTable" class="rounded-xl p-4 mb-4" style="background: var(--accent-soft);">
      <p class="text-xs uppercase tracking-wider mb-3" style="color: var(--ink-soft);">
        Sto {{ selectedTable }} — vreme početka
      </p>
      <div class="flex items-center gap-2 mb-2">
        <select v-model="selectedHour" class="px-3 py-2 rounded-lg border text-sm" style="border-color: var(--line);">
          <option v-for="h in availableHours" :key="h" :value="h">{{ h }}</option>
        </select>
        <span>:</span>
        <select v-model="selectedMinute" class="px-3 py-2 rounded-lg border text-sm" style="border-color: var(--line);">
          <option v-for="m in availableMinutes" :key="m" :value="m">{{ m }}</option>
        </select>
      </div>
    </div>

    <div v-if="errorMsg" class="text-sm rounded-lg px-4 py-3 mb-4" style="background: #FBEAEA; color: #A33A3A;">
      {{ errorMsg }}
    </div>

    <div v-if="successMsg" class="text-sm rounded-lg px-4 py-3 mb-4" style="background: #E4F3E8; color: #2F6B3F;">
      {{ successMsg }}
    </div>

    <button
      v-if="selectedTable"
      @click="handleReserve"
      :disabled="submitting"
      class="w-full py-3 rounded-full text-white text-sm font-medium cursor-pointer"
      style="background: var(--accent);"
    >
      {{ submitting ? 'Šaljem...' : `Potvrdi rezervaciju — Sto ${selectedTable}, ${selectedHour}:${selectedMinute}` }}
    </button>
  </div>
</template>