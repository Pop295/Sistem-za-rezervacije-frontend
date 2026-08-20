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

  async getReservations() {
    if (USE_MOCK_RESERVATIONS) {
      await delay()
      return mockReservations
    }
    const { data } = await api.get('/reservations')
    return data
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