# Czcionki — krótka ściąga

Definicje: `src/styles/global.css`. Napis: `src/pages/index.astro`.

## Dostępne fonty

- `font-supreme` — Supreme, bezszeryfowy; grubość **100–800**.
- `font-sentient` — Sentient, szeryfowy; grubość **200–700**.
- `font-crimson` — Crimson Pro, szeryfowy; grubość **200–900**.
- Wszystkie trzy lokalne pliki mają tylko oś `wght` (grubość). Nie mają osi szerokości ani wysokości. Zakresy sprawdzono w plikach WOFF2.

```html
<span class="font-sentient font-[450]">Franciszek</span>
```

## Modelowanie napisu w Tailwindzie

- `font-[450]` — dokładna grubość; możesz użyć np. `437`, w zakresie danego fontu.
- `font-light` / `font-normal` / `font-bold` — grubość 300 / 400 / 700.
- `text-[9vw]` — rozmiar zależny od szerokości okna; zmienia oba wymiary liter.
- `text-[clamp(2rem,9vw,10rem)]` — rozmiar płynny z dolnym i górnym limitem.
- `tracking-[-0.05em]` — mniejszy odstęp między literami.
- `tracking-[0.03em]` — większy odstęp między literami.
- `leading-none` — wysokość wiersza równa rozmiarowi fontu; nie rozciąga liter.
- `leading-[0.9]` — ciaśniejsze wiersze; tekst może na siebie nachodzić.
- `scale-y-[1.25]` — wizualnie wyższy napis o 25%, bez zmiany szerokości.
- `scale-x-[0.9]` — wizualnie węższy napis o 10%, bez zmiany wysokości.
- `origin-bottom` — punkt skalowania na dole: napis rośnie w górę.
- `inline-block` — pozwala skalować zwykły element `span`.
- `uppercase` — wielkie litery.
- `italic` — kursywa; obecne pliki nie mają odmiany italic, więc przeglądarka może ją sztucznie pochylić.
- `md:scale-y-[1.3]` — zastosowanie proporcji od breakpointu `md`.

```html
<span class="inline-block font-crimson font-[450] tracking-[-0.04em]
             origin-bottom scale-y-[1.25]">Franciszek</span>
```

Skalowanie zmienia kształt liter, ale nie miejsce zarezerwowane w układzie strony. Przy `overflow-hidden` tekst może zostać przycięty. Zmiana grubości może również zmienić szerokość napisu.

W obecnym portfolio skaluj spany wewnątrz `#hero-title`; GSAP przesuwa całe `h1`.

## Jak podłączyć kolejny font

- Plik WOFF2 — umieść w `src/assets/fonts`.
- `@font-face` — osobna definicja dla każdej rodziny/odmiany.
- `font-family` — nazwa, którą sam nadajesz rodzinie w CSS.
- `src` — ścieżka do właściwego pliku; trzy deklaracje `src` w jednym bloku nie tworzą trzech rodzin.
- `font-weight` — rzeczywisty zakres fontu variable; dla statycznego pliku jedna waga.
- `--font-nazwa` w `@theme` — tworzy klasę Tailwinda `font-nazwa`.

Przykład istniejącego połączenia:

```css
@font-face {
  font-family: "Sentient";
  src: url("../assets/fonts/Sentient-Variable.woff2") format("woff2");
  font-weight: 200 700;
  font-style: normal;
  font-display: swap;
}
/* W istniejącym @theme: */
@theme { --font-sentient: "Sentient", serif; }
```

## Gdy zmiana nie działa

- Sprawdź zgodność `font-family` i wartości w `@theme` — np. obie muszą wskazywać `"Crimson Pro"`.
- Zostaw jedną klasę rodziny na elemencie — nie łącz `font-supreme font-crimson`; kolejność klas w HTML nie rozstrzyga nadpisywania.
- Sprawdź dzieci elementu — własna klasa fontu na `span` nadpisuje font odziedziczony z `h1`.
- Używaj pełnych klas — `font-sentient`, a nie składanego dynamicznie `font-${name}`.
- F12 → Network → Font — sprawdź, czy WOFF2 został pobrany bez błędu 404.
- `fontPreload` w `BaseLayout` — tylko przyspiesza pobieranie, nie wybiera kroju. W `index.astro` aktualnie wskazuje Crimson Pro. Po zmianie głównego fontu zmień też import WOFF2 przekazany do tego parametru.

Podstawy nazw i klas: [Tailwind — font-family](https://tailwindcss.com/docs/font-family). Rozciąganie: [Tailwind — scale](https://tailwindcss.com/docs/scale). Deklaracja pliku: [MDN — src](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@font-face/src).
