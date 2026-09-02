import axios from 'axios'
import router from '../router'
import { useAuthStore } from '../stores/auth'

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

// Posle svakog odgovora - ako je backend vratio 401 (Unauthorized), to znaci
// da token vise ne vazi (istekao je posle 2h, ili je neispravan). U tom
// slucaju sami izlogujemo korisnika i posaljemo ga na login, umesto da
// stranica ostane "zaglavljena" (npr. Dashboard koji vecno ucitava).
api.interceptors.response.use(
  (response) => response, // uspesni odgovori prolaze bez izmene
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      const wasLoggedIn = authStore.isAuthenticated
      authStore.logout()

      // Redirect samo ako korisnik NIJE vec na login/register stranici
      // (izbegavamo redirect petlju), i samo ako je stvarno bio ulogovan
      // (da ne bismo redirect-ovali npr. sa /termini stranice pri
      // gostujucem pregledu koji ne zahteva login)
      if (wasLoggedIn && !['/login', '/register'].includes(router.currentRoute.value.path)) {
        router.push({
          path: '/login',
          query: { redirect: router.currentRoute.value.fullPath, expired: '1' },
        })
      }
    }
    return Promise.reject(error)
  }
)

export default api