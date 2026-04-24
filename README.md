# NativeScript Vue 3 Boilerplate

A comprehensive boilerplate for NativeScript with Vue 3, designed to kickstart your mobile app development. This template includes a variety of pre-built components, utility functions, and essential features commonly used in mobile applications. It provides a solid foundation for creating robust and scalable mobile apps with NativeScript and Vue 3.

## Utils

In every component, you can access the utils and pinia stores by importing them from `@/utils`.

For example:

```
import $ from "@/utils";

$.page.goTo("ChatPage");
```

See `src/utils/index.ts` for the full list of utils and pinia stores.

## Features

- [x] Vue 3
- [x] Pinia for state management
- [x] Routing
- [x] HTTP service
- [x] Sheets component
- [x] Pages structure
- [x] SVG support
- [x] Pull-to-refresh functionality
- [x] Loading spinner
- [x] Custom button component
- [x] Text size adjustment
- [x] Language handling (i18n)
- [x] Icon system
- [x] Haptic feedback
- [x] Organized folder and file structure
- [x] Dark mode (theme/color)

## Getting Started

1. Fork this repository

2. Clone your forked repository:

   ```
   git clone https://github.com/your-username/nativescript-vue3-agentic-startingpoint.git my-app-name
   ```

3. Navigate to your project directory:

   ```
   cd my-app-name
   ```

4. Install dependencies:

   ```
   npm install
   ```

5. Rename the project:

   - Search for "replaceme" in the project files and replace it with your app name.
   - In `nativescript.config.ts`, update the `id` field with your app's bundle ID.

6. Run the project (prefer the logged scripts — they mirror the terminal stream to `logs/`):
   - iOS with logs: `npm run ios-log` (writes to `logs/debug-ios.log`)
   - Android with logs: `npm run android-log` (writes to `logs/debug-android.log`)
   
## Logging & debugging

Use `$.debug.log("✅ …")` / `$.debug.out(obj, "label")` / `$.debug.dir(obj)` instead of `console.log`. Prefix messages with an emoji to put them in a category (see `src/utils/debug.ts` — `✅`/`⛔️`/`⚠️` = bootstrap, `🍍` = pinia, `🌐` = network). Toggle categories at runtime via `$.useDebug().setEnableBootstrapLogs(true)`, `setEnablePiniaLogs(true)`, `setEnableNetworkLogs(true)`. The master switch `$.useDebug().setEnableDebug(false)` silences everything.

When debugging: run `npm run ios-log` / `npm run android-log`, reproduce the issue, then grep `logs/debug-*.log`. If the relevant code path has no log calls yet, add `$.debug.log("…")` at the right points and re-run.

## Generating App Icons

To create custom icons for your app, use [Icon Kitchen](http://icon.kitchen). This free tool allows you to easily generate app icons for iOS and Android platforms.
