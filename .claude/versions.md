# Version History

## Current Versions (as of 2026-07-01)

### Core Frameworks
- **Nx**: 21.6.11 (migrated from 21.1.0)
- **Angular**: 20.3.9 (upgraded from 19.2.9)
- **TypeScript**: 5.9.3 (upgraded from 5.7.3)
- **Jest**: 29.7.0
- **Playwright**: 1.36.0

### Angular-related
- **@angular/cli**: ~20.3.0
- **@angular/devkit**: 20.3.9
- **@schematics/angular**: 20.3.9
- **ng-packagr**: 20.3.2
- **jest-preset-angular**: 14.6.2
- **angular-eslint**: 20.7.0

### Build & Linting
- **ESLint**: 9.8.0 (flat config format)
- **Storybook**: 9.1.9 (upgraded from 8.6.14)
- **TypeScript-ESLint**: 8.62.1

### State Management
- **@ngrx/effects**: 19.0.1 (compatible with Angular 20)
- **@ngrx/signals**: 19.0.1
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

## Known Issues

1. **Bundle Size Warning**: Initial bundle exceeds budget by ~105KB (may need performance optimization)
2. **ESLint Dependency Checks**: Some libraries have mismatched Angular versions in package.json (pre-migration)
3. **Test Warnings**: Some `any` types in test-setup.ts files (non-blocking)

## Next Steps

- Monitor application performance in staging/production
- Update component selectors if needed (Angular 20 strict mode)
- Consider addressing bundle size optimization
- Review and fix remaining ESLint dependency-check errors if needed
