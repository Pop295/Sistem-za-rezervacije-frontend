// Servis za usluge (prostorije) i termine
// Isti princip kao auth.service.js - USE_MOCK prekidac odlucuje da li vracamo
// lazne podatke ili zovemo pravi backend

import api, { USE_MOCK } from './api'
import { delay, mockTimeSlots, mockServices } from './mock'

export const timeslotsService = {
  async getServices() {
    if (USE_MOCK) {
      await delay()
      return mockServices
    }
    const { data } = await api.get('/services')
    return data
  },

  async getTimeSlots() {
    if (USE_MOCK) {
      await delay()
      return mockTimeSlots
    }
    const { data } = await api.get('/timeslots')
    return data
  }
}