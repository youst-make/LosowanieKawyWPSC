# ☕ Coffee Draw App

Aplikacja do losowego wybierania osób z zespołu, które kupują kawę.

## 🎯 Funkcje

- ➕ Dodawanie i usuwanie członków zespołu
- 👤 Awatary dla każdego uczestnika (specjalne grafiki lub inicjały)
- ✈️ Oznaczanie osób na urlopie (wykluczenie z losowania)
- 🎲 Losowanie z animacją
- 🔄 System rundowy - każdy zostaje wylosowany raz przed resetem
- 📊 Pasek postępu pokazujący stan rundy
- 📜 Historia ostatnich 6 losowań
- 🎉 Animacja confetti po wylosowaniu

## 🚀 Jak używać

1. Dodaj członków zespołu wpisując imiona w pole tekstowe
2. Oznacz osoby na urlopie klikając ikonę samolotu
3. Kliknij "Losuj" aby wylosować osobę
4. System automatycznie śledzi kto został już wylosowany w bieżącej rundzie
5. Po wylosowaniu wszystkich, runda resetuje się automatycznie

## 🛠️ Technologie

- React + TypeScript
- Tailwind CSS v4
- Vite
- canvas-confetti (animacje)
- lucide-react (ikony)

## 📦 Instalacja

```bash
# Instalacja zależności
pnpm install

# Uruchomienie w trybie deweloperskim
pnpm dev

# Build produkcyjny
pnpm build
```

## 📝 Uwaga o localStorage

W środowisku Figma Make dane przechowywane w localStorage nie są zachowywane między sesjami. Przy standardowym użyciu w przeglądarce dane będą persystować.

## ☕ Linki do kupienia kawy

- [Blue Orca Coffee](https://allegro.pl/uzytkownik/Blue_Orca_Coffee)
- [Yankee Caffee](https://allegro.pl/uzytkownik/YankeeCaffee)

## 📄 Licencja

MIT

---

**Kawa prawem, nie towarem!** ☕
