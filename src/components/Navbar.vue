<script setup>
</script>

<template>
  <nav class="border-b" style="border-color: var(--line);">
    <div class="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 rounded-full" style="background: var(--accent);"></div>
        <span class="font-display italic text-lg tracking-tight">Naziv Restorana</span>
      </div>

      <div class="hidden md:flex items-center gap-8 text-sm" style="color: var(--ink-soft);">
        <router-link to="/" class="hover:text-black transition">Početna</router-link>
        <router-link to="/termini" class="hover:text-black transition">Termini</router-link>
        <router-link to="/login" class="hover:text-black transition">Prijava</router-link>
      </div>

      <router-link to="/termini" class="text-sm px-4 py-2 rounded-full text-white" style="background: var(--ink);">
        Rezerviši sto
      </router-link>
    </div>
  </nav>
</template>