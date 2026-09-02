<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth";

const name = ref("");
const email = ref("");
const password = ref("");
const error = ref("");
const phone = ref("");

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

async function handleRegister() {
  error.value = "";

  // Ista logika kao kod Login-a: validiramo PRE slanja, da korisnik odmah
  // vidi sta treba da ispravi umesto da ceka odgovor sa servera
  if (!name.value.trim() || !email.value.trim() || !password.value.trim() || !phone.value.trim()) {
    error.value = "Popunite sva polja.";
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value.trim())) {
    error.value = "Unesite ispravnu email adresu.";
    return;
  }

  // Placeholder polja za lozinku obecava "najmanje 6 karaktera" - ovo je
  // taj uslov stvarno primenjen, a ne samo napisan kao tekst
  if (password.value.length < 6) {
    error.value = "Lozinka mora imati najmanje 6 karaktera.";
    return;
  }

  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
      phone: phone.value,
    });
    router.push(route.query.redirect || "/dashboard");
  } catch (err) {
    error.value = "Registracija nije uspela. Pokušajte ponovo.";
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
        PRIDRUZITE NAM SE
      </p>
      <h1 class="font-display text-3xl text-center mb-8">Registracija</h1>

      <form @submit.prevent="handleRegister">
        <div class="py-5">
          <label
            for="imeprezime"
            class="block text-xs tracking-wider mb-2"
            style="color: var(--ink-soft)"
            >IME I PREZIME</label
          >
          <input
            id="imeprezime"
            type="text"
            v-model="name"
            placeholder="Marko Marković"
            class="w-full px-4 py-3 rounded-xl border text-sm"
            style="border-color: var(--line)"
          />
        </div>
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
            placeholder="vas@email.com"
            class="w-full px-4 py-3 rounded-xl border text-sm"
            style="border-color: var(--line)"
          />
        </div>
        <div class="py-5">
          <label
            for="phone"
            class="block text-xs tracking-wider mb-2"
            style="color: var(--ink-soft)"
            >TELEFON</label
          >
          <input
            id="phone"
            type="tel"
            v-model="phone"
            placeholder="060 123 4567"
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
            placeholder="Najmanje 6 karaktera"
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
          Registruj se
        </button>
      </form>

      <p class="text-sm text-center mt-7" style="color: var(--ink-soft)">
        Vec imate nalog?
        <router-link
          to="/login"
          class="font-medium"
          style="color: var(--accent)"
          >Prijavite se</router-link
        >
      </p>
    </div>
  </section>
</template>