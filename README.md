# Sistem za rezervacije – Frontend

Web aplikacija za rezervaciju mesta u restoranu (korisnički interfejs). Komunicira sa REST API-jem iz repozitorijuma [Sistem-za-rezervacije-bekend](https://github.com/Pop295/Sistem-za-rezervacije-bekend).

## Funkcionalnosti

- Registracija i prijava korisnika
- Pregled usluga i slobodnih termina
- Kreiranje, pregled i otkazivanje rezervacija
- Pregled notifikacija
- Admin panel

## Tehnologije

- Vue 3
- Vite
- Pinia (state management)
- Axios (komunikacija sa API-jem)

## Pokretanje

### Preduslovi
- [Node.js](https://nodejs.org/) (verzija <npr. 18+>)
- Pokrenut backend (pogledaj uputstvo u backend repozitorijumu)

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
3. Podesi adresu API-ja: `<npr. u .env fajlu: VITE_API_URL=https://localhost:<port>/api>`
4. Pokreni razvojni server:
   ```bash
   npm run dev
   ```
5. Aplikacija je dostupna na: `http://localhost:5173`

### Mock režim

Za rad bez backenda postoji `USE_MOCK` opcija u API servisnom sloju. Kada je uključena, aplikacija koristi lažne (mock) podatke. 
