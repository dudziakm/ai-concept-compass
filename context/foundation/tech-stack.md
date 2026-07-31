# Tech stack

| Warstwa   | Wybór                                   | Uzasadnienie                                   |
| --------- | --------------------------------------- | ---------------------------------------------- |
| Web       | Astro 6 SSR + React 19 islands          | server-first, mały JS i gotowy auth starter    |
| Style     | Tailwind CSS 4                          | spójny, responsywny interfejs                  |
| Dane/auth | Hosted Supabase PostgreSQL + Auth + RLS | izolacja danych w bazie i bez własnego auth    |
| Walidacja | Zod 4                                   | wspólne kontrakty API i formularzy             |
| Hosting   | Cloudflare Workers                      | zgodny z oficjalnym adapterem startera         |
| Testy     | Vitest 4 + Playwright                   | czysta domena, kontrakty i główny przepływ E2E |
| CI        | GitHub Actions, Node 22.14              | powtarzalne quality gates                      |

Starter: <https://github.com/przeprogramowani/10x-astro-starter>. W czasie
sprintu nie przechodzimy na kolejną główną wersję Astro.
