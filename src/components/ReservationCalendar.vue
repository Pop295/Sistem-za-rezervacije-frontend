<script setup>
import { ref, computed, onMounted } from "vue";
import { timeslotsService } from "../services/timeslots.service";
import TableAvailability from "./TableAvailability.vue";

// Podaci ucitani sa servisa (mock za sada) - prostorije i sve rezervacije
const services = ref([]);
const reservations = ref([]);

// Koja prostorija je trenutno izabrana (tab) - postavlja se na prvu ucitanu
const selectedServiceId = ref(null);

// Fiksiramo godinu/mesec koji prikazujemo (mesec je 0-indeksiran, 7 = Avgust)
const year = 2026;
const month = 7;

onMounted(async () => {
  services.value = await timeslotsService.getServices();
  reservations.value = await timeslotsService.getReservations();
  if (services.value.length) {
    selectedServiceId.value = services.value[0].id;
  }
});

// Klik na tab prostorije - menja izabranu prostoriju i resetuje izabran dan
function selectService(id) {
  selectedServiceId.value = id;
  selectedDay.value = null;
}

// Racunamo koliko dana ima trenutni mesec (npr. 31 za avgust)
const daysInMonth = computed(() => new Date(year, month + 1, 0).getDate());

// Racunamo koliko praznih celija treba na pocetku grid-a, da bi se datum 1.
// poklopio sa ispravnim danom u nedelji (nas kalendar pocinje od Ponedeljka)
const leadingEmptyDays = computed(() => {
  const firstDayWeekday = new Date(year, month, 1).getDay(); // 0=Ned, 1=Pon...6=Sub
  return (firstDayWeekday + 6) % 7; // pretvaramo da Ponedeljak bude prvi (0)
});

// Lista brojeva dana za prikaz (1, 2, 3 ... daysInMonth)
const days = computed(() =>
  Array.from({ length: daysInMonth.value }, (_, i) => i + 1),
);

// Pretvara broj dana (npr. 19) u ISO string '2026-08-19' da bismo ga poredili
// sa datumima u mock podacima
function isoDate(day) {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

// Trenutno izabrana prostorija (ceo objekat) - treba nam njen tableCount
const currentService = computed(() =>
  services.value.find((s) => s.id === selectedServiceId.value),
);

// Sve rezervacije za dati dan I trenutno izabranu prostoriju
function reservationsForDay(day) {
  const date = isoDate(day);
  return reservations.value.filter(
    (r) => r.serviceId === selectedServiceId.value && r.date === date,
  );
}

// Status dana za bojenje kalendara - racunamo koliko JEDINSTVENIH stolova je
// zauzeto bar jednom tog dana, u odnosu na ukupan broj stolova te prostorije.
// Ovo je pojednostavljen izracun (ne gleda tacne sate zauzeca po satu) -
// dovoljno dobar za bojenje kalendara na nivou dana
function dayStatus(day) {
  if (!currentService.value) return "none";
  const dayReservations = reservationsForDay(day);
  if (dayReservations.length === 0) return "green";

  const bookedTables = new Set(dayReservations.map((r) => r.tableNumber));
  const ratio = bookedTables.size / currentService.value.tableCount;

  if (ratio >= 1) return "red";
  if (ratio >= 0.5) return "yellow";
  return "green";
}

// Izabran dan (broj) - null znaci "nista izabrano"
const selectedDay = ref(null);

function selectDay(day) {
  selectedDay.value = day;
}
</script>

<template>
  <div
    class="rounded-2xl border p-6"
    style="border-color: var(--line); background: var(--surface)"
  >
    <!-- Tabovi za biranje prostorije -->
    <div class="flex gap-2 mb-6">
      <button
        v-for="service in services"
        :key="service.id"
        @click="selectService(service.id)"
        class="px-4 py-2 rounded-full text-sm cursor-pointer transition"
        :class="selectedServiceId === service.id ? 'text-white' : ''"
        :style="
          selectedServiceId === service.id
            ? 'background: var(--accent)'
            : 'border: 1px solid var(--line); color: var(--ink-soft)'
        "
      >
        {{ service.name }}
      </button>
    </div>

    <div class="flex items-center justify-between mb-5">
      <span class="font-display italic text-lg">Avgust 2026</span>
    </div>

    <div
      class="grid grid-cols-7 gap-1 text-center text-xs mb-3"
      style="color: var(--ink-soft)"
    >
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
            : dayStatus(day) === 'green'
              ? 'background: #E4F3E8; color: #2F6B3F;'
              : dayStatus(day) === 'yellow'
                ? 'background: #FDF3D8; color: #92720E;'
                : dayStatus(day) === 'red'
                  ? 'background: #FBEAEA; color: #A33A3A;'
                  : 'color: var(--ink-soft);'
        "
      >
        {{ day }}
      </div>
    </div>

    <!-- Legenda boja -->
    <div
      class="flex items-center gap-4 text-xs mb-6"
      style="color: var(--ink-soft)"
    >
      <span class="flex items-center gap-1.5">
        <span
          class="w-2.5 h-2.5 rounded-full inline-block"
          style="background: #e4f3e8; border: 1px solid #2f6b3f"
        ></span>
        Slobodno
      </span>
      <span class="flex items-center gap-1.5">
        <span
          class="w-2.5 h-2.5 rounded-full inline-block"
          style="background: #fdf3d8; border: 1px solid #92720e"
        ></span>
        Delimično
      </span>
      <span class="flex items-center gap-1.5">
        <span
          class="w-2.5 h-2.5 rounded-full inline-block"
          style="background: #fbeaea; border: 1px solid #a33a3a"
        ></span>
        Zauzeto
      </span>
    </div>

    <!-- Prikaz stolova za izabran dan -->
    <TableAvailability
      v-if="selectedDay && currentService"
      :service="currentService"
      :day="selectedDay"
      :date="isoDate(selectedDay)"
      :reservations="reservationsForDay(selectedDay)"
      @reserved="
        reservations = [];
        timeslotsService.getReservations().then((r) => (reservations = r));
      "
    />
  </div>
</template>
