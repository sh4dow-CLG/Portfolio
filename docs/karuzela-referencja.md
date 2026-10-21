# Karuzela projektów — analiza referencji

Referencja: [Aristide Benoist](https://aristidebenoist.com/). Analiza desktopowej wersji dostępnej 19.10.2026: obserwacja strony, przewijanie, kliknięcie projektu oraz odczyt publicznego HTML, CSS i JS.

## Co rzeczywiście robi strona

- Widok ogólny: poziomy pas wąskich wycinków zdjęć, ciemne tło, wygaszone kolory.
- Kółko myszy steruje przesunięciem poziomym. Kod wybiera silniejszy z kierunków deltaX/deltaY i normalizuje wartość.
- Przeciąganie ma mnożnik 1,2 i próg około 6 px, który odróżnia drag od kliknięcia.
- Pozycja docelowa i aktualna są osobne. Aktualna płynnie dogania docelową; to własny mechanizm tłumienia, a nie natywne przesuwanie listy.
- Zakres ma początek i koniec. Nie jest to nieskończona karuzela.
- Najechanie rozjaśnia konkretną kartę. Podczas ruchu efekt hover jest blokowany; blokada wygasa około 300 ms po ostatnim wejściu scrolla/dragu.
- Kliknięcie rozwija kartę w centralny, szeroki podgląd. Pozostałe karty zmieniają szerokości i pozycje, pojawia się tytuł, numer i odnośnik Explore.
- W rozwiniętym widoku tło i tekst przyjmują kolory przypisane do wybranego projektu. Scroll/drag wraca do widoku ogólnego.

## Skąd rozjaśnianie i kolor

To shader WebGL, nie samo CSS `brightness`.

1. Shader pobiera kolor piksela ze zdjęcia.
2. Tworzy szarość jako średnią kanałów RGB i nadaje tej wersji przezroczystość 0,4.
3. Miesza tę wygaszoną wersję z oryginalnym zdjęciem. Udział oryginału zależy od parametru karty `light` oraz dodatkowego składnika wynikającego z deformacji podczas ruchu.
4. `light` płynnie zbliża się do 1 na hover/aktywnej karcie, a do 0 po wyjściu. W kodzie współczynnik tłumienia światła wynosi 0,1.
5. Oddzielny parametr `multiply` miesza obraz z jego wersją pomnożoną przez kolor tła, przygaszając karty sąsiadujące z aktywną.
6. Kolor tła jest interpolowany kanał po kanale ze współczynnikiem 0,05. Współczynniki są uwzględniane przez funkcję tłumienia zależną od czasu klatki, a nie traktowane jako czas w sekundach.

Efekt „nabierania światła” łączy powrót nasycenia, większą nieprzezroczystość i zmianę zabarwienia. Sam `brightness(1.2)` nie odtworzy go wiernie.

## Ruch i geometria

- Zdjęcia są teksturami na siatkach WebGL z 20 punktami poziomo i 2 pionowo.
- Opóźnienie ruchu steruje obrotem wokół osi Y oraz wygięciem w osi Z.
- Deformacja jest silniejsza w środkowym obszarze; z jej wartości shader wyprowadza dodatkowe rozjaśnienie, ograniczone do 0,7.
- Szerokość karty animuje się niezależnie od kadrowania tekstury, więc obraz nie jest zwyczajnie ściskany do pionowego paska.
- Stan zawiera pozycję, wymiary, światło, przyciemnienie, przezroczystość, przesunięcie obrazu i skalę. Wszystko aktualizuje wspólna pętla renderowania.

## Gdzie to jest w publicznym kodzie

Publiczny [desktop.js](https://aristidebenoist.com/static/js/d.js?2) jest zminimalizowany. Nazwy klas poniżej dotyczą tej konkretnej wersji i mogą się zmienić po aktualizacji strony.

| Miejsce | Odpowiedzialność |
| --- | --- |
| `R.Damp`, `R.Lerp` | Płynne doganianie wartości docelowych |
| Klasa `x` | Normalizacja kółka myszy |
| Klasa `v`: `down`, `move`, `up` | Drag i odróżnienie go od kliknięcia |
| Klasa `v`: `over`, `render` | Hover i płynne przejście parametru `light` |
| Klasa `v`: `modeIn`, `modeOut` | Przełączanie podglądu i ogólnego pasa kart |
| Klasa `O`: `modeIn`, `modeOut` | Docelowe wymiary i pozycje kart |
| Obiekt shaderów `r` | Deformacja w vertex shaderze i mieszanie kolorów w fragment shaderze |
| Klasy `w`, `u`, `g` | Siatki kart, rysowanie WebGL i przekazywanie parametrów shaderowi |
| `light → o`, `multiply → q`, kolor tła `→ p` | Powiązanie danych karty z parametrami fragment shadera |

Sprawdzony bundle zawiera własny system animacji `R.M`/`R.TL` i bezpośrednie wywołania WebGL. Nie należy zakładać, że jest to GSAP, Lenis lub gotowy slider. Strona wybiera osobne pliki dla desktopu i telefonu; powyższy opis dotyczy desktopu.

To analiza kodu wysyłanego przeglądarce. Nie daje dostępu do oryginalnego repozytorium, nieskompresowanych źródeł ani backendu.

## Jak przełożyć to na kolejną sekcję Portfolio

- Sekcja projektów: ciemne tło, pas wąskich kart i dwa stany: przegląd / aktywny projekt.
- Własne miniatury i dane: tytuł, adres projektu, kolor tła i tekstu.
- Na początek Astro + GSAP: animacja szerokości masek, przesunięcia zdjęć, nasycenia, przezroczystości oraz koloru sekcji. To przybliżenie wizualne bez deformacji WebGL.
- Jeśli potrzebujemy identycznego wygięcia, dodajemy własny shader i tekstury; CSS nie odtworzy dokładnie tej geometrii.
- Lenis zostaje odpowiedzialny za scroll strony. Karuzela przejmuje wejście tylko w swoim obszarze, z możliwością wyjścia na początku i końcu, żeby nie blokować całego portfolio.
- Dodajemy przyciski i obsługę klawiatury oraz prostszy widok na dotyk. W referencji obsługa Tab jest przechwytywana — tego zachowania nie warto przenosić.

Obecna zmiana obejmuje test wyglądu hero i naprawę magnesu nagłówka. Karuzela nie jest jeszcze zaimplementowana.
