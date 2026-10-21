# Puste boksy — baza przyszłej karuzeli

Ten etap to szesnaście pustych, pionowych boksów na ciemnym tle, pod pierwszym ekranem. Po dojściu do sekcji dalszy scroll myszki przesuwa rząd poziomo, także gdy kursor znajduje się nad pustym tłem. Paski przewijania są ukryte. Rozwijanie kart, zdjęcia, tytuły i animacje WebGL dodamy później.

Gotowy kod znajduje się w `src/components/ProjectBoxes.astro`. Poniższe kroki wyjaśniają jego budowę — komponent jest już podłączony, więc nie dodawaj go drugi raz.

## 1. Oddziel sekcję od strony

Tworzymy `src/components/ProjectBoxes.astro`, żeby układ przyszłej karuzeli miał własny plik. Strona `src/pages/index.astro` będzie tylko wskazywała, gdzie go pokazać.

## 2. Przygotuj liczbę boksów

Na początku komponentu:

```astro
---
const boxes = Array.from({ length: 16 }, (_, index) => index + 1);
---
```

- `---` — frontmatter Astro: miejsce na importy i przygotowanie danych.
- `Array.from()` — tworzy tablicę.
- `length: 16` — liczba elementów.
- `index + 1` — numery od 1 do 16.
- `_` — nieużywany pierwszy argument funkcji; potrzebujemy tylko indeksu.

Wynik to tablica liczb od 1 do 16. W SSG ten kod wykonuje się przy generowaniu strony; przeglądarka dostaje gotowy HTML. Nie potrzebujesz skryptu do narysowania tych boksów.

## 3. Utwórz tło na wysokość ekranu

```astro
<section
  id="Projects"
  aria-label="Projekty"
  class="project-section flex min-h-svh items-center bg-[#141414] py-16"
>
  <!-- Tutaj będzie galeria. -->
</section>
```

- `id="Projects"` — identyfikator sekcji; zapisujemy go raz.
- `min-h-svh` — co najmniej wysokość małego viewportu; przydatne także przy paskach przeglądarki na telefonie.
- `flex items-center` — w tym układzie centruje galerię w pionie.
- `bg-[#141414]` — własny kolor tła.
- `py-16` — miejsce nad i pod galerią; sekcja może urosnąć, jeśli zawartość tego potrzebuje.
- `aria-label` — nazwa sekcji dla technologii asystujących; nie tworzy widocznego napisu.

## 4. Przygotuj obszar przewijania

Wewnątrz sekcji dodaj:

```astro
<div
  role="region"
  aria-label="Przewijana galeria projektów"
  tabindex="0"
  data-project-viewport
  class="project-viewport w-full overflow-x-auto"
>
  <!-- Tutaj będzie rząd boksów. -->
</div>
```

- `w-full` — obszar zajmuje dostępną szerokość.
- `overflow-x-auto` — pozwala przewijać w poziomie, gdy boksy nie mieszczą się w oknie.
- `tabindex="0"` — umożliwia wejście do obszaru klawiszem Tab i przewijanie klawiaturą.
- `data-project-viewport` — pozwala skryptowi znaleźć okno galerii.
- W gotowym pliku są też klasy `focus-visible:*`, które pokazują obrys podczas obsługi klawiaturą.

W `src/styles/global.css` klasy `project-section` i `project-viewport` odpowiadają za ukrycie paska. `scrollbar-width: none` oraz `::-webkit-scrollbar` chowają sam pasek. Po inicjalizacji skrypt ustawia `data-scroll-enhanced`, a CSS zmienia `overflow` na `hidden`: przesuwamy wtedy cały rząd przez transformację. Bez JS pozostaje natywne przewijanie poziome.

Nie dodawaj tutaj `data-lenis-prevent` — przerwałoby wygładzanie scrolla nad boksami. Mechanizm opisany w kroku 10 korzysta z jednego Lenisa dla całej strony.

## 5. Ułóż boksy w jednym rzędzie

W obszarze przewijania:

```astro
<div data-project-track class="mx-auto flex w-max min-w-full justify-center gap-3 px-6 py-4 sm:gap-4 sm:px-12">
  <!-- Tutaj wygenerujemy boksy. -->
</div>
```

- `flex` — układa dzieci obok siebie.
- `w-max` — rząd może być tak szeroki, jak jego zawartość.
- `min-w-full` — gdy boksów jest mało, rząd zajmuje przynajmniej całą szerokość obszaru.
- `justify-center` — centruje boksy, kiedy jest wolne miejsce.
- `gap-3` — odstęp między boksami.
- `px-6 py-4` — wewnętrzne marginesy rzędu.
- `sm:gap-4 sm:px-12` — większe odstępy od breakpointu `sm`.

Połączenie `w-max` i `min-w-full` pozwala centrować krótki rząd, a długi przewijać od jego początku.

## 6. Wygeneruj każdy pusty boks

Wewnątrz rzędu:

```astro
{boxes.map((number) => (
  <div
    data-project-box={number}
    aria-hidden="true"
    class="h-[clamp(20rem,52svh,36rem)] w-[clamp(6rem,10vw,11rem)] shrink-0 border border-white/10 bg-zinc-800"
  ></div>
))}
```

- `.map()` — tworzy jeden element HTML dla każdej liczby.
- `data-project-box` — numer boksu; później pozwoli wyszukiwać karty w skrypcie.
- `h-[...]` / `w-[...]` — wysokość i szerokość.
- `clamp(minimum, wartość płynna, maksimum)` — wymiar rośnie wraz z oknem, ale ma limity.
- `shrink-0` — zabrania flexboxowi ściskać boksy, aby wszystkie zmieściły się na siłę.
- `border border-white/10` — delikatny obrys.
- `bg-zinc-800` — szare wypełnienie.
- `aria-hidden="true"` — ukrywa puste dekoracyjne elementy przed czytnikiem ekranu. Usuń ten atrybut, gdy karta będzie zawierała treść lub link.

Nie ma tu przycisku ani odnośnika: puste boksy jeszcze niczego nie otwierają.

## 7. Podłącz komponent pod hero

W frontmatter `src/pages/index.astro`:

```astro
import ProjectBoxes from '../components/ProjectBoxes.astro';
```

Wewnątrz `<main>`, zaraz po zamknięciu sekcji `#hero`:

```astro
<ProjectBoxes />
```

Komponent zastępuje wcześniejszą pustą sekcję `Projects` oraz pusty obszar indigo. Dzięki temu nie powstaje drugi identyczny identyfikator ani dodatkowy pusty ekran.

## 8. Zmieniaj jedną rzecz naraz

| Co zmienić | Gdzie |
| --- | --- |
| Liczba boksów | `length: 16` |
| Wysokość | `h-[clamp(20rem,52svh,36rem)]` |
| Szerokość | `w-[clamp(6rem,10vw,11rem)]` |
| Odstępy | `gap-3` i `sm:gap-4` |
| Kolor boksów | `bg-zinc-800` |
| Kolor sekcji | `bg-[#141414]` |
| Minimalna wysokość sekcji | `min-h-svh` |

Przykładowo, żeby uzyskać szersze karty, zamień całą klasę szerokości na `w-40`. Nie zostawiaj dwóch konkurujących klas `w-*`.

## 9. Sprawdź efekt

```bash
npm run dev
```

Przewiń poniżej zdjęcia. Kręć kółkiem także nad pustym tłem: sekcja pozostaje na ekranie, a boksy jadą w bok. Cofnij rząd do początku i kontynuuj scroll w górę — wrócisz do hero. Po ustawieniu fokusu w galerii sprawdź też strzałki lewo/prawo oraz Home/End.

```bash
npm run build
```

W tym projekcie build uruchamia także sprawdzenie Astro i TypeScript.

## 10. Płynny ruch poziomy bez paska

Pełny kod: `src/scripts/project-scroll.ts`. Layout wywołuje `initProjectScroll(lenis)` i przekazuje istniejącą instancję Lenisa; nie tworzymy drugiej pętli animacji.

1. **Zmierz drogę.** `track.scrollWidth - viewport.clientWidth` mówi, o ile trzeba przesunąć rząd, aby pokazać jego koniec.
2. **Zatrzymaj sekcję.** `pin: true` utrzymuje sekcję na ekranie od momentu `start: 'top top'`.
3. **Zarezerwuj scroll.** `end: () => '+=' + distance` wyznacza odcinek pionowego scrolla przeznaczony na poziomy ruch. `pinSpacing: true` tworzy potrzebne miejsce w dokumencie.
4. **Przesuń rząd.** `x: () => -distance` przesuwa go w lewo. Scroll wstecz automatycznie cofa tę samą animację.
5. **Połącz z Lenisem.** `scrub: true` oraz `ease: 'none'` odwzorowują już wygładzony scroll. Nie dodajemy drugiej bezwładności na samych boksach.
6. **Obsłuż zmianę rozmiaru.** `invalidateOnRefresh: true` ponownie oblicza drogę po zmianie szerokości okna. `lenis.resize()` aktualizuje długość strony po dodaniu pina.
7. **Posprzątaj.** `context.revert()` usuwa animację, pin i jego odstęp podczas przeładowania kodu; osobno odpinamy listener klawiatury.

Skrócony fragment mechanizmu, już zawarty w projekcie:

```ts
gsap.to(track, {
  x: () => -getDistance(),
  ease: 'none',
  scrollTrigger: {
    trigger: section,
    start: 'top top',
    end: () => `+=${Math.max(1, getDistance())}`,
    pin: true,
    scrub: true,
    invalidateOnRefresh: true,
  },
});
```

`gestureOrientation: 'both'` w Lenisie pozwala sterować postępem zarówno kółkiem, jak i poziomym gestem touchpada. Na dotyku pionowy gest przewija stronę i tym samym przesuwa galerię. Kursor nie musi znajdować się nad kartą. Przed sekcją i po zakończeniu jej odcinka strona przewija się normalnie pionowo.

Kolejny etap to wybranie aktywnego boksu i płynna zmiana jego szerokości. Potem dodamy materiały projektów, animacje kolorów i dopiero deformację WebGL.

Źródła: [wyrażenia i mapowanie w Astro](https://docs.astro.build/en/reference/astro-syntax/), [przewijanie w Tailwindzie](https://tailwindcss.com/docs/overflow), [blokada ściskania elementów](https://tailwindcss.com/docs/flex-shrink).
