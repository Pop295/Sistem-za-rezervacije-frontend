<script setup>
import { ref } from "vue";

const faqs = ref([
  {
    question: "Kako da napravim rezervaciju?",
    answer:
      'Idite na stranicu „Termini", izaberite prostoriju, zatim dan u kalendaru i konkretan sto. Na kraju izaberite vreme početka i potvrdite rezervaciju.',
  },
  {
    question: "Koliko dugo traje jedna rezervacija?",
    answer: "Svaka rezervacija traje 2 sata od izabranog vremena početka.",
  },
  {
    question: "Da li mogu da otkažem rezervaciju?",
    answer:
      "Da, u okviru Dashboard-a možete videti sve svoje rezervacije i otkazati ih u bilo kom trenutku.",
  },
  {
    question: "Da li moram da napravim nalog da bih rezervisao sto?",
    answer:
      "Da, potrebno je da se registrujete kako bismo mogli da vas povežemo sa vašom rezervacijom.",
  },
  {
    question: "Koje je radno vreme restorana?",
    answer: "Radimo svaki dan od 09:00 do 01:00.",
  },
  {
    question: "Da li Privatna sala ima poseban minimum gostiju?",
    answer:
      "Za Privatnu salu preporučujemo najavu unapred za grupe veće od 10 osoba.",
  },
]);

// Indeks trenutno otvorenog pitanja - null znaci "sve zatvoreno"
const openIndex = ref(null);

function toggle(index) {
  openIndex.value = openIndex.value === index ? null : index;
}
</script>

<template>
  <section class="max-w-2xl mx-auto px-6 my-20 text-center">
    <p class="text-xs tracking-[0.2em] mb-3" style="color: var(--accent)">
      IMATE PITANJE?
    </p>
    <h1 class="font-display text-4xl mb-4">Često postavljana pitanja</h1>
    <p class="text-base leading-relaxed" style="color: var(--ink-soft)">
      Sve što treba da znate o rezervacijama, otkazivanju i posetama restoranu.
    </p>
  </section>

  <section class="max-w-2xl mx-auto px-6 mb-20 text-left">
    <div class="space-y-3">
      <div
        v-for="(faq, index) in faqs"
        :key="index"
        class="flex flex-col gap-6 p-5 border rounded-2xl"
        style="background: var(--surface); border-color: var(--line)"
      >
        <div class="flex items-center justify-between">
          <span class="font-display text-xl">{{ faq.question }}</span>
          <span
            @click="toggle(index)"
            class="cursor-pointer text-xl flex-shrink-0"
            :style="openIndex === index ? 'color: var(--accent)' : 'color: var(--ink-soft)'"
          >
            {{ openIndex === index ? "−" : "+" }}
          </span>
        </div>
        <div v-if="openIndex === index">
          <p class="text-sm leading-relaxed" style="color: var(--ink-soft)">
            {{ faq.answer }}
          </p>
        </div>
      </div>
    </div>
  </section>

  <section class="max-w-2xl mx-auto px-6 mb-20 text-center">
    <p class="text-base leading-relaxed mb-5" style="color: var(--ink-soft)">
      Niste pronašli odgovor koji tražite?
    </p>
    <button
      class="text-sm px-6 py-3 rounded-full text-white font-medium cursor-pointer"
      style="background: var(--accent)"
    >
      Kontaktirajte nas
    </button>
  </section>
</template>