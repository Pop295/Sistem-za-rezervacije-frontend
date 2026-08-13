<script setup>
import { ref } from "vue";

const services = ref([
  {
    name: "Terasa",
    description:
      "Otvoren prostor sa pogledom, idealan za tople večeri. Do 40 gostiju.",
  },
  {
    name: "Glavna sala",
    description:
      "Topla, elegantna atmosfera za svakodnevne rezervacije. Do 60 gostiju.",
  },
  {
    name: "Privatna sala",
    description:
      "Zatvoren prostor za proslave i poslovne večere. Do 20 gostiju.",
  },
]);
</script>

<template>
  <section class="max-w-6xl mx-auto px-6 pb-24">
    <div class="flex justify-between mb-10">
      <h2 class="font-display text-3xl">Naši prostori</h2>
      <span class="text-sm" style="color: var(--ink-soft)"
        >Izaberite ambijent koji vam odgovara</span
      >
    </div>

    <div class="grid md:grid-cols-3 gap-6">
      <div
        v-for="service in services"
        :key="service.name"
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
