---
name: git-commits
description: Conventional Commits format with branch name as scope, enforced in CI
---

# Git Commit Conventions

Follow **Conventional Commits** format for all commits. This enables automated changelog generation, semantic versioning, and clearer history.

## Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

Describes the nature of the change:

- **`feat`** — New feature
- **`fix`** — Bug fix
- **`refactor`** — Code refactoring (no feature/bug change)
- **`perf`** — Performance improvement
- **`test`** — Test additions or modifications
- **`docs`** — Documentation
- **`style`** — Code style (formatting, missing semicolons, etc.)
- **`chore`** — Build, dependencies, CI config

### Scope

Use the **branch name** or affected domain/library:

- Branch `feature/cv-dark-mode` → scope: `cv`
- Branch `bugfix/scribo-layout-mobile` → scope: `scribo/feature-layout`
- Branch `refactor/shared-button-component` → scope: `shared/ui`
- General project work → scope: can be empty or use root domain

### Subject

- **Imperative mood** — "add" not "added" or "adds"
- **Lowercase** — No capital letter
- **No period** — End without punctuation
- **50 characters or less** — Be concise

### Body (Optional)

- **Separate from subject by blank line**
- **Explain what and why**, not how
- **Wrap at 72 characters**
- Use bullet points for multiple changes:
  ```
  - Add dark mode toggle to nav bar
  - Update tailwind config for theme colors
  - Refactor layout signal initialization
  ```

### Footer (Optional)

Use for breaking changes, issue references, or related metadata:

```
BREAKING CHANGE: Remove legacy auth service (use new Firebase AngularFire instead)

Fixes #123
Closes #456
Related-To: #789
```

## Examples

### Feature

```
feat(cv): add dark mode switcher to navigation

- Add isDarkMode signal to nav component
- Update tailwind config to support dark mode colors
- Persist theme choice to localStorage

Fixes #45
```

### Bug Fix

```
fix(scribo/feature-layout): correct mobile header spacing on small screens

Padding was hardcoded to 16px; now responds to viewport size.

Fixes #102
```

### Refactor

```
refactor(shared/ui): extract button variant styles into CSS utility

Move hardcoded color values from button.component.scss to tailwind
config for easier maintenance and consistency across components.
```

### Test

```
test(scribo/feature-article): add test coverage for article detail loading

- Add test for successful article load
- Add test for error state when fetch fails
- Add test for loading skeleton display
```

### Documentation

```
docs(shared): add i18n setup guide to project wiki

Include instructions for adding new locales and marking strings for translation.
```

### Chore

```
chore(deps): upgrade Angular from 19.0 to 19.2

Includes bug fixes and minor performance improvements.
```

### Breaking Change

```
feat(shared/data-access)!: migrate auth service to AngularFire

BREAKING CHANGE: AuthService constructor no longer accepts `httpClient`.
Use the new FirebaseAuthService from AngularFire instead.
```

(Note the `!` before the colon to indicate breaking change)

## Branch Naming

Align branch names with commit scopes to keep history readable:

- `feature/cv-dark-mode` → commit scope: `cv`
- `fix/scribo-article-load-error` → commit scope: `scribo`
- `refactor/shared-ui-button` → commit scope: `shared/ui`
- `docs/update-readme` → commit scope: `docs`

## Commit Hooks

A pre-commit hook (if configured) validates format. If your commit doesn't match Conventional Commits:

```
commit-msg hook: Invalid commit message format

Expected: <type>(<scope>): <subject>
Got: Updated the button component

Tips:
  - Type must be one of: feat, fix, refactor, perf, test, docs, style, chore
  - Scope: use branch name or affected domain/lib (e.g., cv, scribo, shared/ui)
  - Subject: imperative mood, lowercase, no period
```

Fix by amending:

```bash
git commit --amend
# Edit the message in your editor
# Save and exit
```

## Interactive Rebase to Squash Commits

Before pushing, keep history clean by squashing work-in-progress commits:

```bash
# Rebase on main
git rebase -i main

# Rebase on a specific number of commits
git rebase -i HEAD~3
```

In the interactive editor:

```
pick abc1234 feat(cv): add dark mode toggle
squash def5678 wip: fix dark mode colors
squash ghi9012 style: format code

# Rebase abc1234..ghi9012 onto abc1234 (3 commands)
#
# Commands:
# p, pick   = use commit
# r, reword = use commit, but edit the commit message
# s, squash = use commit, but meld into previous commit
# f, fixup  = like "squash", but discard this commit's log message
```

Result: three commits squashed into one `feat(cv): add dark mode toggle` commit.

## Merge vs. Rebase

- **Rebase** (default for this project) — Linear history, cleaner graph
  ```bash
  git pull --rebase origin main
  git rebase main  # Before pushing
  ```

- **Merge** — Preserves branching history; use only if needed
  ```bash
  git merge main
  ```

## CI and Automation

The CI pipeline validates commit messages on pull requests. If a commit doesn't match the format, the check fails and you must fix it before merging.

## Changelog Generation

Commits following Conventional Commits enable automated changelog generation via tools like `standard-changelog` or `semantic-release`. Breaking changes are tracked separately.

Example auto-generated changelog:

```
## [2.0.0] - 2025-07-15

### Features
- **cv**: add dark mode switcher to navigation
- **scribo**: add article share buttons

### Bug Fixes
- **scribo/feature-layout**: correct mobile header spacing on small screens
- **shared/ui**: fix button disabled state style

### Breaking Changes
- **shared/data-access**: Remove legacy AuthService; use FirebaseAuthService instead

### Refactoring
- **shared/ui**: extract button variant styles into CSS utility
```

## Quick Reference

| Scenario | Type | Example |
|----------|------|---------|
| New feature | `feat` | `feat(cv): add cv section dark mode` |
| Bug fix | `fix` | `fix(scribo): correct article load error` |
| Refactor | `refactor` | `refactor(shared/ui): extract button styles` |
| Add test | `test` | `test(cv): add cv component tests` |
| Update docs | `docs` | `docs: add i18n guide to README` |
| Update dependencies | `chore` | `chore(deps): upgrade Angular to 19.2` |
| Code style | `style` | `style(shared): format code with prettier` |
| Performance | `perf` | `perf(cv): optimize cv component rendering` |
