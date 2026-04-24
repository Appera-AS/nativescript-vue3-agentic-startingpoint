# Claude guide

This project uses a single canonical agent guide — read **[AGENTS.md](./AGENTS.md)** for project-specific conventions (the `$` util pattern, Pinia store shape, theme colors, routing, i18n, sheets, component layout, logging & debugging workflow) and **[NATIVESCRIPT.md](./NATIVESCRIPT.md)** for NativeScript framework context (layouts, lifecycle, native APIs, custom views, Trace, platform conditionals).

Everything you need to extend this boilerplate while matching the existing structure and coding style is in those two files. Treat `AGENTS.md` as authoritative for this repo; consult `NATIVESCRIPT.md` whenever touching native APIs, custom views, or list performance.

## Running & debugging (quick reference)

- Run the app with `npm run ios-log` / `npm run android-log` — output is `tee`'d to `logs/debug-ios.log` / `logs/debug-android.log`.
- Use `$.debug.log("✅ …")` / `$.debug.out(...)` / `$.debug.dir(...)` instead of `console.log`. Categories + flags live in `src/utils/debug.ts` and `src/pinia/debug.ts`.
- When debugging: run the logged script, reproduce, grep `logs/`. If the suspect code path has no log calls, add `$.debug.log` probes. See `AGENTS.md` → "Logging & debugging" for the full workflow.
