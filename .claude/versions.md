# Version History

## Current Versions (as of 2026-07-16)

### Core Frameworks
- **Nx**: 22.7.6 (migrated from 21.6.11)
- **Angular**: 21.2.9 (upgraded from 20.3.9)
- **TypeScript**: 5.9.3
- **Jest**: 30.4.2 (upgraded from 29.7.0)
- **Playwright**: 1.36.0

### Angular-related
- **@angular/cli**: 21.2.9
- **@angular/devkit**: 21.2.9
- **@schematics/angular**: 21.2.9
- **ng-packagr**: 21.2.5
- **jest-preset-angular**: 16.0.0
- **angular-eslint**: 21.4.0

### Build & Linting
- **ESLint**: 9.28.0 (flat config format)
- **Storybook**: 10.5.0 (upgraded from 9.1.9; `@storybook/angular-vite` executor, Vite-based build)
- **TypeScript-ESLint**: 8.33.1

### State Management
- **@ngrx/effects**: 21.0.1 (compatible with Angular 21)
- **@ngrx/signals**: 21.0.1
- **RxJS**: 7.8.0

## Migration Log

### 2026-07-01: Nx 21.1.0 → 21.6.11 (includes Angular 19 → 20)

**What Changed:**
- Ran `npx nx migrate nx@21.6.11`
- Executed `npx nx migrate --run-migrations` which applied:
  - Angular core migrations (inject-flags, test-bed-get, control-flow-migration, document-core)
  - Angular control flow syntax updates (`*ngIf` → `@if`, `*ngFor` → `@for`, etc.)
  - DOCUMENT import migration (@angular/common → @angular/core)
  - Storybook v9 migration
  - TypeScript moduleResolution update to 'bundler'
  - ESLint flat config updates

**Manual Fixes Applied:**
- Fixed `eslint.config.js`: converted from require to import (ES module syntax)
- Updated library `eslint.config.cjs` files to include nx base configs
- Fixed app config: `provideExperimentalZonelessChangeDetection()` → `provideZonelessChangeDetection()`
- Removed `@storybook/test` from production exports in shared/ui

**Breaking Changes in Angular 20:**
- `provideExperimentalZonelessChangeDetection` renamed to `provideZonelessChangeDetection`
- Control flow syntax is now standard (old syntax still works with deprecation warnings)
- DOCUMENT moved from @angular/common to @angular/core

**Build Status:**
- ✅ Production build succeeds
- ✅ Lint: Passes with some warnings (pre-existing)
- ⚠️ Some ESLint dependency-check errors in libraries (pre-migration issues)

### 2026-07-16: Nx 21.6.11 → 22.7.6 (includes Angular 20 → 21, Jest 29 → 30, Storybook 9 → 10)

**Why the paired bump was required:** the issue's peer-range check suggested Angular 20 could stay as-is, but running the migration proved otherwise — Angular 21's own bundled migration schematics don't exist in the v20 package, and `jest-preset-angular@14.x`/`@storybook/angular@9.x` both hard-cap their peer range below Angular 21. So `nx migrate` carried Angular, Jest, and Storybook along with it.

**What Changed:**
- `nx`/`@nx/*` → 22.7.6, `@angular/*` → 21.2.9, `jest` → 30, `storybook` → 10 (new `@nx/vite` plugin added)
- Storybook migrated to `@storybook/angular-vite` (Vite-based build/start executors, replacing `@storybook/angular`); added `@storybook/addon-vitest`, `@storybook/addon-a11y`, `@storybook/addon-mcp`; `test-storybook` now runs via `vitest run --config <lib>/vitest.config.ts --project=storybook` instead of the old `test-storybook` CLI
- Jest config converted to CJS; tsconfig `module`/`moduleResolution`/`isolatedModules` updated per-project; `tsconfig.base.json` paths made relative and gained `esModuleInterop`
- New `@mpp/shared/ui/testing` entry point (`libs/shared/ui/src/lib/mocks/index.ts`) — Storybook-only test helpers were removed from `@mpp/shared/ui`'s production barrel (they imported ESM-only `storybook/test`, which broke Jest for consumers)

**Manual Fixes Applied:**
- Lib `package.json` peer version pins bumped to Angular 21.2.9 (shared/ui, utils, util-translation, data-access) — `@nx/dependency-checks` lint failed otherwise
- `scroll-end.directive.ts`: dropped unused `'$event'` arg — Angular 21's `@HostListener` typing now checks args against the handler's parameter count
- Scribo libs' `.storybook/main.ts`: fixed workspace-root-relative `styles` paths, wired up `@nx/vite`'s `nxViteTsPaths()` plugin for `@mpp/*` aliases, removed a stray `zone.js` import in `feature-layout` (project is `zoneless: true`)

**Build Status:** `npm run run-before-pr`, `build-storybook`, both Scribo Storybook builds, and the production build all pass. PR: [#79](https://github.com/my-personal-project-organization/my-personal-project/pull/79), closes issue [#74](https://github.com/my-personal-project-organization/my-personal-project/issues/74).

## Known Issues

1. **Bundle Size Warning**: Initial bundle exceeds budget by ~105KB (may need performance optimization)
2. **ESLint Dependency Checks**: Some libraries have mismatched Angular versions in package.json (pre-migration)
3. **Test Warnings**: Some `any` types in test-setup.ts files (non-blocking)

## Next Steps

- Monitor application performance in staging/production
- Update component selectors if needed (Angular 21 strict mode)
- Consider addressing bundle size optimization
- Review and fix remaining ESLint dependency-check errors if needed
