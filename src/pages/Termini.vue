<script setup>
import ReservationCalendar from "../components/ReservationCalendar.vue";
</script>

<template>
  <section class="max-w-2xl mx-auto px-6 pt-16 pb-24">
    <div class="text-center mb-10">
      <p
        class="text-xs tracking-[0.2em] uppercase mb-3"
        style="color: var(--accent)"
      >
        Rezervacija termina
      </p>
      <h1 class="font-display text-4xl mb-4">Izaberite datum i vreme</h1>
      <p class="text-base leading-relaxed" style="color: var(--ink-soft)">
        Pogledajte slobodne termine i rezervišite u par klikova.
      </p>
    </div>
    <div>
      <ReservationCalendar />
    </div>
  </section>
</template>
