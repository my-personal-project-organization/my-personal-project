---
description: Intelligent Nx version migration with version detection, incremental planning, and validation. Use when the user asks to migrate Nx to a target version (e.g., "migrate Nx to v22"). Automatically detects current version, generates incremental migration steps, validates each phase with tests and compatibility checks, and tracks progress. Updates .claude folder with new version info.
---

# Nx Migration Skill

Expert guide for intelligent Nx monorepo version migrations. Detects current and target versions, generates incremental migration plans, validates each phase with comprehensive testing, verifies library compatibility, and updates project documentation in the .claude folder.

## When to Use This Skill

- User asks to "migrate Nx to vX.Y"
- User wants to upgrade Angular alongside Nx
- User needs help planning a safe multi-step Nx migration
- User is experiencing build/test failures after a Nx version change
- User needs to verify library compatibility after Nx upgrade

## Workflow Overview

1. **Detect Current Version** — Read `package.json` to get current Nx, Angular, and critical dependencies
2. **Determine Target Version** — Ask user or infer from their request
3. **Generate Incremental Plan** — Create step-by-step path (v20→v21→v22, etc.)
4. **Execute Each Step** — Run migration, fix issues, validate
5. **Test & Verify** — Lint, build, test, serve, e2e at each phase
6. **Update .claude Folder** — Document new versions and breaking changes
7. **Proceed or Abort** — Only advance if all checks pass

## Step 1: Detect Current Versions

Read package.json and extract:

```bash
grep -E '"nx"|"@angular/core"|"@angular/material"|"@angular/fire"|"typescript"|"jest"' package.json | head -20
```

**Key dependencies to track**:
- `nx` — Core version
- `@angular/core` — Angular version (must align with Nx)
- `@angular/material` — Material Design library
- `@angular/fire` — Firebase integration
- `typescript` — TypeScript version
- `jest` — Testing framework
- `@playwright/test` — E2E testing
- `eslint` — Linting
- `rxjs`, `zone.js` — Angular runtime dependencies

## Step 2: Determine Target Version & Plan

Based on current version, suggest incremental paths:

| Current | Target | Path |
|---------|--------|------|
| v20.x | v22 | v20 → v21 → v22 (3 steps) |
| v21.x | v22 | v21 → v22 (1 step) |
| v19.x | v22 | v19 → v20 → v21 → v22 (4 steps) |

**Ask user**: "Migrate Nx from vX to vY?" → Confirm target version

## Step 3: Pre-Migration Setup

For each version step, before running migration:

```bash
# Clear Nx cache
npx nx reset

# Fresh install
rm -rf node_modules package-lock.json
npm install
```

**Do NOT**:
- Modify workspace config manually before running `nx migrate`

## Step 4: Execute Migration for Each Version

```bash
# Initialize migration
npx nx migrate @nx/workspace@{TARGET_VERSION}

# Review migration.json changes (if created)
cat migration.json

# Run migrations
npx nx migrate --run-migrations

# Install new dependencies
npm install
```

## Step 5: Fix Compilation Issues

After migration, resolve:

1. **TypeScript errors** — Run `npx tsc --noEmit` to check
2. **Breaking config changes** — Check `angular.json` and `tsconfig.json` for deprecated options
3. **Updated APIs** — Review Nx changelog at https://github.com/nrwl/nx/releases/tag/vX.Y.Z

## Step 6: Mandatory Testing Phase (Per Version)

**CRITICAL**: All tests must pass before advancing to next version.

```bash
# 1. Lint all projects
npx nx run-many --target=lint --all

# 2. Build all applications
npx nx run-many --target=build --all --configuration=development

# 3. Unit & integration tests
npx nx run-many --target=test --all

# 4. Serve & verify 3 main applications (check no errors)
# In separate terminals or check logs:
npx nx serve apps/my-personal-project   # Should load at http://localhost:4200
# Then kill and test others

# 5. E2E tests (if applicable)
npx nx run-many --target=e2e --all

# 6. Verify dependency graph
npx nx dep-graph  # Check for circular dependencies
```

**If ANY step fails**: Stop, fix the issue, re-run that step until all pass.

## Step 7: Verify Library Compatibility

After migration, verify these critical dependencies work with the new Nx version:

### Angular & Core (must match Nx major version)
- `@angular/core` — Same major as Nx
- `@angular/material` — Latest compatible patch
- `@angular/cdk` — Same version as @angular/material
- `@angular/fire` — Latest v19 or v20 compatible

### State Management & Forms
- `rxjs` — 7.8.x (compatible with all recent Angular)
- `@ngx-translate/core` — v17+ (compatible with v19+)

### Testing & Build
- `jest` — 29.x (compatible with Angular 19)
- `@playwright/test` — 1.40+ (compatible with v19+)
- `typescript` — 5.5+ (compatible with Angular 19)
- `eslint` — 8.x (compatible with v19+)

### UI & External
- `@amcharts/amcharts4` — 4.9.x (compatible with v19+)
- `echarts` / `ngx-echarts` — 15.x (compatible)
- `firebase` — 10.x (compatible with AngularFire v19)
- `@stripe/stripe-js` — 1.29+ (compatible)
- `@sentry/angular` — 8.x (compatible)

**Action**: If a dependency is incompatible, update it alongside Nx:
```bash
npm install @angular/material@latest @angular/cdk@latest
```

## Step 8: Update .claude Folder Documentation

**IMPORTANT**: After successful migration, update the .claude folder to reflect new versions.

### 8a. Update `.claude/conventions.yaml`

If it exists and documents tech stack versions, update:

```yaml
---
technology_versions:
  nx: "v22.0"
  angular: "v19.2"
  typescript: "5.7"
  jest: "29.7"
  playwright: "1.40"
```

### 8b. Create/Update `.claude/versions.md` (New)

If this file doesn't exist, create it to track migration history:

```markdown
# Version History

## Current Versions
- Nx: v22.0 (as of 2025-07-01)
- Angular: v19.2
- TypeScript: 5.7
- Jest: 29.7
- Playwright: 1.40

## Migration Log
- 2025-07-01: Migrated from Nx v20 → v21 → v22
  - All tests passed
  - Library compatibility verified
  - Production builds validated
```

### 8c. Update `.claude/rules/angular-conventions.md`

If it documents Angular-specific patterns that changed:
- Update `ChangeDetectionStrategy` examples if syntax changed
- Update `signal()` API examples if improved
- Update control flow syntax if new version simplified it

### 8d. Update `.claude/rules/typescript.md`

If TypeScript version bump affected strictness:
- Document new strict compiler options enabled
- Update examples if syntax changed
- Note any deprecated patterns that are now errors

### 8e. Create `.claude/migration-notes/{VERSION}.md` (Optional)

Document breaking changes for this specific version:

```markdown
# Nx v22 Migration Notes

## Breaking Changes
- Signal inputs now require explicit output updates
- Injectable() pattern changed for standalone components
- ...

## Library Updates
- Updated @angular/material to v19.2
- Updated @angular/fire to v19.2

## Known Issues & Workarounds
- None at this time
```

## Step 9: Production Build Validation

After all tests pass, verify production builds:

```bash
npx nx reset
npx nx build apps/my-personal-project --configuration=production
# Check dist/ folder for artifacts
```

## Step 10: Proceed to Next Version (If Multi-Step)

If migration path is multi-step (v20→v21→v22):

1. ✅ All tests passed for v21? → Proceed to v22
2. Repeat steps 3–8 for v22 (including .claude updates)
3. Once v22 tests pass → Done

## Step 11: Post-Migration Cleanup & Commit

```bash
# Remove migration.json if present
rm -f migration.json

# Commit changes (with .claude folder updates included)
git add package.json package-lock.json tsconfig.base.json nx.json
git add .claude/  # Include .claude folder changes
git commit -m "chore(nx): migrate from vX.Y to vA.B

- Updated Nx version from vX.Y to vA.B
- Updated Angular and dependencies to compatible versions
- Ran all tests and E2E validation
- Verified library compatibility
- Updated .claude folder with new version info"
```

## Validation Checklist

Before declaring migration complete:

- [ ] Current version detected correctly
- [ ] Target version confirmed with user
- [ ] Incremental plan created (if multi-step)
- [ ] `npx nx reset` run
- [ ] `npm install` completed
- [ ] `npx nx migrate` executed
- [ ] Compilation errors resolved
- [ ] All lint passes: `npx nx run-many --target=lint --all` ✅
- [ ] All builds pass: `npx nx run-many --target=build --all` ✅
- [ ] All tests pass: `npx nx run-many --target=test --all` ✅
- [ ] Applications serve without errors ✅
- [ ] E2E tests pass (if applicable) ✅
- [ ] Library compatibility verified ✅
- [ ] Production build succeeds ✅
- [ ] `.claude` folder updated with new versions ✅
- [ ] migration.json removed ✅
- [ ] Changes committed (including .claude updates) ✅

## .claude Folder Updates Checklist

After each successful migration step, verify:

- [ ] `.claude/conventions.yaml` — Updated version numbers (if it exists)
- [ ] `.claude/versions.md` — Created or updated with migration log
- [ ] `.claude/rules/angular-conventions.md` — Updated if Angular syntax changed
- [ ] `.claude/rules/typescript.md` — Updated if TypeScript strictness changed
- [ ] `.claude/migration-notes/vX.md` — Created to document breaking changes (optional)
- [ ] CLAUDE.md — Updated if it mentions version numbers

## Common Issues & Fixes

### TypeScript Errors After Migration

**Cause**: TypeScript version mismatch or stricter compiler options

**Fix**:
```bash
npx tsc --noEmit              # Show all errors
npm install typescript@latest # Update to compatible version
```

### Jest Test Failures

**Cause**: Jest config outdated or mock incompatibilities

**Fix**:
```bash
# Re-initialize Jest config
npx nx g @nx/jest:configuration --project=<lib> --force
# Re-run tests
npx nx test <lib>
```

### Serve Port Already in Use

**Cause**: Previous dev server still running

**Fix**:
```bash
lsof -i :4200  # Find process using port 4200
kill -9 <PID>  # Kill it
npx nx serve apps/my-personal-project  # Try again
```

### Build Errors in Production Mode

**Cause**: Development-only code or environment variables missing

**Fix**:
```bash
npm run build:prod
# Check error logs and fix environment config
# Verify .env files are loaded
```

## Migration Example

**Scenario**: Current Nx v20, want to migrate to v22

```
Step 1: v20 → v21
  ├─ npx nx migrate @nx/workspace@21.x
  ├─ npx nx migrate --run-migrations
  ├─ Fix TypeScript errors
  ├─ Run all tests ✅
  ├─ Verify libraries ✅
  ├─ Update .claude/ folder ✅
  └─ Ready for v22

Step 2: v21 → v22
  ├─ npx nx migrate @nx/workspace@22.x
  ├─ npx nx migrate --run-migrations
  ├─ Fix TypeScript errors
  ├─ Run all tests ✅
  ├─ Verify libraries ✅
  ├─ Update .claude/ folder ✅
  └─ Done ✅
```

## Resources

- [Nx Migration Guide](https://nx.dev/packages/nx/documents/migrate)
- [Angular Update Guide](https://angular.dev/cli/update)
- [Nx Changelog](https://github.com/nrwl/nx/releases)
- [Angular Breaking Changes](https://angular.dev/guide/releases)

## Best Practices

1. **Always incremental** — Don't skip major versions
2. **Test at each step** — Don't proceed until tests pass
3. **Document changes** — Keep migration log or commit message clear
4. **Update .claude folder** — Ensure docs stay in sync with actual versions
5. **Parallel dependency updates** — Update @angular/material with @angular/core
6. **Verify builds** — Always test production builds, not just dev
7. **Library compatibility** — Check changelog of each @nx/* plugin before upgrading
