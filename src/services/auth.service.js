import api, { USE_MOCK } from './api'
import { delay, mockUser } from './mock'

export const authService = {
  async login(payload) {
    if (USE_MOCK) {
      await delay()
      return { token: 'mock.jwt.token', user: { ...mockUser, email: payload.email } }
    }
    const { data } = await api.post('/Auth/login', {
      email: payload.email,
      password: payload.password,
    })
    return data
  },
  async register(payload) {
    if (USE_MOCK) {
      await delay()
      return { token: 'mock.jwt.token', user: { ...mockUser, name: payload.name, email: payload.email } }
    }
    const { data } = await api.post('/Auth/register', {
      fullName: payload.name,
      email: payload.email,
      password: payload.password,
      phone: payload.phone,
    })
    return data
  }
}