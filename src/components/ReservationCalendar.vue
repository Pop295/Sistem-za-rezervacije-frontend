<script setup>
import { ref } from "vue";

// Mock dani u mesecu - kasnije će ovo dolaziti iz services/calendar.service.js
const days = ref([
  { date: 1 },
  { date: 2 },
  { date: 3 },
  { date: 4 },
  { date: 5 },
  { date: 6 },
  { date: 7 },
  { date: 8 },
  { date: 9 },
  { date: 10 },
  { date: 11 },
  { date: 12 },
]);

// Trenutno izabran dan - počinje na 12, isto kao u mockupu
const selectedDay = ref(12);

// Mock termini po danu - u pravoj verziji ovo bi zavisilo od izabranog dana
const timeSlots = ref([
  { time: "18:00", available: true },
  { time: "19:30", available: true },
  { time: "21:00", available: true },
]);

const selectedSlot = ref("19:30");

function selectDay(day) {
  selectedDay.value = day;
}

function selectSlot(time) {
  selectedSlot.value = time;
}
</script>
<!--
ref() — Vue-ov način da napraviš "reaktivnu" promenljivu. Kad se njena vrednost promeni, sve u template-u što je koristi se automatski osveži na ekranu.
v-for — petlja u template-u, generiše HTML za svaki element niza (umesto da ručno pišeš 12 <div> blokova za 12 dana, kao u mockupu).
@click — Vue event listener, poziva funkciju kad se klikne na element.
:class — dinamičko dodavanje CSS klase na osnovu uslova (npr. "ako je ovaj dan izabran, oboji ga zeleno").
-->
<template>
  <div
    class="rounded-2xl border p-6"
    style="border-color: var(--line); background: var(--surface)"
  >
    <div class="flex items-center justify-between mb-5">
      <span class="font-display italic text-lg">Avgust 2026</span>
      <div class="flex gap-2 text-xs" style="color: var(--ink-soft)">
        <span class="px-2 py-1 cursor-pointer">‹</span>
        <span class="px-2 py-1 cursor-pointer">›</span>
      </div>
    </div>

    <div
      class="grid grid-cols-7 gap-1 text-center text-xs mb-3"
      style="color: var(--ink-soft)"
    >
      <span>Pon</span><span>Uto</span><span>Sre</span><span>Čet</span>
      <span>Pet</span><span>Sub</span><span>Ned</span>
    </div>

    <div class="grid grid-cols-7 gap-1 mb-6">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div
        v-for="day in days"
        :key="day.date"
        @click="selectDay(day.date)"
        class="aspect-square flex items-center justify-center text-xs rounded-full cursor-pointer transition"
        :class="selectedDay === day.date ? 'text-white font-semibold' : ''"
        :style="
          selectedDay === day.date
            ? 'background: var(--accent)'
            : 'color: var(--ink-soft)'
        "
      >
        {{ day.date }}
      </div>
    </div>
    <p class="text-xs tracking-wider mb-3" style="color: var(--ink-soft)">
      SREDA, 12 AVGUST - SLOBODNI TERMINI
    </p>
    <div class="grid grid-cols-3 gap-2">
      <div
        v-for="slot in timeSlots"
        :key="slot.time"
        @click="selectSlot(slot.time)"
        class="text-center text-sm py-2 rounded-lg border cursor-pointer transition"
        :class="selectedSlot === slot.time ? 'text-white font-medium' : ''"
        :style="
          selectedSlot === slot.time
            ? 'background: var(--accent); border-color: var(--accent)'
            : 'border-color: var(--line); color: var(--ink-soft)'
        "
      >
        {{ slot.time }}
      </div>
    </div>
  </div>
</template>
