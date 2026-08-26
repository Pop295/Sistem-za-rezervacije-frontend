import api, { USE_MOCK_RESERVATIONS } from "./api";
import { delay, mockReservations, mockServices } from "./mock";

export const timeslotsService = {
  async getServices() {
    if (USE_MOCK_RESERVATIONS) {
      await delay();
      return mockServices;
    }
    const { data } = await api.get("/services");
    return data;
  },

  // "Moje rezervacije" - koristi se u Dashboard.vue
  async getReservations() {
    if (USE_MOCK_RESERVATIONS) {
      await delay();
      return mockReservations;
    }
    const { data } = await api.get("/reservations");
    return data;
  },

  // Zauzetost SVIH stolova - koristi se u ReservationCalendar.vue (drugarev patch)
  async getTableAvailability() {
    if (USE_MOCK_RESERVATIONS) {
      await delay();
      return mockReservations;
    }
    const { data } = await api.get("/timeslots");
    return data
      .filter((t) => !t.isAvailable)
      .map((t) => ({
        id: t.id,
        serviceId: t.serviceId,
        tableNumber: t.tableNumber,
        date: t.date,
        startTime: t.time,
      }));
  },

  async createReservation(payload) {
    if (USE_MOCK_RESERVATIONS) {
      await delay();
      const newReservation = { id: Date.now(), ...payload };
      mockReservations.push(newReservation);
      return newReservation;
    }
    const { data } = await api.post("/reservations", payload);
    return data;
  },

  async cancelReservation(id) {
    if (USE_MOCK_RESERVATIONS) {
      await delay();
      const index = mockReservations.findIndex((r) => r.id === id);
      if (index !== -1) mockReservations.splice(index, 1);
      return true;
    }
    await api.delete(`/reservations/${id}`);
    return true;
  },
};
