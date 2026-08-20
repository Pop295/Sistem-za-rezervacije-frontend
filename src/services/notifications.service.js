// Servis za notifikacije. Backend jos nema kontroler za ovo, pa za sada
// uvek vracamo mock podatke (bez USE_MOCK prekidaca kao kod ostalih servisa)
import { delay, mockNotifications } from './mock'

export const notificationsService = {
  async getNotifications() {
    await delay()
    return [...mockNotifications]
  },

  async markAsRead(id) {
    await delay()
    const notification = mockNotifications.find((n) => n.id === id)
    if (notification) notification.isRead = true
    return true
  }
}