<script setup>
import logo from '../assets/logo.jpeg'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <nav class="border-b" style="border-color: var(--line);">
    <div class="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <img :src="logo" alt="Klod Mone logo" class="w-22 h-22 rounded-full object-cover" />
        <span class="font-display italic text-lg tracking-tight">Dobrodošli</span>
      </div>

      <div class="hidden md:flex items-center gap-8 text-sm" style="color: var(--ink-soft);">
        <router-link to="/" class="hover:text-black transition">Početna</router-link>
        <router-link to="/termini" class="hover:text-black transition">Termini</router-link>

        <router-link v-if="!authStore.isAuthenticated" to="/login" class="hover:text-black transition">
          Prijava
        </router-link>

        <template v-else>
          <span>{{ authStore.user?.fullName }}</span>
          <button @click="authStore.logout()" class="hover:text-black transition cursor-pointer">
            Odjava
          </button>
        </template>
      </div>

      <router-link to="/termini" class="text-sm px-4 py-2 rounded-full text-white" style="background: var(--ink);">
        Rezerviši sto
      </router-link>
    </div>
  </nav>
</template>