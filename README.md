# Portfolio

Minimalny szkielet osobistego portfolio oparty na Astro 7, TypeScript 5.8 w trybie strict oraz Tailwind CSS 4 zintegrowanym przez plugin Vite.

## Uruchomienie

```bash
npm install
npm run dev
```

Pozostałe komendy:

- `npm run check` — sprawdza typy i pliki Astro,
- `npm run build` — sprawdza projekt i tworzy statyczny build,
- `npm run preview` — uruchamia podgląd produkcyjnego buildu.

## Struktura

```text
public/             pliki publiczne kopiowane bez przetwarzania
src/
  assets/           obrazy i inne zasoby przetwarzane przez Astro
  components/       komponenty wielokrotnego użytku
  data/             lokalne dane portfolio i tłumaczenia
  layouts/          wspólne układy stron
  pages/            routing plikowy Astro
  styles/           style globalne i konfiguracja Tailwind
```

## Przebieg utworzenia projektu

1. Utworzono minimalną konfigurację Astro z renderowaniem statycznym.
2. Włączono zalecany przez Astro profil TypeScript `strict`.
3. Podłączono Tailwind CSS 4 bezpośrednio jako plugin Vite w `astro.config.ts`.
4. Dodano podstawowy layout, pustą stronę startową oraz katalogi do dalszej rozbudowy.
5. Dodano skrypty kontroli typów, budowania i lokalnego podglądu.
6. Zainstalowano zależności i zweryfikowano projekt poleceniem `npm run build`.

Projekt celowo nie zawiera gotowej treści portfolio — sekcje, projekty, tłumaczenia i oprawa wizualna pozostają do samodzielnego dodania.
