# atronom — Kalkulator ROI budżetu marketingowego

Aplikacja internetowa: podajesz roczny budżet, dzielisz go między kategorie
(social media, www, radio itd.), dla każdej określasz udział % i oczekiwany ROI %,
a aplikacja liczy całkowity zwrot z inwestycji.

Specyfikacja: [PRD.md](PRD.md).

## Uruchomienie

Otwórz `index.html` w przeglądarce — bez serwera i bez instalacji.

## Obliczenia

- inwestycja w kategorię = budżet × udział %
- zysk kategorii = inwestycja × ROI %
- **całkowity ROI** = Σ zysków / Σ inwestycji × 100 (średnia ważona kwotą)

## Testy

```sh
node --test
```
