# Shape notes — AI Concept Compass

## Problem

Osoby przygotowujące się do AWS Certified AI Practitioner często mylą
rozpoznawanie terminów z umiejętnością ich wyjaśnienia. Sama lista fiszek nie
pokazuje, gdzie pewność jest większa niż faktyczna wiedza.

## Zakład

Krótka powtórka, w której użytkownik przed oceną deklaruje pewność, pozwoli
wykrywać braki i nadmierną pewność. Deterministyczny priorytet wskaże następny
temat bez uzależniania podstawowej wartości produktu od LLM.

## Główny przepływ

Rejestracja → pakiet startowy → wybór pojęcia → pewność 1–5 → samodzielna
odpowiedź → ocena `incorrect|partial|correct` → aktualizacja mastery i
kalibracji → rekomendacja kolejnego pojęcia.

## Appetite i granice

MVP ma zmieścić się w pięciu dniach implementacji. Obejmuje auth, 10 pojęć,
CRUD, review, rekomendację, RLS i testy. Nie obejmuje LLM, importów, płatności,
zespołów, powiadomień, gamifikacji ani zaawansowanych wykresów.

## Ryzyka i rozwiązania

- Hosted Supabase wymaga konfiguracji konta: migracja i instrukcja wdrożenia są
  częścią repo, a kod buduje się bez sekretów.
- Samoocena może być niedokładna: interfejs pokazuje wzorzec odpowiedzi przed
  wyborem wyniku i nazywa ocenę wprost samooceną.
- Brak historii: priorytet wynosi 100, więc nowe pojęcia zawsze trafiają do
  rekomendacji.
