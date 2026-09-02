<script setup>
import { ref, onMounted } from "vue";
import { timeslotsService } from "../services/timeslots.service";

// Prostorije se sada povlace sa backenda (GET /services), isto sto koristi
// i kalendar u Termini stranici - ranije je ovde bio hardkodovan niz koji
// se ne bi azurirao ako admin promeni opis/cenu prostorije u bazi
const services = ref([]);
const loading = ref(true);
const error = ref("");

onMounted(async () => {
  try {
    services.value = await timeslotsService.getServices();
  } catch (err) {
    error.value = "Nije moguće učitati prostorije. Pokušajte kasnije.";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <section class="max-w-6xl mx-auto px-6 pb-24">
    <div class="flex justify-between mb-10">
      <h2 class="font-display text-3xl">Naši prostori</h2>
      <span class="text-sm" style="color: var(--ink-soft)"
        >Izaberite ambijent koji vam odgovara</span
      >
    </div>

    <p v-if="loading" class="text-sm" style="color: var(--ink-soft)">
      Učitavanje...
    </p>
    <p v-else-if="error" class="text-sm" style="color: #a33a3a">
      {{ error }}
    </p>

    <div v-else class="grid md:grid-cols-3 gap-6">
      <div
        v-for="service in services"
        :key="service.id"
        class="rounded-2xl border p-7"
        style="background: var(--surface); border-color: var(--line)"
      >
        <div
          class="w-10 h-10 rounded-full mb-6"
          style="background: var(--accent-soft)"
        ></div>
        <h3 class="font-display text-xl mb-2">{{ service.name }}</h3>
        <p class="text-sm leading-relaxed" style="color: var(--ink-soft)">
          {{ service.description }}
        </p>
      </div>
    </div>
  </section>
</template>