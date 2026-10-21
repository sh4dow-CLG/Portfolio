# GSAP — krótkie przykłady animacji napisów

W projekcie GSAP, ScrollTrigger i Lenis są już połączone w `src/layouts/BaseLayout.astro`. Przykłady testuj pojedynczo. Zastępuj istniejącą animację, jeśli używasz tego samego elementu i właściwości.

Kod JS umieszczaj w `<script>` komponentu Astro, poza frontmatter `---`. W osobnym skrypcie potrzebujesz importu:

```js
import { gsap } from 'gsap';
```

Przykładowy cel; dla transformacji span musi być np. `inline-block`:

```html
<span class="demo inline-block">Franciszek</span>
```

## Podstawy

- `gsap.to()` — animuje od aktualnego wyglądu do podanych wartości.
- `gsap.from()` — animuje od podanych wartości do obecnego wyglądu.
- `gsap.fromTo()` — jawnie określa początek i koniec.
- `gsap.set()` — ustawia właściwości natychmiast.
- `x`, `y` — przesunięcie w pikselach; dodatnie w prawo / w dół.
- `xPercent`, `yPercent` — przesunięcie w procentach wymiaru samego elementu.
- `scale`, `scaleX`, `scaleY` — skala; `1` oznacza oryginalny rozmiar.
- `rotation` — obrót w stopniach.
- `opacity` — widoczność od `0` do `1`; `autoAlpha` dodatkowo steruje `visibility`.
- `duration`, `delay` — czas animacji i opóźnienie w sekundach.
- `ease: 'power2.out'` — zwalnia przy końcu; `'none'` oznacza równomierny ruch.
- `repeat: -1`, `yoyo: true` — nieskończone powtórzenia naprzemiennie w obu kierunkach.
- `stagger: 0.1` — opóźnia start kolejnych elementów o 0,1 s.

## Małe przykłady

- **Napis jedzie w prawo →**

```js
gsap.to('.demo', { x: 100, duration: 0.8, ease: 'power2.out' });
```

- **Napis wjeżdża od dołu ↑ i pojawia się**

```js
gsap.from('.demo', { y: 40, opacity: 0, duration: 0.8 });
```

- **Napis jedzie od lewej do prawej ← →**

```js
gsap.fromTo('.demo', { x: -60 }, { x: 60, duration: 1 });
```

- **Litery rosną tylko w pionie ↑**

```js
gsap.to('.demo', { scaleY: 1.3, transformOrigin: 'bottom', duration: 0.6 });
```

- **Napis zmienia grubość** — font variable; wartość w zakresie danej rodziny.

```js
gsap.to('.demo', { fontWeight: 650, duration: 0.6 });
```

- **Napis delikatnie unosi się i opada ↕**

```js
gsap.to('.demo', { y: -12, duration: 1.2,
  repeat: -1, yoyo: true, ease: 'sine.inOut' });
```

- **Imię i nazwisko pojawiają się kolejno** — selektor wybiera dwa istniejące spany, nie pojedyncze litery.

```js
gsap.from('#hero-title span', {
  y: 30, opacity: 0, stagger: 0.15, duration: 0.7,
});
```

- **Timeline: wejście → obrót** — kolejne kroki w jednej sekwencji.

```js
const tl = gsap.timeline();
tl.from('.demo', { y: 30, opacity: 0, duration: 0.6 })
  .to('.demo', { rotation: 4, duration: 0.3 });
```

- `'<'` — trzeci argument `.to()`: zacznij razem z poprzednim krokiem.
- `'-=0.2'` — trzeci argument: zacznij 0,2 s przed końcem poprzedniego kroku.
- `tl.pause()` / `tl.play()` / `tl.reverse()` / `tl.restart()` — zatrzymaj / odtwórz / odwróć / zacznij ponownie.

## ScrollTrigger — ruch powiązany ze scrollem

W osobnym skrypcie dodaj; w obecnym layoucie już jest:

```js
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
```

- **Napis unosi się i znika podczas opuszczania pierwszego ekranu** — zastępuje obecną animację hero.

```js
gsap.to('#hero-title', {
  y: -100, opacity: 0, ease: 'none',
  scrollTrigger: {
    trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true,
  },
});
```

- `trigger` — element wyznaczający zakres przewijania.
- `start: 'top top'` — start, gdy góra triggera dotyka góry okna.
- `start: 'top 80%'` — start, gdy góra triggera osiąga 80% wysokości okna.
- `end: 'bottom top'` — koniec, gdy dół triggera dotyka góry okna.
- `scrub: true` — postęp animacji podąża za scrollem; cofnięcie scrolla cofa efekt.
- `scrub: 0.5` — animacja łagodnie dogania pozycję scrolla.
- `pin: true` — przytrzymuje trigger w widoku na czas aktywnego zakresu.
- `markers: true` — pokazuje pomocnicze linie początku i końca; usuń po testach.
- `once: true` — dla animacji wejścia odtwarzanej jeden raz; zwykle bez `scrub`.
- `toggleActions: 'play none none reverse'` — bez `scrub`: odtwórz przy wejściu, cofnij przy wyjściu wstecz przez początek.
- `ScrollTrigger.refresh()` — przelicz pozycje po zmianie układu, np. po załadowaniu fontów.

## Lenis i porządek w animacjach

- Lenis wygładza przewijanie; GSAP animuje elementy; ScrollTrigger łączy animację ze scrollem.
- W projekcie działa jeden zegar GSAP dla Lenisa. Nie dodawaj kolejnej instancji Lenisa ani `autoRaf: true` obok istniejącego zegara.
- GSAP może animować `h1`, a Tailwind skalować jego dzieci — łatwiej wtedy niezależnie regulować oba efekty.
- Nie dodawaj CSS `transition` na właściwości sterowane przez GSAP.
- `animation.kill()` — zatrzymuje animację; `animation.revert()` przywraca stan sprzed animacji.
- Przy usuwaniu animacji scrolla usuń także jej trigger: `animation.scrollTrigger?.kill()`.
- `respectReducedMotion` w layoucie — obecnie `false` na Twoje życzenie; ta sama wartość jest przekazywana do `new Lenis()`. Sam warunek otaczający skrypt nie wyłącza osobnej kontroli ograniczenia ruchu w Lenisie. `true` pomija efekty dla osób z systemowym ograniczeniem ruchu.
- `lerp: 0.1` — szybkość doganiania docelowej pozycji scrolla; mniejsza wartość daje dłuższą bezwładność, a większa szybszą reakcję.

Źródła: [GSAP — to i parametry](https://gsap.com/docs/v3/GSAP/gsap.to/), [GSAP — ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/).
