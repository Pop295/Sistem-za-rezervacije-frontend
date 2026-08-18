// delay() simulira mrežno kašnjenje da UI (loading spinneri i sl.) izgleda realistično i tokom mock faze
export function delay(ms = 500) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const mockUser = {
  id: 1,
  name: 'Marko Marković',
  email: 'marko@test.com',
}

// Podaci o restoranskim prostorijama (usluge)
export const mockServices = [
  { id: 1, name: 'Terasa' },
  { id: 2, name: 'Glavna sala' },
  { id: 3, name: 'Privatna sala' },
]

// Termini - svaki pripada odredjenoj prostoriji (serviceId), ima datum, vreme
// i da li je slobodan (isAvailable). Neki dani/prostorije imaju vise termina
// nego drugi, namerno, da testiramo crveno/zuto/zeleno bojenje.
export const mockTimeSlots = [
  { id: 1, serviceId: 1, date: '2026-08-19', time: '18:00', isAvailable: true },
  { id: 2, serviceId: 1, date: '2026-08-19', time: '19:30', isAvailable: false },
  { id: 3, serviceId: 1, date: '2026-08-19', time: '21:00', isAvailable: false },
  { id: 4, serviceId: 1, date: '2026-08-20', time: '18:00', isAvailable: false },
  { id: 5, serviceId: 1, date: '2026-08-20', time: '19:30', isAvailable: false },
  { id: 6, serviceId: 2, date: '2026-08-19', time: '18:00', isAvailable: true },
  { id: 7, serviceId: 2, date: '2026-08-19', time: '19:30', isAvailable: true },
  { id: 8, serviceId: 2, date: '2026-08-20', time: '18:00', isAvailable: true },
  { id: 9, serviceId: 3, date: '2026-08-19', time: '20:00', isAvailable: true },
]