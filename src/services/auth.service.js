import api, { USE_MOCK } from "./api";
import { delay, mockUser } from "./mock";
// Promena lozinke jos nema endpoint na backendu - mock za sada
export const USE_MOCK_PASSWORD = true

export const authService = {
  async login(payload) {
    if (USE_MOCK) {
      await delay();
      return {
        token: "mock.jwt.token",
        user: { ...mockUser, email: payload.email },
      };
    }
    const { data } = await api.post("/Auth/login", {
      email: payload.email,
      password: payload.password,
    });
    return data;
  },
  async register(payload) {
    if (USE_MOCK) {
      await delay();
      return {
        token: "mock.jwt.token",
        user: { ...mockUser, name: payload.name, email: payload.email },
      };
    }
    const { data } = await api.post("/Auth/register", {
      fullName: payload.name,
      email: payload.email,
      password: payload.password,
      phone: payload.phone,
    });
    return data;
  },
  async changePassword(payload) {
  if (USE_MOCK_PASSWORD) {
    await delay()
    return { message: 'Lozinka uspešno promenjena' }
  }
  const { data } = await api.put('/Auth/change-password', {
    oldPassword: payload.oldPassword,
    newPassword: payload.newPassword
  })
  return data
}
};
