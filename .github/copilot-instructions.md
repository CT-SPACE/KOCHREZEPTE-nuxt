# Copilot Instructions for kochrezepte-nuxt

## Architecture overview

This is a Nuxt 4 app with two independent recipe data sources that must not be confused:

- **External API recipes** (`app/utils/api.service.ts`) — fetched client-side from [TheMealDB](https://www.themealdb.com/api/json/v1/1). Powers the public-facing pages: [index.vue](../app/pages/index.vue) (recipe grid), [[id].vue](../app/pages/[id].vue) (recipe detail), and the search overlay. Types for these are loose (`any` / ad-hoc `MealResponse`), matching TheMealDB's `strX` field naming.
- **Own D1 database recipes** (`app/utils/achdb.service.ts`) — fetched from this app's own `server/api/*.get.ts` endpoints, which query a Cloudflare D1 database via the `ACHDB` binding. Powers [AchDB.vue](../app/pages/achdb.vue), an admin-style editable data table. Types live in [dbRecipe.type.ts](../app/types/dbRecipe.type.ts) (`DbRecipe`, `DbSourceType`) and mirror the D1 schema exactly (snake_case columns).

Do not mix these two: components/composables under the "API" naming (`api.service.ts`, `useRecipeSearch`, `useRecipeDetails`, `RecipeItem.vue`) work with TheMealDB shape; anything under "DB"/"achdb" naming works with the D1 schema.

### D1 database (Cloudflare)

- Schema lives in [migrations/](../migrations): All files in migrations/-folder. Last file is at the moment `0003_ingredients_name_nocase.sql`.
- **Migrations are append-only and tracked by filename in D1's internal `d1_migrations` table.** Editing an already-applied migration file (e.g. adding a column to `0001_init.sql`) has no effect on any database where it already ran — `CREATE TABLE IF NOT EXISTS` is a no-op if the table exists. Always add a new numbered migration file (`000N_description.sql`) for schema changes instead of editing prior ones.
- Apply migrations: `npx wrangler d1 migrations apply ACHDB --local` (local) or add `--remote` for the live database.
- Inspect schema: `npx wrangler d1 execute ACHDB --local --command "PRAGMA table_info(recipes);"`.
- [wrangler.toml](../wrangler.toml) has `remote = false` set on the `ACHDB` binding, so `npm run dev` proxies D1 calls to a local emulated copy.
- Table relations: `recipes` 1—N `sources` (via `sources.recipe_id`), `sources` N—1 `source_types` (via `sources.source_type_id` → `source_types.stid`). `server/api/recipes.get.ts` joins all three; `category` lives directly on `recipes`, not on `sources`.
- `recipe_ingredients` links `recipes` to `ingredients` (`ingredient_id`) and `units` (`unit_id`). Names are only stored in `ingredients`, not in `recipe_ingredients`.
- `recipes.get.ts` does not return any ingredients. They are loaded when a recipe is opened via `GET /api/recipes/[id]/recipe-ingredients`.

### Server API routes

- `server/api/*.get.ts` files use Nitro's `defineEventHandler`, access D1 via `event.context.cloudflare.env.ACHDB` (injected by the `nitro-cloudflare-dev` module configured in [nuxt.config.ts](../nuxt.config.ts)), and return raw `results` arrays from `db.prepare(...).all()`.
- POST/PATCH routes: ingredients.post.ts, recipes.post.ts, recipes/[id].patch.ts (deletes and recreates `sources` and `recipe_ingredients` when saving).
  Naming convention: The file extension determines the HTTP method (.get.ts, .patch.ts). Subpaths require folders (recipes/[id]/recipe-ingredients.get.ts); [id]-name.get.ts does not work.
- Every new client-side call to a `/api/xxx` route requires a matching `server/api/xxx.get.ts` file to exist — otherwise Nitro falls through to the client-side Vue Router, which logs a `VUE_ROUTER_R0004` "no match found" warning instead of a clear 404.

### Documenting Edit Components

- Edit flow: `achdb.vue` → `Edit/editOverlay.vue` → `Edit/editAll.vue` → `Edit/RecipeData/*`. The `close` and `saved` events are passed through; `achdb.vue` displays the snackbar and reloads the list.
- Form rules are located in `composables/useFormRules.ts`, and drafts are stored in localStorage (`useFormRecipe.ts`).

## Conventions

- `app/` is the Nuxt `srcDir` (Nuxt 4 default layout): `pages/`, `components/`, `composables/`, `utils/`, `types/` all live under `app/`, not the repo root.
- Composables (`useLoading`, `useRecipeSearch`, `useRecipeDetails`) and Vue globals (`ref`, `onMounted`, `useRouter`, etc.) are auto-imported by Nuxt — most `.vue` files and `.js` composables don't explicitly `import` them. `.ts` files under `app/utils` do use explicit imports for types.
- Data-fetching helpers are grouped into `*.service.ts` files under `app/utils/` (`api.service.ts` for TheMealDB, `achdb.service.ts` for the D1-backed endpoints, `data.service.ts` for the static local JSON fallback in `app/data/ach_db.JSON`) — follow this naming/grouping for new data sources rather than fetching directly in components.
- UI uses Vuetify 3 (`v-card`, `v-data-table`, `v-text-field`, etc.) configured via `vite-plugin-vuetify` in [nuxt.config.ts](../nuxt.config.ts); icons come from `@mdi/font` / UnoCSS's `presetIcons` (see [uno.config.ts](../uno.config.ts)).

## Build & run

- `npm run dev` — start dev server (proxies D1 to remote via `wrangler`, see above).
- `npm run build` — production build via `nuxt build` (outputs to `.output/`, deployed as a Cloudflare Worker per [wrangler.toml](../wrangler.toml)).
- `npm run generate` / `npm run preview` — standard Nuxt static generate / preview.
- No test suite, linter, or type-check script is currently configured in [package.json](../package.json).

## Rules

- Never edit, create, or delete files automatically. Always explain the proposed changes first and wait for explicit user confirmation before applying them.
- Solutions must always match the current project architecture and framework version used in this repository. Never propose APIs, commands, or patterns that are deprecated or belong to older major versions of the frameworks used in this repository.
- Always answer clearly, objectively, and simply. No long introductions, no self-praise, and no feel-good phrases.
- “Always read configuration files (e.g., wrangler.toml) before making any assumptions; do not rely on this description.”

### Security Rules

- Credentials, secrets, tokens, environment variables, and authentication data are strictly off-limits. Copilot must never read, extract, analyze, transform, store, or reference them in any way.
- Copilot must never request credentials or suggest exposing them. If a task requires credentials, always instruct the user to provide secure placeholders instead of real values.
- Copilot must never output any value that resembles a credential, even if it appears in the repository.
- Copilot must warn the user if code contains hardcoded credentials.
