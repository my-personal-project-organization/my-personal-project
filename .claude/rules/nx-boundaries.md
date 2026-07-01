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

### Current State
As of the most recent audit, tags arrays are empty in all `project.json` files. The linter rule `@nx/enforce-module-boundaries` is configured permissively (`sourceTag: '*'` depends on `onlyDependOnLibsWithTags: ['*']`), allowing any lib to depend on any other.

## Intended Dependency Rules

Once tagging is in place, these rules should be enforced:

### Feature → Data-Access (✅ Allowed)
```
@mpp/cv/feature-about → @mpp/cv/data-access
@mpp/scribo/feature-landing → @mpp/scribo/data-access
```
Features orchestrate UI and call domain services.

### Feature → Shared/UI, Shared/Data-Access (✅ Allowed)
```
@mpp/cv/feature-about → @mpp/shared/ui
@mpp/scribo/feature-layout → @mpp/shared/data-access (for auth)
```
Features use shared UI and auth from the shared domain.

### Data-Access → Shared/Data-Access (✅ Allowed)
```
@mpp/cv/data-access → @mpp/shared/data-access (for HTTP client, auth context)
```
Domain stores depend on shared infrastructure.

### Feature ↔ Feature (⚠️ Caution)
```
@mpp/cv/feature-about → @mpp/scribo/feature-layout (✅ OK if unidirectional, e.g., for layout wrapper)
```
Inter-domain feature dependencies should be rare; prefer shared/ui or shared/data-access.

### ❌ Disallowed (Should Be Caught)
```
@mpp/shared/ui → @mpp/cv/data-access (UI should not depend on domain logic)
@mpp/scribo/data-access → @mpp/cv/data-access (No cross-domain data coupling)
@mpp/cv/feature-about → @mpp/scribo/feature-landing (Features shouldn't directly depend on each other)
```

## Enforcing Boundaries

### ESLint Rule
Located in `eslint.config.js`:

```javascript
'@nx/enforce-module-boundaries': [
  'error',
  {
    enforceBuildableLibDependency: true,
    depConstraints: [
      {
        sourceTag: 'type:feature',
        onlyDependOnLibsWithTags: ['type:feature', 'type:data-access', 'type:ui', 'type:util']
      },
      {
        sourceTag: 'type:data-access',
        onlyDependOnLibsWithTags: ['type:data-access', 'type:ui', 'type:util']
      },
      {
        sourceTag: 'type:ui',
        onlyDependOnLibsWithTags: ['type:ui', 'type:util']
      },
      // Domain isolation (if stricter rules desired):
      {
        sourceTag: 'domain:cv',
        onlyDependOnLibsWithTags: ['domain:cv', 'domain:shared']
      },
      {
        sourceTag: 'domain:scribo',
        onlyDependOnLibsWithTags: ['domain:scribo', 'domain:shared']
      }
    ]
  }
]
```

To activate: Add tags to each `project.json`, then update `eslint.config.js` with the rules above. Run `nx lint` to verify.

### Dependency Checks
`@nx/dependency-checks` rule in `eslint.config.js` ensures imports in `package.json` are declared and not duplicated across the monorepo.

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
