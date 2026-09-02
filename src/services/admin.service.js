// Servis za admin funkcionalnosti - upravljanje korisnicima, prostorijama,
// i statusima rezervacija. Sve rute zahtevaju ulogovanog admina (token se
// automatski salje preko interceptora u api.js)
import api from './api'

export const adminService = {
  // Korisnici
  async getUsers() {
    const { data } = await api.get('/users')
    return data
  },
  async updateUserRole(id, roleName) {
    const { data } = await api.put(`/users/${id}/role`, { roleName })
    return data
  },
  async deactivateUser(id) {
    await api.delete(`/users/${id}`)
    return true
  },

  // Prostorije (usluge)
  async createService(payload) {
    const { data } = await api.post('/services', payload)
    return data
  },
  async updateService(id, payload) {
    const { data } = await api.put(`/services/${id}`, payload)
    return data
  },
  async deactivateService(id) {
    await api.delete(`/services/${id}`)
    return true
  },

  // Rezervacije - admin vidi sve (isti endpoint, backend prepoznaje ulogu)
  async getAllReservations() {
    const { data } = await api.get('/reservations')
    return data
  },
  async updateReservationStatus(id, status) {
    const { data } = await api.put(`/reservations/${id}/status`, { status })
    return data
  }
}