# Test plan

## Najwyższe ryzyka

| Ryzyko                                     | Poziom    | Pokrycie                                                   |
| ------------------------------------------ | --------- | ---------------------------------------------------------- |
| błędny scoring/rekomendacja                | wysokie   | unit: wszystkie gałęzie i granice                          |
| odczyt lub modyfikacja danych innego konta | krytyczne | polityki RLS + test integracyjny dwóch użytkowników        |
| duplikacja pakietu startowego              | średnie   | constraint `(user_id, template_id)` + integration          |
| niepoprawny input review                   | średnie   | testy schematu + endpoint 400                              |
| przerwany główny przepływ                  | wysokie   | Playwright: auth → pack → review → recommendation → delete |

## Bramka automatyczna

`npm run lint`, `npm run typecheck`, `npm run test:coverage`, `npm run build`
oraz `npm run test:e2e` przy dostępnych sekretach Supabase. Testy integracyjne
oznaczone jako wymagające hosted Supabase nie używają service-role w kodzie
aplikacji.

## Audyt manualny

- publiczny URL na mobile i desktop;
- rejestracja i potwierdzenie e-mail;
- loading, empty, success i error states;
- brak błędów konsoli;
- dwa konta nie widzą swoich pojęć nawzajem.
