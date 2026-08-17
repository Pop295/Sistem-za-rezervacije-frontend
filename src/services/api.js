import axios from 'axios'

// Kad backend bude gotov, promeni na false
export const USE_MOCK = false

const api = axios.create({
  baseURL: 'http://localhost:5127/api', // prilagodi kad backend bude gotov
})

export default api

