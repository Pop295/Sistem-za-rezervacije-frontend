<script setup>
import { ChefHat, Wine, Building2 } from "lucide-vue-next";
</script>

<template>
  <section class="max-w-2xl mx-auto px-6 pt-16 pb-8 text-center">
    <p class="text-xs mb-5 tracking-[0.2em]">
      OSNOVAN 2012. &nbsp•&nbsp MOSKVA
    </p>
    <h1 class="font-display text-5xl md:text-[3.4rem] leading-[1.08] mb-6">
      Francuska kuhinja, <br />
      <span class="italic" style="color: var(--accent)">u srcu Moskve.</span>
    </h1>
    <p class="leading-relaxed mb-9" style="color: var(--ink-soft)">
      Restoran Klod Mone već više od decenije spaja francusku tehniku i rusko
      gostoprimstvo — u kuhinji gde se svaki tanjir tretira kao mala umetnička
      izložba
    </p>
  </section>

  <section class="max-w-4xl mx-auto px-6 mb-20">
    <div
      class="rounded-2xl overflow-hidden border h-120"
      style="border-color: var(--line)"
    >
      <img
        src="../assets/Terasa.png"
        alt="terasa"
        class="w-full h-full object-cover"
      />
    </div>
  </section>

  <section class="max-w-2xl mx-auto px-6 mb-20 text-left">
    <p class="text-xs tracking-[0.2em] mb-3" style="color: var(--accent)">
      NAŠA PRIČA
    </p>
    <h2 class="font-display text-4xl mb-4">
      Od malog ateljea do gradske institucije
    </h2>
    <p class="text-base leading-relaxed mb-4" style="color: var(--ink-soft)">
      Ime smo pozajmili od slikara čija su dela učila da se svetlost menja iz
      trenutka u trenutak — baš kao i naša sezonska ponuda. Otvoreni 2012.
      godine sa svega nekoliko stolova i idejom da fine dining ne mora biti
      nepristupačan, danas smo mesto gde se poslovni ručkovi pretvaraju u
      večernje proslave
    </p>
    <p class="text-base leading-relaxed" style="color: var(--ink-soft)">
      Kroz godine smo prošli kroz haos otvaranja, promene menija, i noći kada je
      kuhinja radila do zore da bi sve bilo savršeno za goste — ali jedno se
      nije menjalo: opsesija detaljem koja nas i danas pokreće.
    </p>
  </section>

  <section class="max-w-4xl mx-auto px-20 mb-10">
    <div
      class="flex items-center gap-6 p-5 border rounded-2xl"
      style="background: var(--surface); border-color: var(--line);"
    >
      <div class="flex-shrink-0">
        <img
          src="../assets/ViktorBarinov.jpg"
          alt="SefKuhinje"
          class="w-35 h-35 rounded-full object-cover"
        />
      </div>
      <div>
        <p class="text-xs tracking-[0.2em] mb-3" style="color: var(--accent)">
          ŠEF KUHINJE
        </p>
        <h2 class="font-display text-xl mb-2">Viktor Petrovič Barinov</h2>
        <p class="text-sm leading-relaxed" style="color: var(--ink-soft)">
          U kuhinji od 15. godine, školovan u Lionu, vodi tim od otvaranja
          restorana. Njegov potpis: klasične francuske tehnike sa ruskim
          sezonskim namirnicama.
        </p>
      </div>
    </div>
  </section>

<section class="max-w-4xl mx-auto px-6 pt-16 pb-20">
    <p class="text-xs tracking-[0.2em] mb-3 text-center" style="color: var(--accent)">ZAŠTO MI</p>
    <h2 class="font-display text-3xl mb-10 text-center">Ono što nas izdvaja</h2>

    <div class="grid md:grid-cols-3 gap-6">
      <div class="rounded-2xl border p-7"
        style="background: var(--surface); border-color: var(--line)">
        <div class="mb-5"><ChefHat :size="24" style="color: var(--accent)" /></div>
        <h3 class="font-display text-xl mb-2">Sezonski meni</h3>
        <p class="text-sm leading-relaxed" style="color: var(--ink-soft)">
          Karta se menja četiri puta godišnje, prema tržnici, ne prema
          kalendaru.
        </p>
      </div>
      <div class="rounded-2xl border p-7"
        style="background: var(--surface); border-color: var(--line)">
        <div class="mb-5"><Wine :size="24" style="color: var(--accent)" /></div>
        <h3 class="font-display text-xl mb-2">Vinska karta</h3>
        <p class="text-sm leading-relaxed" style="color: var(--ink-soft)">
          Preko 80 etiketa, birano da prati svaki tanjir sa menija
        </p>
      </div>
      <div class="rounded-2xl border p-7"
        style="background: var(--surface); border-color: var(--line)">
        <div class="mb-5"><Building2 :size="24" style="color: var(--accent)" /></div>
        <h3 class="font-display text-xl mb-2">Prostor za svaku priliku</h3>
        <p class="text-sm leading-relaxed" style="color: var(--ink-soft)">
          Terasa, glavna sala i privatna sala za proslave i poslovne večere.
        </p>
      </div>
    </div>
  </section>

  <section class="max-w-2xl mx-auto px-6 pb-24">
    <div class="rounded-2xl border p-8 grid sm:grid-cols-2 gap-8"
      style="background: var(--surface); border-color: var(--line)">
      <div class="text-left">
        <p class="text-xs uppercase tracking-wider mb-2" style="color: var(--ink-soft);">Radno vreme</p>
        <h3 class="font-display text-lg mb-1">Svaki dan</h3>
        <p class="text-sm" style="color: var(--ink-soft)">09:00 - 01:00</p>
      </div>
      <div class="text-left sm:text-right">
        <p class="text-xs uppercase tracking-wider mb-2" style="color: var(--ink-soft);">Lokacija</p>
        <h3 class="font-display text-lg mb-1">Tverskaja ulica 12</h3>
        <p class="text-sm" style="color: var(--ink-soft)">Moskva, Rusija</p>
      </div>
    </div>
  </section>
</template>
