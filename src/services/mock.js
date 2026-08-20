// Konstante za rezervacije - lako izmenjive na jednom mestu
export const OPENING_HOUR = 9   // restoran otvara u 9h
export const CLOSING_HOUR = 1   // restoran zatvara u 1h (posle ponoci)
export const RESERVATION_DURATION_HOURS = 2  // koliko dugo traje jedna rezervacija

// delay() simulira mrežno kašnjenje da UI (loading spinneri i sl.) izgleda realistično i tokom mock faze
export function delay(ms = 500) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const mockUser = {
  id: 1,
  name: 'Marko Marković',
  email: 'marko@test.com',
}

// Svaka prostorija sad ima i broj stolova koje poseduje
export const mockServices = [
  { id: 1, name: 'Terasa', tableCount: 10 },
  { id: 2, name: 'Glavna sala', tableCount: 15 },
  { id: 3, name: 'Privatna sala', tableCount: 5 },
]

// Rezervacije - svaka govori koji sto, u kojoj prostoriji, kog dana i od kog
// vremena je zauzet. Trajanje je uvek fiksno 2h (racunamo to u kodu, ne
// cuvamo kraj vremena ovde - lakse za izmenu trajanja kasnije)
export const mockReservations = [
  { id: 1, serviceId: 1, tableNumber: 3, date: '2026-08-19', startTime: '18:00' },
  { id: 2, serviceId: 1, tableNumber: 5, date: '2026-08-19', startTime: '18:00' },
  { id: 3, serviceId: 1, tableNumber: 1, date: '2026-08-19', startTime: '20:00' },
  { id: 4, serviceId: 1, tableNumber: 2, date: '2026-08-20', startTime: '19:00' },
  { id: 5, serviceId: 1, tableNumber: 3, date: '2026-08-20', startTime: '19:00' },
  { id: 6, serviceId: 1, tableNumber: 4, date: '2026-08-20', startTime: '19:00' },
  { id: 7, serviceId: 1, tableNumber: 6, date: '2026-08-20', startTime: '19:00' },
  { id: 8, serviceId: 1, tableNumber: 7, date: '2026-08-20', startTime: '19:00' },
  { id: 9, serviceId: 1, tableNumber: 8, date: '2026-08-20', startTime: '19:00' },
  { id: 10, serviceId: 1, tableNumber: 9, date: '2026-08-20', startTime: '19:00' },
  { id: 11, serviceId: 2, tableNumber: 1, date: '2026-08-19', startTime: '18:00' },
]