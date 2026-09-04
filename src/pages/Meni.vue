<script setup>
// Meni je za sada staticki (ukucan direktno u kod), isto kao sto je Onama.vue
// staticka - nema poziva ka backendu. Ako kasnije zatrebaju prava jela iz
// baze, ovde bi trebalo dodati onMounted + API poziv, po uzoru na
// ServicesSection.vue

const predjela = [
  {
    name: "Escargots de Bourgogne",
    description: "Puževi u belom luku i persunovom maslacu.",
    price: "980 RSD",
  },
  {
    name: "Tartar od lososa",
    description: "Sveži losos, kapari, crveni luk, krutoni od kiselog testa.",
    price: "1250 RSD",
  },
  {
    name: "Krem supa od tikve",
    description: "Pečena tikva, đumbir, kokosovo mleko, pražena semenka bundeve.",
    price: "780 RSD",
  },
];

const glavnaJela = [
  {
    name: "Coq au vin",
    description: "Piletina dinstana u crnom vinu, sa pečurkama i lukom biserkom.",
    price: "2100 RSD",
  },
  {
    name: "Bœuf bourguignon",
    description: "Goveđi obraz, dugo dinstan u crvenom vinu, pire krompir.",
    price: "2450 RSD",
  },
  {
    name: "Riblji file dana",
    description: "Sveža riba po izboru šefa, sezonsko povrće, buter sos.",
    price: "2300 RSD",
  },
];

const deserti = [
  {
    name: "Crème brûlée",
    description: "Klasična vanil krema sa hrskavom karamel korom.",
    price: "650 RSD",
  },
  {
    name: "Tarte Tatin",
    description: "Karamelizovana pita od jabuka, servirana toplo.",
    price: "700 RSD",
  },
];

const pica = [
  {
    name: "Čaša crnog vina",
    description: "Izbor iz vinske karte, po preporuci someliera.",
    price: "od 450 RSD",
  },
  {
    name: "Domaća limunada",
    description: "Sveže ceđena, sa nanom.",
    price: "380 RSD",
  },
];

// Sve kategorije na jednom mestu, da template ne mora da ponavlja isti
// blok koda cetiri puta - samo se iterira kroz ovaj niz
const kategorije = [
  { title: "Predjela", items: predjela },
  { title: "Glavna jela", items: glavnaJela },
  { title: "Deserti", items: deserti },
  { title: "Pića", items: pica },
];
</script>

<template>
  <section class="max-w-2xl mx-auto px-6 pt-16 pb-8 text-center">
    <p class="text-xs mb-5 tracking-[0.2em]">NAŠA PONUDA</p>
    <h1 class="font-display text-5xl md:text-[3.4rem] leading-[1.08] mb-6">
      Meni
    </h1>
    <p class="leading-relaxed mb-9" style="color: var(--ink-soft)">
      Nekoliko izdvojenih jela iz naše sezonske ponude — kompletan meni
      dostupan je u restoranu.
    </p>
  </section>

  <section class="max-w-4xl mx-auto px-6 pb-24 space-y-14">
    <div v-for="kategorija in kategorije" :key="kategorija.title">
      <h2 class="font-display text-2xl mb-6">{{ kategorija.title }}</h2>

      <div class="space-y-4">
        <div
          v-for="item in kategorija.items"
          :key="item.name"
          class="rounded-2xl border p-5 flex items-start justify-between gap-6"
          style="background: var(--surface); border-color: var(--line)"
        >
          <div>
            <h3 class="font-display text-lg mb-1">{{ item.name }}</h3>
            <p class="text-sm leading-relaxed" style="color: var(--ink-soft)">
              {{ item.description }}
            </p>
          </div>
          <span
            class="text-sm font-medium whitespace-nowrap"
            style="color: var(--accent)"
            >{{ item.price }}</span
          >
        </div>
      </div>
    </div>
  </section>
</template>