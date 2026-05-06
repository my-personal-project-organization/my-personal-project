# Workspace System

## Overview

This document defines the development environment and conventions for the **my-personal-project** monorepo—a personal portfolio and article-sharing platform combining a CV section (cv/) with Scribo (an article platform). It provides guidance for GitHub Copilot, developers, and AI agents on architecture, patterns, tooling, and best practices within an Nx monorepo.

## Current Context

- **Angular Version**: 19.2.9
- **Nx Version**: 21.1.0
- **Node.js**: v22.13.0 (specified in `.nvmrc`)
- **TypeScript**: 5.7.3
- **Package Manager**: npm
- **Monorepo Type**: Personal portfolio + article platform (Firebase-backed)

### Core Dependencies

| Technology       | Version | Purpose                              |
| ---------------- | ------- | ------------------------------------ |
| **RxJS**         | 7.8.0   | Reactive programming                 |
| **NgRx Signals** | 19.0.1  | Modern signal-based state management |
| **NgRx Effects** | 19.0.1  | Side effects handling                |
| **AngularFire**  | 19.0.0  | Firebase integration                 |
| **Zod**          | 3.24.1  | Schema validation                    |
| **Tailwind CSS** | 3.0.2   | Utility-first styling                |
| **Jest**         | 29.7.0  | Unit/integration testing             |
| **Playwright**   | 1.36.0  | E2E testing (multi-browser)          |
| **Storybook**    | 8.6.14  | Component documentation              |

## Architecture Quick Reference

This is an **Nx v21.1.0 monorepo** with **Angular 19.2.9** standalone components using modern patterns (signals, zoneless rendering, functional DI). The architecture follows domain-driven design with clear separation between domain-specific features (cv/, scribo/) and shared utilities (shared/).

### Monorepo Structure

```
apps/
├── my-personal-project/          # Main web application
│   ├── src/
│   │   ├── app/                  # Feature modules (cv, scribo, auth)
│   │   ├── environments/         # Environment configurations
│   │   ├── locales/              # i18n translation files (en-US, es)
│   │   ├── main.ts               # Bootstrap
│   │   ├── styles.scss           # Global styles
│   │   └── test-setup.ts         # Jest setup
│   ├── tailwind.config.js
│   ├── public/
│   └── project.json
└── my-personal-project-e2e/      # Playwright E2E tests
    ├── src/
    │   └── example.spec.ts
    ├── playwright.config.ts
    └── project.json

libs/
├── cv/                            # Portfolio/CV domain
│   ├── data-access/              # State, services, guards
│   │   └── src/
│   │       ├── index.ts
│   │       ├── lib/
│   │       │   ├── services/
│   │       │   ├── guards/
│   │       │   └── models/
│   │       └── (jest, tsconfig)
│   └── feature-about/            # CV/About landing page
│       └── src/
│           ├── index.ts
│           ├── lib/
│           │   └── about.component.ts
│           └── (jest, tsconfig)
│
├── scribo/                        # Article-sharing platform domain
│   ├── data-access/              # Article state, services (NgRx Signals)
│   │   └── src/
│   │       ├── index.ts
│   │       ├── lib/
│   │       │   ├── +state/       # NgRx Signals store
│   │       │   ├── services/
│   │       │   └── models/
│   │       └── (jest, tsconfig)
│   ├── feature-landing/          # Public article discovery
│   ├── feature-article-list/     # Authenticated article list (AuthGuard)
│   ├── feature-user-profile/     # User profile management
│   └── feature-layout/           # Scribo route layout wrapper
│
└── shared/                        # Cross-domain shared libraries
    ├── data-access/              # Global state, guards, services, models
    │   └── src/
    │       ├── index.ts
    │       ├── lib/
    │       │   ├── guards/       # AuthGuard, route protections
    │       │   ├── services/     # Global services, API clients
    │       │   ├── directives/   # Global directives
    │       │   └── models/       # Shared types/interfaces
    │       └── (jest, tsconfig, ng-package.json)
    ├── ui/                        # Component library (Storybook)
    │   └── src/
    │       ├── index.ts
    │       ├── lib/
    │       │   ├── components/   # Reusable UI (ToastContainer, etc.)
    │       │   ├── styles/       # Tailwind overrides, shared CSS
    │       │   └── icons/
    │       ├── (jest, tsconfig)
    │       └── storybook config
    ├── util-error/               # Global error handling
    │   └── src/
    │       ├── index.ts
    │       └── lib/
    │           └── error-handler.ts
    ├── util-translation/         # i18n utilities
    │   └── src/
    │       ├── index.ts
    │       └── lib/
    │           └── translation-loader.ts
    └── utils/                     # General utility functions
        └── src/
            ├── index.ts
            └── lib/
```

### Domain Responsibilities

#### **cv/** — Portfolio/CV Section

- **data-access**: State management, CV-related services, portfolio data models
- **feature-about**: Standalone about/CV landing page component with resume display

#### **scribo/** — Article-Sharing Platform

- **data-access**: NgRx Signals store for articles, Firestore service integration, article models
- **feature-landing**: Public-facing article discovery and filtering page
- **feature-article-list**: Authenticated article list with CRUD operations (protected by AuthGuard)
- **feature-user-profile**: User profile dashboard and settings
- **feature-layout**: Layout wrapper and navigation for scribo feature routes

#### **shared/** — Cross-Domain Shared Libraries

- **data-access**: Global state (auth, app config), AuthGuard, route guards, Firebase services, shared models/types
- **ui**: Reusable standalone components (ToastContainer, dialogs, etc.), Storybook documentation
- **util-error**: GlobalErrorHandler service provider, error UI utilities
- **util-translation**: i18n loading utilities, locale management, translation interceptors
- **utils**: Helper functions, validators, formatters

### Key Conventions

1. **Imports**: Always use **`@mpp/*` namespace imports** (never relative imports)

   - Paths defined in `tsconfig.base.json`
   - Example: `import { AuthGuard } from '@mpp/shared/data-access';`

2. **Standalone Components**: All components use Angular 19 standalone API

   - No NgModule declarations
   - `import` dependencies directly in component
   - Use `provideRoutes()` for feature route providers

3. **Change Detection**: **OnPush strategy by default** (zoneless rendering)

   - Improves performance in Angular 19+ with signals
   - Manual change detection via `ChangeDetectorRef` when needed

4. **Dependency Injection**: Function-based injection with `inject()` function

   - Use `inject()` inside component constructors and services
   - Example: `private authService = inject(AuthService);`

5. **Forms**: Typed reactive forms with `nonNullable: true`

   - Use `FormBuilder.nonNullable` for stricter type safety
   - Full TypeScript intellisense on form controls

6. **State Management**: NgRx Signals (modern alternative to Effects)

   - Signal-based state in `scribo/data-access`
   - Effects for side-effect orchestration
   - Prefer signals over BehaviorSubject

7. **Testing**: Jest for unit/integration, Playwright for E2E

   - Jest config with `jest-preset-angular`
   - Storybook interaction tests for UI components
   - Multi-browser E2E with Playwright (Chromium, Firefox, WebKit)

8. **Firebase Integration**:

   - **Authentication**: GitHub OAuth via Firebase Auth
   - **Database**: Firestore with real-time sync
   - **Hosting**: Firebase Hosting with i18n URL rewrites
   - Use AngularFire 19.0.0 for integration

9. **Internationalization (i18n)**:

   - Angular localization built-in
   - Supported locales: `en-US` (default), `es` (Spanish)
   - Firebase rewrites route to correct locale:
     - `/` → `/en-US/` (English, default)
     - `/es/` → Spanish content
   - Load translations via `loadAppTranslations()` from `util-translation`

10. **Temporary Files**: Clean up any temporary scripts or helper files at the end of the task

## Firebase Integration

### Authentication

- **Provider**: GitHub OAuth (Firebase Auth)
- **Service**: AuthGuard in `shared/data-access`
- **Protected Routes**: Scribo feature routes require authentication
- **Token Storage**: LocalStorage (managed by AngularFire)

### Firestore Database

- **Real-time Sync**: Articles, user profiles, CV data
- **Security Rules**: `firestore.rules` (root)
- **Custom Indexes**: `firestore.indexes.json` (root)
- **Schema Validation**: Zod for runtime validation of data shapes

### Firebase Hosting

- **Build Output**: `dist/apps/my-personal-project/browser/`
- **i18n Rewrites** (in `firebase.json`):
  ```json
  {
    "source": "/:locale(en-US|es)/**",
    "destination": "/:locale/index.html"
  }
  ```
- **Deployment**: `firebase deploy` command

## Usage Instructions

1. **Read the user's request carefully**
2. **Identify the task type** (feature, refactor, test, debug, build, etc.)
3. **Use Nx MCP tools** for architecture understanding (`nx_project_details`, `nx_visualize_graph`, `nx_docs`)
4. **Follow domain-driven structure**: Feature in `cv/` or `scribo/`, shared logic in `shared/`
5. **Maintain import conventions**: Always use `@mpp/*` namespace paths
6. **Write tests alongside features**: Jest for units, Storybook for components
7. **Validate before completion**: Check compilation, run tests, verify no regressions

## Essential Commands

### Development

```bash
# Start the dev server
npm start

# Start Storybook (component library documentation on port 4400)
npm run storybook

# Build Storybook static site
npm run build-storybook

# Run pre-PR validation (lint, test, build, e2e on affected projects)
npm run run-before-pr
```

### Build & Deployment

```bash
# Development build
npx nx build my-personal-project

# Production build with i18n localization
npm run localize          # Build + serve locally on http://localhost:3000

# Full production build + Firebase deploy
npm run deploy

# Analyze bundle size
npm run analyze-bundle
```

### Nx Task Running

```bash
# Run specific task on a project
npx nx run my-personal-project:build
npx nx run cv/data-access:test
npx nx run scribo/feature-article-list:lint

# Run affected projects (CI/CD)
npx nx affected -t lint test build e2e
npx nx affected -t test --base=main

# View project/task graph
npx nx graph
npx nx graph --watch
```

### Cache & Troubleshooting

```bash
# Clear Nx cache
npx nx reset

# Fresh install
rm -rf node_modules package-lock.json && npm install

# Check port availability (dev server)
lsof -ti:4200
```

### Testing

```bash
# Run all Jest tests
npx nx affected -t test

# Run specific project tests
npx nx run cv/feature-about:test
npx nx run scribo/data-access:test --watch

# Run E2E tests
npx nx run my-personal-project-e2e:e2e
```

## Critical Integrations

### Development Environment Requirements

- **Node.js v22.13.0** (use `.nvmrc` with nvm: `nvm use`)
- **Nx Console VS Code extension** — Visual project navigation and task execution
- **Angular DevTools** — Component inspector, performance monitoring
- **Storybook** — Component preview and interaction testing

### Before Making Changes

1. **Use Nx tools** to understand dependencies:

   ```bash
   npx nx graph --focus=[project-name]
   ```

   - Review project dependencies to avoid circular imports
   - Check feature boundaries before cross-domain changes

2. **Review existing patterns** in similar components/services:
   - Check `cv/feature-about` for component pattern
   - Check `scribo/data-access` for NgRx Signals usage
   - Check `shared/ui` for component library conventions

## Validating Changes

### Compilation Errors

- Monitor TypeScript compilation in the editor
- Fix all errors before running tests or scripts
- Use `npx nx reset` if cache is stale

### Testing & Quality Checks

```bash
# Validate entire monorepo
npm run run-before-pr

# Run only affected tests
npx nx affected -t test --base=origin/main

# Run specific library tests with coverage
npx nx run shared/data-access:test --codeCoverage
```

### Firebase-Specific Validation

- Validate Firestore security rules: Use Firebase emulator
- Verify i18n builds: `npm run localize` and check `/es` and `/en-US` routes
- Test authentication flow: Verify GitHub OAuth works locally

### Code Quality

- ESLint: `npx nx affected -t lint`
- Type checking: `npx nx affected -t typecheck` (if configured)
- Performance: Bundle analysis `npm run analyze-bundle`

## Troubleshooting Guide

| Issue                       | Solution                                                       |
| --------------------------- | -------------------------------------------------------------- |
| **Port 4200 in use**        | `lsof -ti:4200 \| xargs kill -9`                               |
| **Stale cache**             | `npx nx reset && npm install`                                  |
| **Compilation errors**      | Check `tsconfig.base.json` paths, verify imports use `@mpp/*`  |
| **Firebase auth fails**     | Verify `.env` variables for Firebase config                    |
| **i18n routes not working** | Check `firebase.json` rewrites, test with `npm run localize`   |
| **Tests fail with modules** | Run `npm install` and `npx nx reset`                           |
| **Performance degradation** | Run `npm run analyze-bundle`, check component change detection |

---

**Last Updated**: May 2026
