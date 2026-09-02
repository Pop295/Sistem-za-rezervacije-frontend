<script setup>
import { ref, onMounted } from 'vue'
import { adminService } from '../services/admin.service'
import { timeslotsService } from '../services/timeslots.service'

const activeSection = ref('korisnici')

// --- Korisnici ---
const users = ref([])
const loadingUsers = ref(true)

async function loadUsers() {
  loadingUsers.value = true
  users.value = await adminService.getUsers()
  loadingUsers.value = false
}

async function handleRoleChange(user, newRole) {
  await adminService.updateUserRole(user.id, newRole)
  await loadUsers()
}

async function handleDeactivateUser(id) {
  await adminService.deactivateUser(id)
  await loadUsers()
}

// --- Prostorije ---
const services = ref([])
const loadingServices = ref(true)

const newService = ref({ name: '', description: '', durationMinutes: 120, price: 0, tableCount: 1 })
const editingServiceId = ref(null)

async function loadServices() {
  loadingServices.value = true
  services.value = await timeslotsService.getServices()
  loadingServices.value = false
}

async function handleCreateService() {
  await adminService.createService(newService.value)
  newService.value = { name: '', description: '', durationMinutes: 120, price: 0, tableCount: 1 }
  await loadServices()
}

function startEditService(service) {
  editingServiceId.value = service.id
  newService.value = { ...service }
}

async function handleUpdateService() {
  await adminService.updateService(editingServiceId.value, newService.value)
  editingServiceId.value = null
  newService.value = { name: '', description: '', durationMinutes: 120, price: 0, tableCount: 1 }
  await loadServices()
}

async function handleDeactivateService(id) {
  await adminService.deactivateService(id)
  await loadServices()
}

// --- Rezervacije ---
const reservations = ref([])
const loadingReservations = ref(true)

async function loadReservations() {
  loadingReservations.value = true
  reservations.value = await adminService.getAllReservations()
  loadingReservations.value = false
}

async function handleStatusChange(reservation, newStatus) {
  await adminService.updateReservationStatus(reservation.id, newStatus)
  await loadReservations()
}

onMounted(async () => {
  await loadUsers()
  await loadServices()
  await loadReservations()
})
</script>

<template>
  <section class="max-w-6xl mx-auto px-6 pt-16 pb-24 grid md:grid-cols-4 gap-10">

    <!-- SAJDBAR -->
    <div>
      <p class="text-xs uppercase tracking-wider mb-4" style="color: var(--ink-soft);">Admin panel</p>
      <div class="rounded-2xl border p-2" style="border-color: var(--line); background: var(--surface);">
        <div
          @click="activeSection = 'korisnici'"
          class="px-4 py-3 rounded-xl cursor-pointer text-sm"
          :style="activeSection === 'korisnici' ? 'background: var(--accent-soft); color: var(--ink); font-weight:500;' : 'color: var(--ink-soft);'"
        >
          Korisnici
        </div>
        <div
          @click="activeSection = 'prostorije'"
          class="px-4 py-3 rounded-xl cursor-pointer text-sm"
          :style="activeSection === 'prostorije' ? 'background: var(--accent-soft); color: var(--ink); font-weight:500;' : 'color: var(--ink-soft);'"
        >
          Prostorije
        </div>
        <div
          @click="activeSection = 'rezervacije'"
          class="px-4 py-3 rounded-xl cursor-pointer text-sm"
          :style="activeSection === 'rezervacije' ? 'background: var(--accent-soft); color: var(--ink); font-weight:500;' : 'color: var(--ink-soft);'"
        >
          Rezervacije
        </div>
      </div>
    </div>

    <!-- GLAVNI SADRZAJ -->
    <div class="md:col-span-3">

      <!-- KORISNICI -->
      <div v-if="activeSection === 'korisnici'">
        <h1 class="font-display text-3xl mb-8">Korisnici</h1>
        <div v-if="loadingUsers" class="text-sm" style="color: var(--ink-soft);">Učitavanje...</div>
        <div v-else class="space-y-3">
          <div
            v-for="u in users"
            :key="u.id"
            class="rounded-2xl border p-5 flex items-center justify-between gap-4"
            style="border-color: var(--line); background: var(--surface);"
          >
            <div>
              <p class="text-xs uppercase tracking-wider mb-1" style="color: var(--ink-soft);">Korisnik</p>
              <p class="font-display text-lg">{{ u.fullName }}</p>
              <p class="text-sm" style="color: var(--ink-soft);">{{ u.email }} · {{ u.phone || 'bez telefona' }}</p>
            </div>
            <div class="flex items-end gap-2">
              <div>
                <label class="block text-xs uppercase tracking-wider mb-2" style="color: var(--ink-soft);">Uloga</label>
                <select
                  :value="u.roleName"
                  @change="handleRoleChange(u, $event.target.value)"
                  class="px-3 py-2 rounded-lg border text-sm"
                  style="border-color: var(--line);"
                >
                  <option value="korisnik">korisnik</option>
                  <option value="admin">admin</option>
                </select>
              </div>
              <button
                @click="handleDeactivateUser(u.id)"
                class="text-sm px-4 py-2 rounded-full border cursor-pointer"
                style="border-color: var(--line); color: #A33A3A;"
              >
                Deaktiviraj
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- PROSTORIJE -->
      <div v-else-if="activeSection === 'prostorije'">
        <h1 class="font-display text-3xl mb-8">Prostorije</h1>

        <!-- Forma za dodavanje/izmenu -->
        <div class="rounded-2xl border p-6 mb-6" style="border-color: var(--line); background: var(--surface);">
          <p class="font-display text-lg mb-4">{{ editingServiceId ? 'Izmeni prostoriju' : 'Dodaj novu prostoriju' }}</p>
          <div class="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-xs uppercase tracking-wider mb-2" style="color: var(--ink-soft);">Naziv</label>
              <input v-model="newService.name" placeholder="npr. Terasa" class="w-full px-4 py-2 rounded-lg border text-sm" style="border-color: var(--line);" />
            </div>
            <div>
              <label class="block text-xs uppercase tracking-wider mb-2" style="color: var(--ink-soft);">Opis</label>
              <input v-model="newService.description" placeholder="Kratak opis prostorije" class="w-full px-4 py-2 rounded-lg border text-sm" style="border-color: var(--line);" />
            </div>
            <div>
              <label class="block text-xs uppercase tracking-wider mb-2" style="color: var(--ink-soft);">Trajanje rezervacije (minuti)</label>
              <input v-model.number="newService.durationMinutes" type="number" placeholder="120" class="w-full px-4 py-2 rounded-lg border text-sm" style="border-color: var(--line);" />
            </div>
            <div>
              <label class="block text-xs uppercase tracking-wider mb-2" style="color: var(--ink-soft);">Cena</label>
              <input v-model.number="newService.price" type="number" placeholder="0" class="w-full px-4 py-2 rounded-lg border text-sm" style="border-color: var(--line);" />
            </div>
            <div>
              <label class="block text-xs uppercase tracking-wider mb-2" style="color: var(--ink-soft);">Broj stolova</label>
              <input v-model.number="newService.tableCount" type="number" placeholder="10" class="w-full px-4 py-2 rounded-lg border text-sm" style="border-color: var(--line);" />
            </div>
          </div>
          <button
            @click="editingServiceId ? handleUpdateService() : handleCreateService()"
            class="px-6 py-2.5 rounded-full text-white text-sm font-medium cursor-pointer"
            style="background: var(--accent);"
          >
            {{ editingServiceId ? 'Sačuvaj izmene' : 'Dodaj prostoriju' }}
          </button>
        </div>

        <div v-if="loadingServices" class="text-sm" style="color: var(--ink-soft);">Učitavanje...</div>
        <div v-else class="space-y-3">
          <div
            v-for="s in services"
            :key="s.id"
            class="rounded-2xl border p-5 flex items-center justify-between gap-4"
            style="border-color: var(--line); background: var(--surface);"
          >
            <div>
              <p class="text-xs uppercase tracking-wider mb-1" style="color: var(--ink-soft);">Prostorija</p>
              <p class="font-display text-lg">{{ s.name }} — {{ s.tableCount }} stolova</p>
              <p class="text-sm" style="color: var(--ink-soft);">{{ s.description }}</p>
            </div>
            <div class="flex items-center gap-2">
              <button @click="startEditService(s)" class="text-sm px-4 py-2 rounded-full border cursor-pointer" style="border-color: var(--line); color: var(--ink-soft);">
                Izmeni
              </button>
              <button @click="handleDeactivateService(s.id)" class="text-sm px-4 py-2 rounded-full border cursor-pointer" style="border-color: var(--line); color: #A33A3A;">
                Deaktiviraj
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- REZERVACIJE -->
      <div v-else-if="activeSection === 'rezervacije'">
        <h1 class="font-display text-3xl mb-8">Sve rezervacije</h1>
        <div v-if="loadingReservations" class="text-sm" style="color: var(--ink-soft);">Učitavanje...</div>
        <div v-else class="space-y-3">
          <div
            v-for="r in reservations"
            :key="r.id"
            class="rounded-2xl border p-5 flex items-center justify-between gap-4"
            style="border-color: var(--line); background: var(--surface);"
          >
            <div>
              <p class="text-xs uppercase tracking-wider mb-1" style="color: var(--ink-soft);">Rezervacija</p>
              <p class="font-display text-lg">{{ r.serviceName }} — Sto {{ r.tableNumber }}</p>
              <p class="text-sm" style="color: var(--ink-soft);">{{ r.date }} u {{ r.time }}</p>
            </div>
            <div>
              <label class="block text-xs uppercase tracking-wider mb-2" style="color: var(--ink-soft);">Status</label>
              <select
                :value="r.status"
                @change="handleStatusChange(r, $event.target.value)"
                class="px-3 py-2 rounded-lg border text-sm"
                style="border-color: var(--line);"
              >
                <option value="pending">pending</option>
                <option value="confirmed">confirmed</option>
                <option value="cancelled">cancelled</option>
                <option value="completed">completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>