// Servis za notifikacije. Backend sad ima NotificationsController (drug ga je
// zavrsio), pa vise ne koristimo mock podatke - pozivamo prave endpoint-e.
// Sam sadrzaj notifikacija (potvrda rezervacije i podsetnik 12h pre termina)
// kreira SERVER - ovaj servis samo cita/oznacava kao procitano/brise.
import api from './api'

export const notificationsService = {
  async getNotifications() {
    const { data } = await api.get('/notifications')
    return data
  },

  async markAsRead(id) {
    const { data } = await api.put(`/notifications/${id}/read`)
    return data
  },

  async deleteNotification(id) {
    await api.delete(`/notifications/${id}`)
    return true
  }
}