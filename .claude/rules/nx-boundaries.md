---
name: nx-boundaries
description: Nx monorepo structure, module tagging scheme, and dependency boundary rules for this project
---

# Nx Module Boundaries

## Monorepo Structure (Nx 21.1.0)

### Apps
- `apps/my-personal-project` — Main Angular 19 application
- `apps/my-personal-project-e2e` — Playwright e2e test suite for the main app

### Libraries
Organized by domain with internal folder structure:

**`libs/cv/`** — CV/Resume section
- `feature-about` — CV landing/about page (routable feature)
- `data-access` — CV store, services, HTTP calls

**`libs/scribo/`** — Article/Blog platform
- `feature-landing` — Blog landing page
- `feature-article-list` — Article discovery/list view
- `feature-article-detail` — Article detail/read view (loaded via route)
- `feature-user-profile` — User profile page
- `feature-layout` — Shared layout wrapper (navbar, footer, locale switcher)
- `data-access` — Blog store, article service, user service, HTTP

**`libs/shared/`** — Cross-domain code
- `ui` — Shared UI components (atoms: button, icon; molecules: nav-bar, language-switcher)
- `data-access` — Global auth store, guards, user service, Firestore integration
- `util-error` — Error handling services and utilities
- `util-translation` — i18n utilities and locale management
- `utils` — General-purpose helpers (formatting, validation, etc.)

## Tagging Convention

### Intent (Currently Not Fully Enforced)
Each library should be tagged in its `project.json` to enforce dependency rules. Tags follow this pattern:

```json
{
  "name": "cv/feature-about",
  "tags": ["type:feature", "domain:cv", "lib:routable"]
}
```

**Type Tags**:
- `type:feature` — Routable feature modules (smart components, orchestration)
- `type:data-access` — State, services, HTTP, store
- `type:ui` — Presentational components only (dumb, pure input/output)
- `type:util` — Utility functions and helpers

**Domain Tags**:
- `domain:cv` — Belongs to CV feature set
- `domain:scribo` — Belongs to Scribo/blog feature set
- `domain:shared` — Cross-cutting shared code

**Scope Tags** (optional, for future use):
- `lib:routable` — Can be lazy-loaded by router
- `lib:internal` — Should not be imported outside its domain

### Current State (Implemented)
All libraries and apps are tagged with `type:*` and `domain:*` labels as per the scheme above. The linter rule `@nx/enforce-module-boundaries` is configured and actively enforced via `eslint.config.cjs` with the constraint rules specified in the "Enforcing Boundaries" section below.

## Active Dependency Rules

These rules are now enforced via ESLint module boundaries checks. Violations will cause `nx lint` to fail.

### Type-Based Rules (Layer Enforcement)

**Features** (`type:feature`) can depend on:
- Other features (`type:feature`)
- Data-access layers (`type:data-access`)
- UI components (`type:ui`)
- Utilities (`type:util`)

**Data-Access** (`type:data-access`) can depend on:
- Other data-access layers (`type:data-access`)
- UI components (`type:ui`) — e.g., to display errors
- Utilities (`type:util`)
- ❌ NOT features

**UI** (`type:ui`) can depend on:
- Other UI components (`type:ui`)
- Utilities (`type:util`)
- ❌ NOT data-access or features

**Utilities** (`type:util`) can depend on:
- Other utilities (`type:util`)
- ❌ NOT UI, data-access, or features

**App** (`type:app`) can depend on:
- Features (`type:feature`)
- Data-access (`type:data-access`)
- UI (`type:ui`)
- Utilities (`type:util`)
- ❌ NOT other apps

**E2E** (`type:e2e`) can depend on:
- Other E2E tests only (`type:e2e`)

### Domain-Based Rules (Cross-Domain Isolation)

**CV domain** (`domain:cv`) can depend on:
- Other CV libraries (`domain:cv`)
- Shared libraries (`domain:shared`)
- ❌ NOT Scribo

**Scribo domain** (`domain:scribo`) can depend on:
- Other Scribo libraries (`domain:scribo`)
- Shared libraries (`domain:shared`)
- ❌ NOT CV

**Shared domain** (`domain:shared`) can depend on:
- Other shared libraries (`domain:shared`)
- ❌ NOT CV or Scribo

### Examples

✅ Allowed:
```
@mpp/cv/feature-about → @mpp/cv/data-access → @mpp/shared/data-access
@mpp/scribo/feature-landing → @mpp/shared/ui
@mpp/shared/ui → @mpp/shared/utils
my-personal-project (type:app) → @mpp/cv/feature-about, @mpp/scribo/feature-layout, @mpp/shared/ui
```

❌ Blocked (will fail lint):
```
@mpp/shared/ui → @mpp/cv/data-access (UI depends on domain logic)
@mpp/scribo/data-access → @mpp/cv/data-access (cross-domain data coupling)
@mpp/cv/feature-about → @mpp/scribo/feature-landing (cross-domain feature dependency)
@mpp/shared/utils → @mpp/shared/ui (util depends on UI)
```

## Enforcing Boundaries

### ESLint Rule
Located in `eslint.config.cjs`:

```javascript
'@nx/enforce-module-boundaries': [
  'error',
  {
    enforceBuildableLibDependency: true,
    allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
    depConstraints: [
      {
        sourceTag: 'type:feature',
        onlyDependOnLibsWithTags: ['type:feature', 'type:data-access', 'type:ui', 'type:util'],
      },
      {
        sourceTag: 'type:data-access',
        onlyDependOnLibsWithTags: ['type:data-access', 'type:ui', 'type:util'],
      },
      {
        sourceTag: 'type:ui',
        onlyDependOnLibsWithTags: ['type:ui', 'type:util'],
      },
      {
        sourceTag: 'type:util',
        onlyDependOnLibsWithTags: ['type:util'],
      },
      {
        sourceTag: 'type:app',
        onlyDependOnLibsWithTags: ['type:feature', 'type:data-access', 'type:ui', 'type:util'],
      },
      {
        sourceTag: 'type:e2e',
        onlyDependOnLibsWithTags: ['type:e2e'],
      },
      {
        sourceTag: 'domain:cv',
        onlyDependOnLibsWithTags: ['domain:cv', 'domain:shared'],
      },
      {
        sourceTag: 'domain:scribo',
        onlyDependOnLibsWithTags: ['domain:scribo', 'domain:shared'],
      },
      {
        sourceTag: 'domain:shared',
        onlyDependOnLibsWithTags: ['domain:shared'],
      },
    ]
  }
]
```

### Dependency Checks
`@nx/dependency-checks` rule in `eslint.config.cjs` ensures imports in `package.json` are declared and not duplicated across the monorepo.

## Module Path Aliases

All imports use the `@mpp` namespace (maps to project root for resolution):

```typescript
import { CvComponent } from '@mpp/cv/feature-about';
import { ArticleListComponent } from '@mpp/scribo/feature-article-list';
import { Button } from '@mpp/shared/ui';
import { AuthGuard } from '@mpp/shared/data-access';
import { GlobalErrorHandlerService } from '@mpp/shared/util-error';
import { formatDate } from '@mpp/shared/utils';
```

Configured in `tsconfig.base.json` under `compilerOptions.paths`.

## Adding a New Library

1. Use Nx generator: `nx generate @nx/angular:library --name=my-feature --directory=domain --projectNameAndRootFormat=as-provided`
2. Add appropriate tags to `project.json`:
   ```json
   "tags": ["type:feature", "domain:myfeature"]
   ```
3. Update `tsconfig.base.json` paths to include the new library
4. Import via `@mpp/domain/library-name`

## Best Practices

- **Keep domains independent** — Prefer explicit shared layers (shared/ui, shared/data-access) over cross-domain imports
- **Tag early** — As you add new libs, tag them immediately
- **Lint before merge** — CI runs `nx affected -t lint`; fix boundary violations before committing
- **Document exceptions** — If a boundary rule must be broken, add an eslint-disable comment with explanation
- **Refactor as you go** — If a lib grows beyond ~400 lines or takes on multiple responsibilities, split it or extract utilities to shared/util-*
