// Servis za prostorije i rezervacije stolova
import api, { USE_MOCK_RESERVATIONS } from './api'
import { delay, mockReservations, mockServices } from './mock'

export const timeslotsService = {
  async getServices() {
    if (USE_MOCK_RESERVATIONS) {
      await delay()
      return mockServices
    }
    const { data } = await api.get('/services')
    return data
  },

  // Rezervacije SAMO trenutno ulogovanog korisnika (obican korisnik) ili SVE
  // rezervacije (administrator) - backend ovo razdvaja po roli.
  // Namenjeno za "Moje rezervacije" prikaze (npr. Dashboard.vue), NE za
  // prikaz zauzetosti stolova (za to koristiti getTableAvailability ispod).
  async getReservations() {
    if (USE_MOCK_RESERVATIONS) {
      await delay()
      return mockReservations
    }
    const { data } = await api.get('/reservations')
    return data
  },

  // Zauzetost SVIH stolova (svih gostiju) za kalendar dostupnosti
  // (TableAvailability.vue / ReservationCalendar.vue). Koristi javnu rutu
  // GET /api/timeslots umesto GET /api/reservations, jer /api/reservations
  // obicnom korisniku vraca samo NJEGOVE rezervacije (vidi Napomena-za-
  // frontend-tim.docx, Problem 2).
  async getTableAvailability() {
    if (USE_MOCK_RESERVATIONS) {
      await delay()
      return mockReservations
    }
    const { data } = await api.get('/timeslots')
    // Backend (TimeSlotDto) vraca polje "time", a frontend komponente
    // (TableAvailability.vue) ocekuju "startTime" - vidi Problem 1 u
    // Napomena-za-frontend-tim.docx. Normalizujemo ovde, na jednom mestu,
    // da se komponente ne bi morale menjati.
    return data.map((t) => ({
      id: t.id,
      serviceId: t.serviceId,
      tableNumber: t.tableNumber,
      date: t.date,
      startTime: t.time,
    }))
  },

  // Kreira novu rezervaciju - payload: { serviceId, tableNumber, date, startTime }
  async createReservation(payload) {
    if (USE_MOCK_RESERVATIONS) {
      await delay()
      // Dodajemo u mock niz u memoriji - nestaje na refresh stranice, ocekivano
      // dok radimo sa mock podacima
      const newReservation = { id: Date.now(), ...payload }
      mockReservations.push(newReservation)
      return newReservation
    }
    const { data } = await api.post('/reservations', payload)
    return data
  },

  async cancelReservation(id) {
  if (USE_MOCK_RESERVATIONS) {
    await delay()
    const index = mockReservations.findIndex((r) => r.id === id)
    if (index !== -1) mockReservations.splice(index, 1)
    return true
  }
  await api.delete(`/reservations/${id}`)
  return true
}
}