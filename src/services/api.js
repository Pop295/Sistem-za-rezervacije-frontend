import axios from 'axios'

// Auth backend je gotov i povezan - koristimo prave podatke
export const USE_MOCK = false

// Termini/rezervacije jos nemaju kontroler na backendu - ostajemo na mock podacima
// Promeni na false kad drugar napravi TimeSlots/Reservations kontroler
export const USE_MOCK_RESERVATIONS = true

const api = axios.create({
  baseURL: 'http://localhost:5127/api',
})

export default api