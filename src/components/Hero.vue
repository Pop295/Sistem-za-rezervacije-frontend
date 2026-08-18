<script setup>
import ReservationCalendar from "./ReservationCalendar.vue";
import heroImage from "../assets/hero.jpg";
</script>

<template>
  <section
    class="max-w-6xl mx-auto px-6 pt-16 pb-20 grid md:grid-cols-2 gap-14 items-center"
  >
    <div>
      <p class="text-xs mb-5 tracking-[0.2em]">
        REZERVACIJE &nbsp•&nbsp RESTORAN
      </p>
      <h1 class="font-display text-5xl md:text-[3.4rem] leading-[1.08] mb-6">
        Rezervišite sto, <br />
        <span class="italic" style="color: var(--accent)"
          >za nekoliko klikova.</span
        >
      </h1>
      <p class="leading-relaxed max-w-md mb-9" style="color: var(--ink-soft)">
        Pogledajte slobodne termine u realnom vremenu, izaberite sto koji vam
        odgovara i dobijte trenutnu potvrdu.
      </p>
      <div class="flex items-center gap-4">
        <router-link
          to="/termini"
          class="px-6 py-3 rounded-full text-white text-sm font-medium"
          style="background: var(--accent)"
        >
          Izaberi termin →
        </router-link>
        <button
          class="px-6 py-3 rounded-full text-sm font-medium border"
          style="border-color: var(--line)"
        >
          Pogledaj meni
        </button>
      </div>
    </div>
    <div
      class="rounded-2xl overflow-hidden border"
      style="border-color: var(--line)"
    >
      <img
        :src="heroImage"
        alt="Enterijer restorana"
        class="w-full h-full object-cover"
      />
    </div>
  </section>
</template>
