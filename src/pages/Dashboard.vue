<script setup>
import { ref, onMounted, computed } from 'vue'
import { timeslotsService } from '../services/timeslots.service'
import { notificationsService } from '../services/notifications.service'
import { authService } from '../services/auth.service'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

// Koja sekcija je trenutno aktivna u sajdbaru
const activeSection = ref('rezervacije')

const myReservations = ref([])
const notifications = ref([])
const loading = ref(true)

onMounted(async () => {
  await loadReservations()
  notifications.value = await notificationsService.getNotifications()
  loading.value = false
})

// Backend GET /api/reservations vec vraca samo rezervacije ulogovanog
// korisnika (filtrirano po JWT tokenu), zato ovde nema dodatnog filtriranja
async function loadReservations() {
  const all = await timeslotsService.getReservations()
  myReservations.value = all.filter((r) => r.status !== 'cancelled')
}

const cancellingId = ref(null)

async function handleCancel(id) {
  cancellingId.value = id
  try {
    await timeslotsService.cancelReservation(id)
    await loadReservations()
  } finally {
    cancellingId.value = null
  }
}

// Broj nepročitanih notifikacija - prikazuje se kao znacka u sajdbaru
const unreadCount = computed(() => notifications.value.filter((n) => !n.isRead).length)

async function markRead(id) {
  await notificationsService.markAsRead(id)
  notifications.value = await notificationsService.getNotifications()
}

// Promena lozinke
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const passwordError = ref('')
const passwordSuccess = ref('')
const changingPassword = ref(false)

async function handleChangePassword() {
  passwordError.value = ''
  passwordSuccess.value = ''

  if (newPassword.value.length < 6) {
    passwordError.value = 'Nova lozinka mora imati najmanje 6 karaktera.'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = 'Nova lozinka i potvrda se ne poklapaju.'
    return
  }

  changingPassword.value = true
  try {
    await authService.changePassword({
      oldPassword: oldPassword.value,
      newPassword: newPassword.value
    })
    passwordSuccess.value = 'Lozinka je uspešno promenjena.'
    oldPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (err) {
    passwordError.value = 'Promena lozinke nije uspela. Proverite staru lozinku.'
  } finally {
    changingPassword.value = false
  }
}
</script>

<template>
  <section class="max-w-5xl mx-auto px-6 pt-16 pb-24 grid md:grid-cols-3 gap-10">

    <!-- SAJDBAR -->
    <div>
      <p class="text-xs uppercase tracking-wider mb-4" style="color: var(--ink-soft);">Moj nalog</p>
      <div class="rounded-2xl border p-2" style="border-color: var(--line); background: var(--surface);">

        <div
          @click="activeSection = 'rezervacije'"
          class="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer"
          :style="activeSection === 'rezervacije' ? 'background: var(--accent-soft);' : ''"
        >
          <span class="text-sm" :style="activeSection === 'rezervacije' ? 'color: var(--ink); font-weight:500;' : 'color: var(--ink-soft);'">
            Rezervacije
          </span>
        </div>

        <div
          @click="activeSection = 'notifikacije'"
          class="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer"
          :style="activeSection === 'notifikacije' ? 'background: var(--accent-soft);' : ''"
        >
          <span class="text-sm" :style="activeSection === 'notifikacije' ? 'color: var(--ink); font-weight:500;' : 'color: var(--ink-soft);'">
            Notifikacije
          </span>
          <span
            v-if="unreadCount > 0"
            class="w-5 h-5 rounded-full text-white text-[10px] flex items-center justify-center"
            style="background: #A33A3A;"
          >
            {{ unreadCount }}
          </span>
        </div>

        <div
          @click="activeSection = 'profil'"
          class="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer"
          :style="activeSection === 'profil' ? 'background: var(--accent-soft);' : ''"
        >
          <span class="text-sm" :style="activeSection === 'profil' ? 'color: var(--ink); font-weight:500;' : 'color: var(--ink-soft);'">
            Profil
          </span>
        </div>

      </div>
    </div>

    <!-- GLAVNI SADRZAJ -->
    <div class="md:col-span-2">

      <!-- REZERVACIJE -->
      <div v-if="activeSection === 'rezervacije'">
        <p class="text-xs tracking-[0.2em] uppercase mb-3" style="color: var(--accent);">Rezervacije</p>
        <h1 class="font-display text-3xl mb-8">Vaše rezervacije</h1>

        <div v-if="loading" class="text-sm" style="color: var(--ink-soft);">Učitavanje...</div>

        <div v-else-if="myReservations.length === 0" class="text-sm" style="color: var(--ink-soft);">
          Nemate aktivnih rezervacija.
          <router-link to="/termini" class="font-medium" style="color: var(--accent);">Rezervišite sto</router-link>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="r in myReservations"
            :key="r.id"
            class="rounded-2xl border p-5 flex items-center justify-between"
            style="border-color: var(--line); background: var(--surface);"
          >
            <div>
              <p class="font-display text-lg mb-1">{{ r.serviceName }} — Sto {{ r.tableNumber }}</p>
              <p class="text-sm" style="color: var(--ink-soft);">{{ r.date }} u {{ r.time }}</p>
            </div>
            <button
              @click="handleCancel(r.id)"
              :disabled="cancellingId === r.id"
              class="text-sm px-4 py-2 rounded-full border cursor-pointer"
              style="border-color: var(--line); color: #A33A3A;"
            >
              {{ cancellingId === r.id ? 'Otkazujem...' : 'Otkaži' }}
            </button>
          </div>
        </div>
      </div>

      <!-- NOTIFIKACIJE -->
      <div v-else-if="activeSection === 'notifikacije'">
        <p class="text-xs tracking-[0.2em] uppercase mb-3" style="color: var(--accent);">Notifikacije</p>
        <h1 class="font-display text-3xl mb-8">Vaša obaveštenja</h1>

        <div v-if="notifications.length === 0" class="text-sm" style="color: var(--ink-soft);">
          Nemate obaveštenja.
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="n in notifications"
            :key="n.id"
            @click="!n.isRead && markRead(n.id)"
            class="rounded-xl border p-4 flex items-start gap-3 cursor-pointer"
            :style="n.isRead
              ? 'border-color: var(--line); opacity: 0.5;'
              : 'border-color: var(--line); background: var(--accent-soft);'"
          >
            <div
              class="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
              :style="n.isRead ? 'background: var(--ink-soft);' : 'background: var(--accent);'"
            ></div>
            <div>
              <p class="text-sm mb-1">{{ n.message }}</p>
              <p class="text-xs" style="color: var(--ink-soft);">
                {{ n.isRead ? 'pročitano' : 'nepročitano · klikni da označiš' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- PROFIL -->
      <div v-else-if="activeSection === 'profil'">
        <p class="text-xs tracking-[0.2em] uppercase mb-3" style="color: var(--accent);">Profil</p>
        <h1 class="font-display text-3xl mb-8">Vaši podaci</h1>

        <div class="rounded-2xl border p-6" style="border-color: var(--line); background: var(--surface);">
          <div class="mb-5">
            <label class="block text-xs uppercase tracking-wider mb-2" style="color: var(--ink-soft);">Ime i prezime</label>
            <p class="text-sm">{{ authStore.user?.fullName }}</p>
          </div>
          <div>
            <label class="block text-xs uppercase tracking-wider mb-2" style="color: var(--ink-soft);">Email</label>
            <p class="text-sm">{{ authStore.user?.email }}</p>
          </div>
        </div>

        <div class="rounded-2xl border p-6 mt-6" style="border-color: var(--line); background: var(--surface);">
          <p class="font-display text-lg mb-5">Promena lozinke</p>

          <form @submit.prevent="handleChangePassword" class="space-y-4">
            <div>
              <label class="block text-xs uppercase tracking-wider mb-2" style="color: var(--ink-soft);">Trenutna lozinka</label>
              <input
                type="password"
                v-model="oldPassword"
                class="w-full px-4 py-3 rounded-xl border text-sm"
                style="border-color: var(--line);"
              />
            </div>
            <div>
              <label class="block text-xs uppercase tracking-wider mb-2" style="color: var(--ink-soft);">Nova lozinka</label>
              <input
                type="password"
                v-model="newPassword"
                placeholder="Najmanje 6 karaktera"
                class="w-full px-4 py-3 rounded-xl border text-sm"
                style="border-color: var(--line);"
              />
            </div>
            <div>
              <label class="block text-xs uppercase tracking-wider mb-2" style="color: var(--ink-soft);">Potvrdi novu lozinku</label>
              <input
                type="password"
                v-model="confirmPassword"
                class="w-full px-4 py-3 rounded-xl border text-sm"
                style="border-color: var(--line);"
              />
            </div>

            <div v-if="passwordError" class="text-sm rounded-lg px-4 py-3" style="background: #FBEAEA; color: #A33A3A;">
              {{ passwordError }}
            </div>
            <div v-if="passwordSuccess" class="text-sm rounded-lg px-4 py-3" style="background: #E4F3E8; color: #2F6B3F;">
              {{ passwordSuccess }}
            </div>

            <button
              type="submit"
              :disabled="changingPassword"
              class="px-6 py-3 rounded-full text-white text-sm font-medium cursor-pointer"
              style="background: var(--accent);"
            >
              {{ changingPassword ? 'Menjam...' : 'Promeni lozinku' }}
            </button>
          </form>
        </div>
      </div>

    </div>
  </section>
</template>