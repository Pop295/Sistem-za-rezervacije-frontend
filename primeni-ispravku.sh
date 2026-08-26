#!/usr/bin/env bash
#
# primeni-ispravku.sh
#
# Primenjuje ispravku iz "Napomena-za-frontend-tim.docx" na frontend repo
# (Sistem-za-rezervacije-frontend), preko standardnih git komandi.
#
# Sta radi:
#   1. Proverava da si pokrenuo skriptu iz korena frontend repoa.
#   2. Pravi novu granu (branch) za ovu ispravku.
#   3. Primenjuje priloženi patch fajl (ispravka.patch) preko `git apply`.
#   4. Pravi commit sa opisom izmene.
#
# Sta se menja (vidi Napomena-za-frontend-tim.docx za detalje):
#   - src/services/timeslots.service.js
#       Dodata nova funkcija getTableAvailability() koja:
#         * zove GET /api/timeslots (javna ruta, vraca zauzetost SVIH gostiju)
#           umesto GET /api/reservations (koja obicnom korisniku vraca SAMO
#           njegove rezervacije - Problem 2 iz dokumenta).
#         * normalizuje backend polje "time" u "startTime" koje
#           TableAvailability.vue ocekuje (Problem 1 iz dokumenta).
#       getReservations() OSTAJE nepromenjena i i dalje se koristi tamo gde
#       treba prikaz "Mojih rezervacija" (Dashboard.vue).
#   - src/components/ReservationCalendar.vue
#       Prikaz kalendara dostupnosti sada zove getTableAvailability() umesto
#       getReservations().
#
# Upotreba:
#   1. Iskopiraj ovaj fajl i ispravka.patch u koren tvog lokalnog klona
#      Sistem-za-rezervacije-frontend repoa (ili prosledi putanju kao
#      argument, videti ispod).
#   2. chmod +x primeni-ispravku.sh
#   3. ./primeni-ispravku.sh
#
# Opciono, prvi argument je putanja do frontend repoa ako skriptu ne
# pokrecas iz njega:
#   ./primeni-ispravku.sh /putanja/do/Sistem-za-rezervacije-frontend

set -euo pipefail

REPO_DIR="${1:-.}"
PATCH_FILE="$(cd "$(dirname "$0")" && pwd)/ispravka.patch"
BRANCH_NAME="fix/table-availability-timeslots"

if [ ! -f "$PATCH_FILE" ]; then
  echo "Greska: ne mogu da nadjem ispravka.patch pored ove skripte." >&2
  echo "Ocekivana putanja: $PATCH_FILE" >&2
  exit 1
fi

cd "$REPO_DIR"

if [ ! -d ".git" ]; then
  echo "Greska: '$REPO_DIR' ne izgleda kao koren git repoa (nema .git foldera)." >&2
  echo "Pokreni skriptu iz korena Sistem-za-rezervacije-frontend repoa, ili prosledi putanju kao argument." >&2
  exit 1
fi

if [ ! -f "src/services/timeslots.service.js" ]; then
  echo "Greska: ovo ne izgleda kao frontend repo (nedostaje src/services/timeslots.service.js)." >&2
  exit 1
fi

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Greska: imas nesacuvane (uncommitted) izmene u repou." >&2
  echo "Sacuvaj ih (commit ili stash) pre pokretanja ove skripte." >&2
  exit 1
fi

echo "Proveravam da li patch moze cisto da se primeni..."
if ! git apply --check "$PATCH_FILE" 2>/tmp/patch-check-err.txt; then
  echo "Greska: patch ne moze da se primeni na trenutno stanje repoa." >&2
  echo "Najcesci razlog: fajlovi su se u medjuvremenu promenili, ili je" >&2
  echo "ispravka vec primenjena ranije. Detalji ispod:" >&2
  cat /tmp/patch-check-err.txt >&2
  exit 1
fi

echo "Pravim granu '$BRANCH_NAME'..."
git switch -c "$BRANCH_NAME"

echo "Primenjujem patch..."
git apply "$PATCH_FILE"

echo "Pravim commit..."
git add src/services/timeslots.service.js src/components/ReservationCalendar.vue
git commit -m "fix: kalendar dostupnosti koristi GET /api/timeslots umesto /api/reservations

- TableAvailability.vue/ReservationCalendar.vue su zavisili od GET
  /api/reservations, koji obicnom korisniku vraca SAMO njegove
  rezervacije, pa su ostali gostiju stolovi izgledali slobodni.
- Dodata timeslotsService.getTableAvailability() koja koristi javnu
  rutu GET /api/timeslots (vraca zauzetost svih gostiju) i normalizuje
  polje 'time' u 'startTime' koje frontend komponente ocekuju.
- getReservations() je nepromenjena i i dalje se koristi za prikaz
  \"Mojih rezervacija\" (Dashboard.vue).

Vidi: Napomena-za-frontend-tim.docx"

echo ""
echo "Gotovo. Izmene su na grani '$BRANCH_NAME', spremne za pregled/push:"
echo "  git push -u origin $BRANCH_NAME"
echo ""
echo "Napomena: pre povezivanja na pravi backend, ugasi USE_MOCK_RESERVATIONS"
echo "u src/services/api.js (postavi na false)."
