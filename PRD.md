# PRD: Kalkulator ROI budżetu marketingowego

## 1. Cel

Prosta aplikacja internetowa, w której użytkownik podaje **roczny budżet** marketingowy,
dzieli go między **kategorie** (np. social media, strona www, radio) i dla każdej kategorii
określa oczekiwany **zwrot z inwestycji (ROI)**. Aplikacja na bieżąco liczy **całkowity
zwrot z inwestycji** dla całego budżetu.

## 2. Użytkownicy

- Marketer / właściciel małej firmy planujący budżet na rok.
- Osoba przygotowująca szybkie symulacje „co jeśli” (zmiana podziału budżetu lub założeń ROI).

## 3. Wymagania funkcjonalne

### F1. Roczny budżet
- Pole liczbowe „Roczny budżet” (PLN), wartość ≥ 0.

### F2. Kategorie
- Lista kategorii; domyślnie: Social media, Strona www, Radio.
- Użytkownik może **dodać** kategorię, **zmienić nazwę** i **usunąć** kategorię.
- Dla każdej kategorii użytkownik podaje:
  1. **Udział w budżecie (%)** — wartość 0–100,
  2. **Oczekiwany ROI (%)** — dowolna liczba (może być ujemna, np. −20% = strata).
- Dla każdej kategorii aplikacja pokazuje:
  - kwotę inwestycji = budżet × udział%,
  - oczekiwany zysk = kwota × ROI%,
  - przychód (zwrot brutto) = kwota + zysk.

### F3. Wyniki łączne
- **Zainwestowano** — suma kwot wszystkich kategorii.
- **Oczekiwany zysk** — suma zysków kategorii.
- **Całkowity ROI (%)** = łączny zysk / łączna zainwestowana kwota × 100
  (średnia ważona ROI kategorii, wagą jest kwota inwestycji).
- **Wartość końcowa** = zainwestowano + zysk.

### F4. Walidacja
- Suma udziałów kategorii powinna wynosić 100%.
  - < 100%: komunikat ostrzegawczy z niewykorzystaną kwotą (nieprzydzielone środki nie
    są liczone do ROI).
  - \> 100%: komunikat o błędzie (przekroczenie budżetu); wyniki są nadal liczone,
    ale wyraźnie oznaczone.
- Pola z niepoprawną wartością (ujemny budżet, udział poza 0–100) są podświetlone.

### F5. Trwałość danych
- Ostatni stan formularza zapamiętywany w przeglądarce (localStorage); brak dostępu do
  localStorage nie blokuje działania aplikacji.
- Przycisk „Resetuj” przywraca dane domyślne.

## 4. Wymagania niefunkcjonalne

- Działa bez serwera i bez instalacji — wystarczy otworzyć `index.html`.
- Brak zewnętrznych zależności.
- Interfejs w języku polskim, kwoty formatowane jako PLN (`pl-PL`).
- Responsywny (działa na telefonie), obsługuje tryb jasny i ciemny.
- Logika obliczeń w osobnym module z testami jednostkowymi (`node --test`).

## 5. Poza zakresem (v1)

- Konta użytkowników, zapis na serwerze.
- Wiele scenariuszy / porównywanie wariantów.
- Rozkład budżetu w czasie (miesiące, kwartały).

## 6. Kryteria akceptacji

- Budżet 100 000 PLN; Social media 50% / ROI 20%, Strona www 30% / ROI 10%,
  Radio 20% / ROI 5% → zysk 14 000 PLN, całkowity ROI 14%, wartość końcowa 114 000 PLN.
- Zmiana dowolnego pola natychmiast aktualizuje wyniki.
- Suma udziałów ≠ 100% wyświetla odpowiedni komunikat.
