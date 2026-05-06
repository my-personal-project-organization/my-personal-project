---
name: NxMigrationPrompt
description: Automate Nx version migration with incremental steps and testing validation
agent: DeveloperAgent
---

# 🚀 Nx Migration Prompt

You are automating Nx version migration for the monorepo. Execute incremental migrations between major versions, validate each phase with comprehensive testing, and verify library compatibility before progressing.

## Instructions

### 1. Determine Current and Target Versions

Get current versions:

```bash
cat package.json | grep -E '"nx"|"@angular/core"'
```

Supported migration paths:

- **v20 → v21 → v22**: Incremental migration (recommended)
- **v21 → v22**: Single step if already on v21
- **v20 → v22**: Will be split into v20→v21→v22

### 2. Pre-Migration Setup

- ✅ Document current versions in migration log
- ✅ Clear Nx cache: `npx nx reset`
- ✅ Fresh npm install: `rm -rf node_modules && npm install`
- ✅ **CRITICAL**: Do NOT update `packages/shared/` (submodules) - ignore their `project.json`

### 3. Execute Incremental Migration

For each version step (v20→v21, then v21→v22):

#### A. Initialize Migration

```bash
npx nx migrate @nx/workspace@{TARGET_VERSION}
npx nx migrate --run-migrations
npm install
```

#### B. Fix Compilation Issues

- Resolve TypeScript errors
- Update deprecated configurations
- Check breaking changes in [Nx changelog](https://github.com/nrwl/nx/releases)

### 4. Mandatory Testing Phase

**DO NOT proceed to next version until all tests pass**

- [ ] Run full workspace lint: `npm run lint`
- [ ] Build all applications: `npx nx run-many --target=build --all`
- [ ] Test all libraries: `npx nx run-many --target=test --all`
- [ ] **Critical**: Serve and test the 3 main applications:
  - [ ] `web-app`: `npx nx serve web-app` (port 4200)
  - [ ] `b2b`: `npx nx serve b2b` (port 4200)
  - [ ] `admin-panel`: `npx nx serve admin-panel` (port 4201)
- [ ] Run E2E tests: `npx nx run-many --target=e2e --all`
- [ ] Verify dependency graph: `npx nx dep-graph`

```bash
# 1. Workspace Lint
npx nx run-many --target=lint --all

# 2. Build All Applications
npx nx run-many --target=build --all --configuration=development

# 3. Unit & Integration Tests
npx nx run-many --target=test --all

# 4. Serve & Verify 3 Main Applications
npx nx serve web-app          # Port 4200 - verify loads
npx nx serve b2b              # Port 4200 - verify loads
npx nx serve admin-panel      # Port 4201 - verify loads

# 5. E2E Tests
npx nx run-many --target=e2e --all

# 6. Dependency Graph Validation
npx nx dep-graph
```

### 5. Library Compatibility Verification

Check these critical dependencies from `package.json`:

#### Angular & Core Libraries

- ✅ `@angular/*` - Verify major version matches Nx version
- ✅ `@angular/material` v19.2.9 - Ensure compatibility
- ✅ `@angular/cdk` v19.2.9 - Update with Material
- ✅ `@angular/fire` v19.2.0 - Firebase compatibility

#### State & Forms

- ✅ `rxjs` 7.8.2 - Reactive programming library
- ✅ `@ngx-translate/core` v17.0.0 - Translation library

#### UI & Charts

- ✅ `@amcharts/amcharts4` v4.9.19 - Chart library
- ✅ `echarts` & `ngx-echarts` v15.0.0 - Chart library

#### Testing & Build Tools

- ✅ `jest` 29.7.0 - Unit testing
- ✅ `@playwright/test` v1.55.0 - E2E testing
- ✅ `typescript` 5.7.3 - Language version
- ✅ `eslint` 8.57.1 - Linting
- ✅ `@nx/*` plugins - All @nx packages updated to same version

#### Payment & External Services

- ✅ `@stripe/stripe-js` v1.29.0 - Payment processing
- ✅ `@paypal/paypal-js` v5.0.6 - Payment processing
- ✅ `@sentry/angular` v8.33.0 - Error tracking
- ✅ `ng-recaptcha` v13.2.1 - reCAPTCHA integration

#### Other Critical Libraries

- ✅ `firebase` v10.14.1 - Backend integration
- ✅ `zone.js` 0.15.1 - Angular zone utilities

### 6. Build Validation (Production)

```bash
npx nx reset
npx nx build web-app --configuration=production
npx nx build b2b --configuration=production
npx nx build admin-panel --configuration=production
```

### 7. Post-Migration Cleanup

- ✅ Verify `packages/shared/` was NOT modified
- ✅ Remove migration files: `rm migration.json` (if created)
- ✅ Commit changes with clear message: `chore: upgrade nx to v{VERSION}`

## Migration Workflow

1. **Determine versions** → Identify current and target Nx version
2. **Pre-migration** → Clear cache, fresh install
3. **Execute migration** → Run `nx migrate` command
4. **Fix issues** → Resolve compilation/config errors
5. **Test phase** → Run ALL tests before proceeding
6. **Verify libraries** → Check compatibility of dependencies
7. **Build validation** → Production build test
8. **Repeat** → If target not reached, go to step 3 for next version
9. **Post-migration** → Cleanup and commit

## Critical Requirements

1. **MUST** run all testing phases before proceeding to next version
2. **MUST NOT** skip E2E tests
3. **MUST NOT** update `packages/shared/` submodule
4. **MUST** verify all 3 main applications serve without errors
5. **MUST** check library compatibility for breaking changes
6. **MUST** validate production builds compile without errors

## Incremental Migration Example

```
Current: Nx v20.8.2 → Target: Nx v22

Step 1: v20 → v21
  - Run migration
  - Fix issues
  - Run all tests ✅
  - Verify libraries ✅

Step 2: v21 → v22
  - Run migration
  - Fix issues
  - Run all tests ✅
  - Verify libraries ✅

Done: Nx v22 active
```

## Common Issues

### 🚫 Build Errors

- Clear cache: `npx nx reset`
- Check `tsconfig.json` and `angular.json` for deprecated options
- Review breaking changes in Nx changelog

### 🚫 Test Failures

- Update Jest configuration if needed
- Check for deprecated testing utilities
- Verify mock configurations work with new version

### 🚫 Serve Errors

- Clear `node_modules` and reinstall: `npm ci`
- Check dev server port availability
- Verify proxy configurations in `proxy.conf.json`

## Resources

- [Nx Migration Guide](https://nx.dev/packages/nx/documents/migrate)
- [Angular Update Guide](https://angular.dev/cli/update)

## Summary

This prompt automates Nx migrations by executing incremental version upgrades with mandatory testing validation at each phase. Migration only proceeds after all tests pass, library compatibility is verified, and production builds succeed. Do NOT skip testing phases between versions.

---

Keep migrations incremental, test thoroughly, and verify library compatibility at each step.
