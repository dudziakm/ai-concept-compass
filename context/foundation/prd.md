# PRD — AI Concept Compass

## Cel produktu

Pomóc polskojęzycznym osobom przygotowującym się do AWS Certified AI
Practitioner znaleźć luki pomiędzy deklarowaną pewnością a faktycznym wynikiem
powtórki.

## Użytkownik i sukces

Użytkownik chce w mniej niż pięć minut ustalić, czego uczyć się dalej. Sukces
MVP oznacza, że po rejestracji może załadować pakiet, ocenić dowolne pojęcie i
otrzymać deterministyczną rekomendację, a żadne dane nie przeciekają między
kontami.

## Wymagania funkcjonalne

1. Rejestracja, logowanie i wylogowanie przez Supabase Auth.
2. Idempotentne skopiowanie 10 globalnych szablonów do prywatnej kolekcji.
3. Tworzenie, odczyt, edycja i usuwanie własnych pojęć.
4. Review z pewnością 1–5 i wynikiem incorrect/partial/correct.
5. Wyliczenie mastery, overconfidence, priority i następnej powtórki.
6. Dashboard z rekomendowanym następnym pojęciem oraz postępem domen.
7. RLS dla każdego odczytu i zapisu danych użytkownika.

## Wymagania niefunkcjonalne

- Walidacja Zod na granicy zapisu.
- Statusy HTTP 400/401/404/409/500 i jednolity JSON błędu.
- Brak klucza service-role w aplikacji.
- Deterministyczne testy: `now` jest parametrem funkcji domenowych.
- Blokujące lint, typecheck, unit i build w CI; główny E2E jest osobnym
  blokującym jobem po skonfigurowaniu sekretów.
- Responsywny, dostępny interfejs w języku polskim.

## Poza zakresem

LLM, płatności, zespoły, role administracyjne, import PDF/CSV, powiadomienia,
gamifikacja, zaawansowane wykresy i aplikacja mobilna.
