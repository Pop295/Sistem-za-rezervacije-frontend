# Sistem za rezervacije – Frontend

Web aplikacija za rezervaciju mesta u restoranu (korisnički interfejs). Komunicira sa REST API-jem iz repozitorijuma [Sistem-za-rezervacije-bekend](https://github.com/Pop295/Sistem-za-rezervacije-bekend).

## Funkcionalnosti

- Registracija i prijava korisnika (JWT, token se čuva u `localStorage`)
- Pregled usluga i kalendar dostupnosti stolova po terminima
- Kreiranje i otkazivanje rezervacija
- Korisnički panel: rezervacije, notifikacije, lični podaci i promena lozinke
- Admin panel: upravljanje korisnicima i ulogama, uslugama i statusima rezervacija
- Zaštićene rute (`/dashboard` za prijavljene korisnike, `/admin` samo za administratore)
- Automatska odjava i preusmeravanje na prijavu kada JWT token istekne
- Statične stranice: početna, meni, o nama, česta pitanja

## Tehnologije

- Vue 3
- Vite
- Vue Router
- Pinia (state management)
- Axios (komunikacija sa API-jem)
- Tailwind CSS

## Stranice

| Ruta | Opis | Pristup |
|------|------|---------|
| `/` | Početna | javno |
| `/termini` | Kalendar dostupnosti i rezervacija | javno pregled, rezervacija uz prijavu |
| `/meni`, `/o-nama`, `/pitanja` | Meni, o nama, česta pitanja | javno |
| `/login`, `/register` | Prijava i registracija | javno |
| `/dashboard` | Moje rezervacije, notifikacije, podaci | prijavljen korisnik |
| `/admin` | Administracija | admin |

## Pokretanje

### Preduslovi

- [Node.js](https://nodejs.org/) 20.19+ ili 22.12+ (zahtev novijih verzija Vite-a)
- Pokrenut backend (uputstvo u [backend repozitorijumu](https://github.com/Pop295/Sistem-za-rezervacije-bekend))

### Koraci

1. Kloniraj repozitorijum:
   ```bash
   git clone https://github.com/Pop295/Sistem-za-rezervacije-frontend.git
   cd Sistem-za-rezervacije-frontend
   ```
2. Instaliraj zavisnosti:
   ```bash
   npm install
   ```
3. Proveri adresu API-ja u `src/services/api.js` (podrazumevano `http://localhost:5127/api`, što odgovara backendu pokrenutom sa `dotnet run --launch-profile http`).
4. Pokreni razvojni server:
   ```bash
   npm run dev
   ```
5. Aplikacija je dostupna na `http://localhost:5173`.

### Dostupne komande

| Komanda | Opis |
|---------|------|
| `npm run dev` | Razvojni server |
| `npm run build` | Produkcijski build u folderu `dist/` |
| `npm run preview` | Lokalni pregled produkcijskog builda |

### Mock režim (rad bez backenda)

U `src/services/api.js` i `src/services/auth.service.js` postoje opcije koje uključuju lažne (mock) podatke:

| Opcija | Fajl | Šta uključuje |
|--------|------|---------------|
| `USE_MOCK` | `api.js` | Mock prijava i registracija |
| `USE_MOCK_RESERVATIONS` | `api.js` | Mock usluge, termini i rezervacije |
| `USE_MOCK_PASSWORD` | `auth.service.js` | Mock promena lozinke |

Za rad sa pravim backendom sve tri opcije treba da budu `false` (trenutno podešeno).

## Struktura projekta

```
src/
  components/   Navbar, Footer, Hero, kalendar i dostupnost stolova
  layouts/      DefaultLayout
  pages/        Home, Termini, Login, Register, Dashboard, Admin, Meni, Onama, Qna
  router/       Definicije ruta i zaštita (auth / admin)
  services/     API servisi (auth, timeslots, notifications, admin) i mock podaci
  stores/       Pinia store za autentifikaciju
  utils/        Pomoćne funkcije (JWT)
```

## Autori

- Backend: [@Pop295](https://github.com/Pop295)
- Frontend: [ISSAmaci](https://github.com/ISSAmaci)
