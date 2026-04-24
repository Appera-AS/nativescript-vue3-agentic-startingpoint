# Agent Guide

This repo is a NativeScript 9 + Vue 3 + Pinia boilerplate. Use this file as the entry point when extending the project.

## Read this first

- **[NATIVESCRIPT.md](./NATIVESCRIPT.md)** — framework-level context (layouts, lifecycle, native APIs, ListView/CollectionView rules, iOS delegates, Workers, Trace, custom views, platform conditionals). Consult it before writing anything that touches native APIs or custom views.
- **[README.md](./README.md)** — short user-facing description of the boilerplate.

## Golden rule

Everything app-level goes through the `$` util object:

```ts
import $ from "@/utils";

$.page.goTo("ChatPage");
$.i("general_close");
$.useTheme().color.black_white;
$.useSettings().fontSize(16);
$.http({ endpoint: "/me" });
$.haptic("button");
$.sheet.goTo("MySheet");
$.debug.log("✅ something happened");
$.debounce(fn, 300);
$.throttle(fn, 100);
```

If you need a new cross-cutting helper, add it to `src/utils/` and expose it from `src/utils/index.ts`. Do not import Pinia stores or deep util paths directly from components — always go through `$`.

## Running the app

Always run via the logged npm scripts — they `tee` stdout+stderr to `logs/` so you have a grep-able artifact after the fact:

- `npm run ios-log` → `logs/debug-ios.log`
- `npm run android-log` → `logs/debug-android.log`

Each run overwrites its platform log file, so the file always contains the latest session.

## Logging & debugging

No bare `console.log` in application code — go through `$.debug`. `console.error` is fine for real error paths (missing routes, unreachable states).

**API** (`src/utils/debug.ts`):

| Call | Purpose |
|------|---------|
| `$.debug.log("✅ msg")` | Emoji-categorized log — suppressed when the matching flag is off |
| `$.debug.out(value, "label")` | Pretty-print an array/object with a `💭` prefix |
| `$.debug.dir(value)` | `console.dir` passthrough |

Everything is a no-op unless `$.useDebug().enableDebug` is true (default: `__DEV__`).

**Categories** — prefix your message to route it:

| Prefix | Flag | Use for |
|--------|------|---------|
| `✅` `⛔️` `⚠️` | `enableBootstrapLogs` | Lifecycle events (resume, launch, navigation, init) |
| `🍍` | `enablePiniaLogs` | Store mutations / state transitions |
| `🌐` | `enableNetworkLogs` | HTTP request/response (already wired in `src/utils/http.ts`) |
| `💭` | always on when `enableDebug` | `$.debug.out` / `$.debug.dir` output |

Toggle at runtime: `$.useDebug().setEnableNetworkLogs(true)` etc. Flags are `persistentRef`-backed so they survive app restarts.

**Debug workflow**:

1. Reproduce with `npm run ios-log` (or `android-log`) running.
2. Grep `logs/debug-*.log` for the relevant category prefix or error string.
3. If the suspect code path has no log calls, add `$.debug.log("<emoji> <context>: <message>")` at the entry and exit points of the function, re-run, repeat.
4. Once fixed, remove throw-away probes. Keep the ones that document a useful lifecycle event.

**Adding a new category** → add a persistent flag + computed + setter to `src/pinia/debug.ts`, add the emoji/flag check to `src/utils/debug.ts`, and document the emoji here.

## Project layout

```
src/
├── app.ts                      # Entry. Registers plugins, global components, starts Vue
├── app.css                     # Tailwind + icon fonts
├── boot/                       # One-time setup run from app.ts (application events, IQKeyboard, TouchManager)
├── components/
│   ├── atoms/                  # Reusable building blocks, X-prefixed (XButton, XIcon, XLabel, XScrollView, XSpinner, XChatMessage)
│   ├── organisms/              # Layout shells (XPage, XSheet)
│   └── pages/                  # Full screens (ChatPage, SettingsPage). Every page is wrapped in <XPage>
├── pinia/                      # Stores: settings, theme, internationalization, sheet
├── router/routes.ts            # Name → component map consumed by $.page.goTo
├── translations/{en,no}.ts     # Flat key → string. Keys use snake_case category prefixes: general_*, chat_*, …
├── utils/                      # page, sheet, http, haptic, debounce-throttle, persistence, index (the $ barrel)
├── assets/lottie/              # Lottie JSON (spinner, success, error)
└── fonts/                      # Material Icons ttf/otf
```

Path aliases: `@/*` and `~/*` both resolve to `src/*`. Prefer `@/…`.

## Conventions

### Components
- **Atoms are X-prefixed** (`XButton`, `XIcon`, `XLabel`, …). Reach for them before raw NativeScript elements — they already honor theme colors, `$.useSettings().fontSize(...)` scaling, and i18n.
- **`XLabel` and `XButton` accept an `i` prop** — pass a translation key (`<XLabel i="general_close" />`) instead of resolving with `$.i(...)` in the template.
- **Every page is wrapped in `<XPage>`**. Put content inside; `XPage` provides the Drawer shell and theme-aware backgrounds.
- **Global components** (registered in `src/app.ts`): `XPage`, `XIcon`, `XLabel`, `XButton`, `XScrollView`. Others are imported per-file.
- **SFC shape**: `<template>` first, then `<script lang="ts" setup>`. Double quotes, semicolons, 2-space indent. Props with `defineProps({ name: { type: String, default: "" } })`.
- **Tap-scale animation** — `XButton` handles its own 95% down/up scale via `@touch`. For other tappable elements (icons, layouts with `@tap`), add an ad-hoc animation only if the interaction needs feedback.

### State (Pinia)
All stores follow this composition-API shape (see `src/pinia/settings.ts`):

```ts
export const useX = defineStore("x", () => {
  const _value = persistentRef("x.value", initial); // or ref(...) for non-persistent
  const value = computed(() => _value.value);       // expose as computed getter
  function setValue(v: T) { _value.value = v; }     // mutate through a setter
  return { value, setValue };
});
```

- Prefix internal refs with `_` and never export them. Expose `computed` getters + `setX` functions.
- Use `persistentRef("namespace.key", fallback)` from `@/utils/persistence` for anything that should survive app restarts (backed by `ApplicationSettings`).
- Re-export new stores through `$` in `src/utils/index.ts` (`useMyStore: () => useMyStore()`).

### Theme & colors
- Read colors from `$.useTheme().color.<name>`. Names are `lightValue_darkValue` (e.g. `white_black`, `almostWhite_almostBlack`, `black_white`) and flip automatically in dark mode.
- Toggle dark mode with `$.useTheme().setDarkMode(bool)`. `refreshDarkMode()` is already wired to the resume event.
- `borderRadius` lives on the theme store too (`$.useTheme().borderRadius`).
- Add new colors to the `c` map and expose mode-aware combinations in `src/pinia/theme.ts`.

### i18n
- All user-visible strings go through `$.i("key")` or the `i` prop on `XLabel`/`XButton`.
- Add new keys to **both** `src/translations/en.ts` and `src/translations/no.ts`. Missing keys fall back to the raw key, which is visible in the UI — always keep the two files in sync.

### Navigation
- Add a page component under `src/components/pages/`, then register it in `src/router/routes.ts`:
  ```ts
  const routes: Routes = {
    MyPage: { component: MyPage, requiresAuth: false },
  };
  ```
- Navigate with `$.page.goTo("MyPage", { transition: { name: "fade" }, clearHistory: true })`. Never call `$navigateTo` directly — the helper is debounced and auth-aware.
- `$.page.goBackTo("MyPage")` auto-applies a `slideRight` transition.

### Sheets / modals
- Child components of `XSheet` become sheet routes. Open with `$.sheet.goTo("Name", { ...props })`, navigate back with `$.sheet.back()`, dismiss with `$.sheet.close()`.
- Set heading/buttons through `$.useSheet().setHeading(...)`, `setShowBackButton(true)`, `setShowCloseButton(true)` from within the sheet.

### HTTP
- Use `$.http({ method, endpoint, request })`. Base URL comes from `process.env.HTTP_BASE_URL`, language header from `$.useSettings().language`, version/device id from `package.json`/`Device`.
- Requests and responses are already logged through `$.debug.log("🌐 …")` — toggle with `$.useDebug().setEnableNetworkLogs(true)` at runtime.

### Haptics
- `$.haptic("button" | "pillswitch" | "crash")`. Respects `$.useSettings().hapticsEnabled`. Add new haptic variants inside `src/utils/haptic.ts`.

### Lists
- Prefer `<CollectionView>` (from `@nativescript-community/ui-collectionview/vue3`, already `app.use(CollectionView)`) over `ListView` for performance.
- Back list data with `new ObservableArray<T>([])` — see `ChatPage.vue`.
- On Android, call `chatView.value.nativeView.setItemAnimator(null)` in `@loaded` to kill the default row animation (see `ChatPage.vue:137`).
- Follow the ListView/template-selector/`hidden`-vs-`v-if` guidance in `NATIVESCRIPT.md` §Best Practices.

### Styling
- Tailwind is enabled (`@nativescript/tailwind`). Dark mode is class-based via `.ns-dark` — `darkMode: ['class', '.ns-dark']` in `tailwind.config.js`. `preflight` is disabled so there are no browser resets.
- For theme-aware colors prefer the Pinia `color` map over Tailwind color classes, since the map reacts to runtime dark-mode toggles.

### TypeScript
- `strict: true`. Shared interfaces live in `types/` (e.g. `ChatMessage` is imported from `@/../types/interfaces`).
- `experimentalDecorators` / `emitDecoratorMetadata` are on — `@NativeClass()` works out of the box.

## Don'ts

- Don't import Pinia stores directly into components — go through `$.useX()`.
- Don't hard-code colors or font sizes — use the theme map and `$.useSettings().fontSize(...)`.
- Don't call `$navigateTo` / `$showModal` directly — use `$.page` and `$.sheet`.
- Don't add a translation to only one of `en.ts` / `no.ts`.
- Don't rename the `X` prefix or move atoms/organisms/pages out of their folders.
- Don't use `console.log` in application code — route through `$.debug.log`. Leave `console.error` for real error paths.

## When adding a feature

1. **New page** → create `src/components/pages/FooPage.vue` (wrap in `<XPage>`), register in `src/router/routes.ts`, navigate via `$.page.goTo("FooPage")`.
2. **New reusable UI bit** → `src/components/atoms/XFoo.vue`, X-prefixed, theme + font-scale aware. Register globally in `src/app.ts` only if used across many pages.
3. **New store** → `src/pinia/foo.ts` following the `_ref` + computed + setter pattern; expose through `$` in `src/utils/index.ts`.
4. **New util** → `src/utils/foo.ts`, re-export from `src/utils/index.ts`.
5. **New user-visible text** → add the key to `src/translations/en.ts` and `no.ts`, use via `i` prop or `$.i(...)`.
6. **New color** → extend the `c` map in `src/pinia/theme.ts` and expose a `light_dark` combination.
7. **New logging category** → add a persistent flag to `src/pinia/debug.ts`, an emoji check in `src/utils/debug.ts`, and document the emoji in the Logging & debugging section above.
8. **Native-adjacent work** (custom views, iOS delegates, Workers, Trace, property system) → follow the patterns in `NATIVESCRIPT.md`. Retain iOS delegate refs, clean up timers/observers, prefer `hidden`/`visibility` over `v-if` inside scrollers.

## Commands

```bash
npm install
npm run ios-log              # iOS with log file capture (preferred)
npm run android-log          # Android with log file capture (preferred)
ns debug ios --no-hmr        # when HMR is misbehaving
ns clean                     # after touching App_Resources
```

Rename placeholder: search-replace `replaceme` and update `id` in `nativescript.config.ts`.
