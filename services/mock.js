// delay() simulira mrežno kašnjenje da UI (loading spinneri i sl.) izgleda realistično i tokom mock faze
export function delay(ms = 500) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const mockUser = {
  id: 1,
  name: 'Marko Marković',
  email: 'marko@test.com',
}