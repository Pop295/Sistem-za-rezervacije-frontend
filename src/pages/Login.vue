<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

/*
import { ref } from 'vue' — već poznato, za reaktivne promenljive
import { useRouter } from 'vue-router' — funkcija koja ti daje pristup routeru unutar komponente (različito od router/index.js koji smo pravili — taj definiše rute, ovaj ti daje alat da se krećeš kroz njih iz koda)
import { useAuthStore } from '@/stores/auth' — uvozi tvoj Pinia store; koristi se @/ alias koji smo podesili u vite.config.js (znači "iz src foldera", iako je stores/ zapravo van src/ — pazi, ovo možda neće raditi zbog iste putanje-strukture greške kao ranije, videćemo kad testiraš)
const email = ref('') i const password = ref('') — prazne reaktivne promenljive koje će v-model popunjavati dok korisnik kuca
const error = ref('') — prazan string na početku (znači "nema greške"); kad ima sadržaj, v-if="error" u template-u će ga prikazati
const router = useRouter() i const authStore = useAuthStore() — pozivaš te funkcije da dobiješ instance koje koristiš dalje u kodu
async function handleLogin() — async jer unutra koristimo await (login poziv je asinhron, uzima vremena)
error.value = '' — na početku svakog pokušaja, brišemo staru grešku (ako je korisnik prvi put pogrešio, pa pokušava ponovo)
await authStore.login(...) — poziva login akciju iz store-a, koja (setimo se koda) interno zove authService.login(), čeka mock/pravi odgovor, i ako uspe, sam store već čuva token/user
router.push('/dashboard') — ako login uspe (nije bacio grešku), programski menjamo stranicu na /dashboard
catch (err) { error.value = ... } — ako authStore.login() baci grešku (npr. pogrešan email/password u mock servisu), hvatamo je i prikazujemo poruku korisniku umesto da aplikacija "pukne"
*/

const email = ref("");
const password = ref("");
const error = ref("");

const router = useRouter();
const authStore = useAuthStore();

async function handleLogin() {
  error.value = "";
  try {
    await authStore.login({ email: email.value, password: password.value });
    router.push("/dashboard");
  } catch (err) {
    error.value = "Pogrešan email ili lozinka.";
  }
}
</script>

<template>
  <section class="min-h-[85vh] flex items-center justify-center px-6 py-16">
    <div
      class="w-full max-w-md rounded-2xl border p-9"
      style="background: var(--surface); border-color: var(--line)"
    >
      <p
        class="text-xs tracking-[0.2em] uppercase text-center mb-3"
        style="color: var(--accent)"
      >
        Dobrodosli nazad
      </p>
      <h1 class="font-display text-3xl text-center mb-8">Prijava</h1>

      <form @submit.prevent="handleLogin">
        <div class="py-5">
          <label
            for="email"
            class="block text-xs tracking-wider mb-2"
            style="color: var(--ink-soft)"
            >EMAIL</label
          >
          <input
            id="email"
            type="email"
            v-model="email"
            placeholder="primer@email.com"
            class="w-full px-4 py-3 rounded-xl border text-sm"
            style="border-color: var(--line)"
          />
        </div>
        <div class="py-5">
          <label
            for="password"
            class="block text-xs tracking-wider mb-2"
            style="color: var(--ink-soft)"
            >LOZINKA</label
          >
          <input
            id="password"
            type="password"
            v-model="password"
            placeholder="••••••••"
            class="w-full px-4 py-3 rounded-xl border text-sm"
            style="border-color: var(--line)"
          />
        </div>
        <div
          v-if="error"
          class="text-sm rounded-lg px-4 py-3 mb-4"
          style="background: #fbeaea; color: #a33a3a"
        >
          {{ error }}
        </div>
        <button
          type="submit"
          class="w-full py-3 rounded-full text-white text-sm font-medium mt-2 cursor-pointer"
          style="background: var(--accent)"
        >
          Prijavi se
        </button>
      </form>

      <p class="text-sm text-center mt-7" style="color: var(--ink-soft)">
        Nemate nalog?
        <router-link
          to="/register"
          class="font-medium"
          style="color: var(--accent)"
          >Registrujte se</router-link
        >
      </p>
    </div>
  </section>
</template>
