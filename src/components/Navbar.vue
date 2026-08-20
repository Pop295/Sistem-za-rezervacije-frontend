<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import logo from '../assets/logo.jpeg'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const isMenuOpen = ref(false)
const menuRef = ref(null)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

const initials = computed(() => {
  const name = authStore.user?.fullName
  if (!name) return '?'
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
})

function handleClickOutside(event) {
  if (menuRef.value && !menuRef.value.contains(event.target)) {
    isMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function handleLogout() {
  authStore.logout()
  isMenuOpen.value = false
}
</script>

<template>
  <nav class="border-b" style="border-color: var(--line);">
    <div class="max-w-6xl mx-auto px-6 py-5 relative flex items-center justify-between">

      <!-- Logo - leva strana -->
      <div class="flex items-center gap-2">
        <img :src="logo" alt="Klod Mone logo" class="w-22 h-22 rounded-full object-cover" />
        <span class="font-display italic text-lg tracking-tight">Dobrodošli</span>
      </div>

      <!-- Glavna navigacija - centrirana preko celog nav-a, bez obzira na sirinu logoa/auth dela -->
      <div
        class="hidden md:flex items-center gap-8 text-sm absolute left-1/2"
        style="color: var(--ink-soft); transform: translateX(-50%);"
      >
        <router-link to="/" class="hover:text-black transition">Početna</router-link>
        <router-link to="/termini" class="hover:text-black transition">Termini</router-link>
        <router-link to="/o-nama" class="hover:text-black transition">O nama</router-link>
        <router-link to="/pitanja" class="hover:text-black transition">Pitanja i odgovori</router-link>
      </div>

      <!-- Auth deo (Prijava ili Avatar+meni) - desna strana -->
      <div class="flex items-center">
        <router-link v-if="!authStore.isAuthenticated" to="/login" class="text-sm hover:text-black transition" style="color: var(--ink-soft);">
          Prijava
        </router-link>

        <div v-else class="relative" ref="menuRef">
          <button @click="toggleMenu" class="flex items-center gap-2 cursor-pointer">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium"
              style="background: var(--accent);"
            >
              {{ initials }}
            </div>
            <span class="text-sm" style="color: var(--ink);">{{ authStore.user?.fullName }}</span>
          </button>

          <div
            v-if="isMenuOpen"
            class="absolute right-0 mt-2 w-44 rounded-xl border py-2 z-10"
            style="border-color: var(--line); background: var(--surface); box-shadow: 0 4px 16px rgba(0,0,0,0.06);"
          >
            <router-link
              to="/dashboard"
              @click="isMenuOpen = false"
              class="block px-4 py-2 text-sm hover:bg-gray-50"
              style="color: var(--ink);"
            >
              Dashboard
            </router-link>
            <button
              @click="handleLogout"
              class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer"
              style="color: #A33A3A;"
            >
              Odjava
            </button>
          </div>
        </div>
      </div>

    </div>
  </nav>
</template>