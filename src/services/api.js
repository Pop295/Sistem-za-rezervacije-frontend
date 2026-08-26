import axios from 'axios'

export const USE_MOCK = false
export const USE_MOCK_RESERVATIONS = false

const api = axios.create({
  baseURL: 'http://localhost:5127/api',
})

// Pre svakog zahteva, ako postoji token u localStorage, dodaj ga u Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rez_access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api