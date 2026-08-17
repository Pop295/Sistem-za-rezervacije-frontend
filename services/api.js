import axios from 'axios'

// Ako radis neki dizajn za koji jos nije napravljen kontroler vrati ga na true
export const USE_MOCK = false

const api = axios.create({
  baseURL: 'http://localhost:5127/api', // prilagodjen
})

export default api