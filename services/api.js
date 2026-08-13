import axios from 'axios'

// Kad backend bude gotov, promeni na false
export const USE_MOCK = true

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // prilagodi kad backend bude gotov
})

export default api