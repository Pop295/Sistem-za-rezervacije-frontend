<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { timeslotsService } from "../services/timeslots.service";
import { useAuthStore } from "../stores/auth";
import TableAvailability from "./TableAvailability.vue";

const router = useRouter();
const authStore = useAuthStore();

// Da li je otvoren "morate da se ulogujete" prozorcic - prikazuje se kad
// neulogovan korisnik klikne na dan u kalendaru
const showAuthPrompt = ref(false);

// Podaci ucitani sa servisa (mock za sada) - prostorije i sve rezervacije
const services = ref([]);
const reservations = ref([]);

// Koja prostorija je trenutno izabrana (tab) - postavlja se na prvu ucitanu
const selectedServiceId = ref(null);

// Godina/mesec koji trenutno prikazujemo (mesec je 0-indeksiran, 7 = Avgust).
// Sada su ref-ovi (a ne konstante) da bi promena meseca ponovo iscrtala
// kalendar - pocetna vrednost je i dalje Avgust 2026.
const year = ref(2026);
const month = ref(7);

// Nazivi meseci na srpskom, za prikaz iznad kalendara (npr. "Septembar 2026")
const monthNames = [
  "Januar", "Februar", "Mart", "April", "Maj", "Jun",
  "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar",
];

// Tekst koji se prikazuje iznad kalendara, npr. "Avgust 2026"
const monthLabel = computed(() => `${monthNames[month.value]} ${year.value}`);

// Pomeranje kalendara za +1 (sledeci) ili -1 (prethodni) mesec.
// Kad mesec ispadne iz opsega 0-11, prebacujemo se u susednu godinu.
function changeMonth(delta) {
  let newMonth = month.value + delta;
  let newYear = year.value;

  if (newMonth < 0) {
    newMonth = 11;
    newYear -= 1;
  } else if (newMonth > 11) {
    newMonth = 0;
    newYear += 1;
  }

  month.value = newMonth;
  year.value = newYear;
  selectedDay.value = null; // izabran dan iz starog meseca vise nije relevantan
}

onMounted(async () => {
  services.value = await timeslotsService.getServices();
  reservations.value = await timeslotsService.getTableAvailability();
  if (services.value.length) {
    selectedServiceId.value = services.value[0].id;
  }
});

// Klik na tab prostorije - menja izabranu prostoriju i resetuje izabran dan
function selectService(id) {
  selectedServiceId.value = id;
  selectedDay.value = null;
}

// Racunamo koliko dana ima trenutni mesec (npr. 31 za avgust) - zavisi od
// year.value/month.value pa se automatski preracuna kad se mesec promeni
const daysInMonth = computed(() =>
  new Date(year.value, month.value + 1, 0).getDate(),
);

// Racunamo koliko praznih celija treba na pocetku grid-a, da bi se datum 1.
// poklopio sa ispravnim danom u nedelji (nas kalendar pocinje od Ponedeljka)
const leadingEmptyDays = computed(() => {
  const firstDayWeekday = new Date(year.value, month.value, 1).getDay(); // 0=Ned, 1=Pon...6=Sub
  return (firstDayWeekday + 6) % 7; // pretvaramo da Ponedeljak bude prvi (0)
});

// Lista brojeva dana za prikaz (1, 2, 3 ... daysInMonth)
const days = computed(() =>
  Array.from({ length: daysInMonth.value }, (_, i) => i + 1),
);

// Pretvara broj dana (npr. 19) u ISO string '2026-08-19' da bismo ga poredili
// sa datumima u mock podacima - koristi TRENUTNO izabran mesec/godinu
function isoDate(day) {
  const mm = String(month.value + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year.value}-${mm}-${dd}`;
}

// Danasnji datum bez vremena (00:00), da bismo mogli da poredimo samo dane
// (new Date() bi vratio i trenutni sat/minut, sto bi kvarilo poredjenje)
const today = new Date();
today.setHours(0, 0, 0, 0);

// Da li je dati dan u proslosti (pre danasnjeg datuma)?
// Koristimo isoDate + new Date(...) da izracunamo pravi datum tog dana i
// uporedimo ga sa "today" - ako je manji, dan je prosao.
function isPastDay(day) {
  const dayDate = new Date(year.value, month.value, day);
  dayDate.setHours(0, 0, 0, 0);
  return dayDate < today;
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
  if (isPastDay(day)) return; // proslih dana ne moze da se selektuje

  // Gost (neulogovan korisnik) sme da GLEDA kalendar i boje dostupnosti,
  // ali da bi izabrao konkretan dan i video stolove, mora prvo da se uloguje
  if (!authStore.isAuthenticated) {
    showAuthPrompt.value = true;
    return;
  }

  selectedDay.value = day;
}

// Vodi gosta na login/register, i pamti da ga posle uspesnog logina vrati
// nazad na /termini (isti "redirect" mehanizam kao u router/index.js)
function goToLogin() {
  router.push({ path: "/login", query: { redirect: "/termini" } });
}
function goToRegister() {
  router.push({ path: "/register", query: { redirect: "/termini" } });
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

    <!-- Navigacija kroz mesece: strelica levo/desno + naziv meseca u sredini -->
    <div class="flex items-center justify-between mb-5">
      <button
        @click="changeMonth(-1)"
        class="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer transition"
        style="border: 1px solid var(--line); color: var(--ink-soft)"
        aria-label="Prethodni mesec"
      >
        &#8249;
      </button>

      <span class="font-display italic text-lg">{{ monthLabel }}</span>

      <button
        @click="changeMonth(1)"
        class="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer transition"
        style="border: 1px solid var(--line); color: var(--ink-soft)"
        aria-label="Sledeci mesec"
      >
        &#8250;
      </button>
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
        class="aspect-square flex items-center justify-center text-xs rounded-full transition"
        :class="[
          selectedDay === day ? 'text-white font-semibold' : '',
          isPastDay(day) ? 'cursor-not-allowed' : 'cursor-pointer',
        ]"
        :style="
          isPastDay(day)
            ? 'color: #C4C4C4; opacity: 0.5;'
            : selectedDay === day
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
      :month-name="monthNames[month]"
      @reserved="
        reservations = [];
        timeslotsService.getTableAvailability().then((r) => (reservations = r));
      "
    />

    <!-- "Morate biti ulogovani" prozorcic - prikazuje se gostu kad klikne na dan -->
    <div
      v-if="showAuthPrompt"
      class="fixed inset-0 flex items-center justify-center px-6 z-50"
      style="background: rgba(0, 0, 0, 0.4)"
      @click.self="showAuthPrompt = false"
    >
      <div
        class="w-full max-w-sm rounded-2xl border p-7 text-center"
        style="background: var(--surface); border-color: var(--line)"
      >
        <h3 class="font-display text-xl mb-2">Potreban je nalog</h3>
        <p class="text-sm mb-6" style="color: var(--ink-soft)">
          Da biste izabrali sto i rezervisali termin, prvo se morate prijaviti
          ili napraviti nalog.
        </p>
        <div class="flex flex-col gap-3">
          <button
            @click="goToLogin"
            class="w-full py-3 rounded-full text-white text-sm font-medium cursor-pointer"
            style="background: var(--accent)"
          >
            Prijavi se
          </button>
          <button
            @click="goToRegister"
            class="w-full py-3 rounded-full text-sm font-medium border cursor-pointer"
            style="border-color: var(--line)"
          >
            Registruj se
          </button>
          <button
            @click="showAuthPrompt = false"
            class="text-xs mt-1 cursor-pointer"
            style="color: var(--ink-soft)"
          >
            Otkaži
          </button>
        </div>
      </div>
    </div>
  </div>
</template>