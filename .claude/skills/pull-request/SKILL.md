---
description: Create and manage Pull Requests with Conventional Commits format, intelligent branch detection, and automated validation. Use when user asks to open a PR, create a pull request, or mentions "/pr". Supports auto-detecting source and target branches, generating conventional PR titles and descriptions, linking issues, validating CI checks, and best practices for monorepo workflows.
---

# Pull Request Management

Expert guide for creating comprehensive, well-structured Pull Requests following best practices and Conventional Commits format. Automate branch detection, validation, and PR creation workflows for this Nx monorepo project.

## When to Use This Skill

- Creating a new PR for feature, bugfix, refactor, or documentation work
- Auto-detecting the correct target branch (main for most work)
- Generating PR titles and descriptions from commit history
- Linking related GitHub issues
- Validating branch status and CI checks
- Reviewing PR checklist before pushing
- Debugging merge conflicts
- Handling CI pipeline failures

## PR Format: Conventional Commits Style

### Title Format

```
<type>(<scope>): <description>
```

**Type**:
- `feat` — New feature
- `fix` — Bug fix
- `refactor` — Code refactoring (no feature/bug change)
- `perf` — Performance improvement
- `test` — Test additions or modifications
- `docs` — Documentation
- `style` — Code style (formatting, missing semicolons)
- `chore` — Build, dependencies, CI config

**Scope** (use library/domain name):
- `cv` — CV feature library
- `scribo` — Blog/article feature library
- `scribo/feature-layout` — Specific feature within domain
- `shared/ui` — Shared UI components
- `shared/data-access` — Shared data/auth layer

**Description**:
- Imperative mood: "add" not "added" or "adds"
- Lowercase start, no period at end
- Under 72 characters
- Be concise and descriptive

### Examples

```
feat(cv): add dark mode toggle to CV landing page
fix(scribo/feature-layout): correct mobile header spacing
refactor(shared/ui): extract button variant styles into utilities
test(cv/feature-about): add component integration tests
docs(shared): update i18n setup guide
chore(deps): upgrade Angular from 19.0 to 19.2
```

### PR Body Template

```markdown
## Description
Brief summary of what this PR does and why it's needed.

## Type of Change
- [x] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123
Relates to #456

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
Steps to verify this change works:
1. Run `npm test`
2. Run `npm run e2e`
3. Manual verification: [describe steps]

## Checklist
- [x] Tests passing locally (`npm run run-before-pr`)
- [x] No new lint warnings
- [x] Updated documentation if needed
- [x] Code follows project conventions
- [ ] Breaking changes documented
```

## Workflow: Create a PR

### 1. Verify Local Changes

```bash
# Check current branch
git branch --show-current

# Review your changes
git status

# See commits on this branch
git log --oneline origin/main..HEAD

# Verify branch is up-to-date
git fetch origin
git log --oneline origin/main..HEAD
```

### 2. Validate Local Environment

```bash
# Run all checks before pushing
npm run run-before-pr
# This runs: nx affected -t lint test build e2e

# OR run specific checks:
npm run lint      # Lint
npm test          # Unit tests
npm run build     # Build
npm run e2e       # E2E tests
```

### 3. Ensure Clean Commit History

```bash
# View commits to be pushed
git log --oneline origin/main..HEAD

# If there are work-in-progress commits, squash them:
git rebase -i origin/main

# In the interactive editor:
# pick abc1234 feat(cv): add dark mode
# squash def5678 wip: fix colors
# squash ghi9012 style: format

# Save and push
git push origin <branch-name>
```

### 4. Determine Target Branch

For this project, **always target `main`**:

| Branch Type | Target | When |
|---|---|---|
| `feat/*` | `main` | New feature |
| `fix/*` | `main` | Bug fix |
| `refactor/*` | `main` | Refactoring |
| `docs/*` | `main` | Documentation |
| `test/*` | `main` | Test additions |
| `chore/*` | `main` | Dependency updates |

### 5. Create PR via GitHub CLI

```bash
# Create PR with auto-detected title/body
gh pr create --title "feat(cv): add dark mode toggle" \
  --body "$(cat <<'EOF'
## Description
Added a dark mode toggle to the CV landing page navigation bar.

## Type of Change
- [x] New feature

## Testing
- npm run test (all tests pass)
- npm run e2e (navigation tests pass)
- Manual: Click toggle, verify styles update

## Checklist
- [x] Tests passing locally
- [x] No new warnings
- [x] Code follows conventions
EOF
)"
```

Or **interactively**:
```bash
gh pr create --draft  # Creates draft PR, opens in browser
# Fill in title, description, and submit
```

### 6. Push Branch to Remote

```bash
# First time pushing this branch
git push -u origin <branch-name>

# Subsequent pushes
git push origin <branch-name>

# If rejected, may need rebase:
git fetch origin
git rebase origin/main
git push --force-with-lease origin <branch-name>
```

### 7. Monitor CI and Checks

GitHub Actions will automatically run:
- **Lint**: ESLint checks (`nx affected -t lint`)
- **Test**: Jest unit tests (`nx affected -t test`)
- **Build**: Production build (`nx affected -t build`)
- **E2E**: Playwright tests (`nx affected -t e2e`)
- **Storybook**: Build Storybook docs
- **Chromatic**: Visual regression tests on shared UI

Check PR for status badge. If any fail:
1. Review logs
2. Fix locally
3. Commit and push
4. CI re-runs automatically

### 8. Respond to Review Feedback

When reviewers request changes:

1. **Fix the issue** in your editor
2. **Commit** with new commit (don't amend):
   ```bash
   git add .
   git commit -m "fix review feedback: clarify error handling"
   ```
3. **Push** the new commit:
   ```bash
   git push origin <branch-name>
   ```
4. **Comment** on the review:
   > "Fixed in commit abc1234 — please re-review"

5. **Re-request review** via GitHub UI button

### 9. Merge PR

Once approved:

1. **Ensure branch is up-to-date**:
   ```bash
   git fetch origin
   git rebase origin/main
   git push --force-with-lease origin <branch-name>
   ```

2. **Merge via GitHub UI**:
   - Click "Merge pull request" button
   - Choose merge strategy:
     - "Squash and merge" (recommended): Single clean commit
     - "Create a merge commit": Preserves branching history
   - Confirm

3. **Delete branch** (GitHub offers this automatically)

## Branch Naming Convention

Use this pattern for consistency:

```
<type>/<issue-number>-<description>
```

Examples:
- `feat/45-dark-mode-toggle`
- `fix/102-nav-spacing-mobile`
- `refactor/87-shared-ui-button`
- `docs/update-readme`
- `test/article-component`

## Monorepo Best Practices

### Scope Selection

When affecting multiple libraries, use the most specific scope:

```
# Good: Specific scope
feat(scribo/feature-layout): add mobile nav menu

# Also OK: Parent domain
feat(scribo): improve navigation across features

# Avoid: Too generic or wrong scope
feat(shared): update navigation (unclear which shared area)
```

### Test Affected Projects

```bash
# Test only changed projects
nx affected -t test

# Build only changed projects
nx affected -t build

# Lint only changed projects
nx affected -t lint

# Run e2e for affected apps
nx affected -t e2e
```

### Update Dependencies Consistently

If changing a shared library, test that dependent projects still work:

```bash
# If you change libs/shared/ui, verify all apps that use it
nx build apps/my-personal-project
nx test apps/my-personal-project
nx e2e apps/my-personal-project-e2e
```

## Handling Conflicts

### Merge Conflicts During Rebase

```bash
# Update your branch from main
git fetch origin
git rebase origin/main

# If conflicts occur, edit the conflicted files
# Then continue the rebase
git add .
git rebase --continue

# Push updated branch (need force-with-lease)
git push --force-with-lease origin <branch-name>
```

### Viewing Conflicts

```bash
# See which files have conflicts
git status

# Use your editor to resolve conflicts
# Search for <<<<<<, ======, >>>>>> markers
# Remove conflict markers and choose the correct version
```

## Safety Checklist

Before pushing, verify:

- ✅ **Branch is clean**: `git status` shows no uncommitted changes
- ✅ **Commits are clean**: `git log --oneline origin/main..HEAD` (meaningful messages)
- ✅ **Tests pass**: `npm run run-before-pr`
- ✅ **No secrets**: Check for API keys, credentials, passwords
- ✅ **No large files**: Use `git ls-tree -r HEAD` to check file sizes
- ✅ **Branch name is correct**: `git branch --show-current`
- ✅ **Target is main**: Double-check before creating PR

### Never

- ❌ Push directly to `main` (branch protection prevents this)
- ❌ Force-push to `main` or shared branches
- ❌ Merge your own PR without review
- ❌ Skip CI checks
- ❌ Commit credentials or secrets
- ❌ Commit large binaries (>5MB)
- ❌ Bypass linting with `--no-verify`

## Common Issues

### PR Title Doesn't Match Commits

**Fix**: Update PR title manually via GitHub UI to match Conventional Commits format.

### Tests Fail in CI but Pass Locally

```bash
# Ensure you're on the latest main
git fetch origin
git rebase origin/main

# Run full test suite (not just `npm test`)
npm run run-before-pr

# Check if cache is stale
rm -rf node_modules
npm install
npm run run-before-pr
```

### Can't Push (Rejected)

```bash
# Fetch latest
git fetch origin

# Check if main moved forward
git log --oneline origin/main..HEAD

# If so, rebase
git rebase origin/main

# Force push safely
git push --force-with-lease origin <branch-name>
```

### Merge Conflict with Main

```bash
git fetch origin
git rebase origin/main

# Resolve conflicts in editor (look for <<<, ===, >>>)
# Then:
git add .
git rebase --continue
git push --force-with-lease origin <branch-name>
```

## Issue Linking

Link your PR to GitHub issues:

```markdown
# In PR description:
Closes #123      # Auto-closes issue when PR merges
Fixes #456       # Same as Closes
Related-To #789  # Links without closing
```

## Reviewing Your Own Changes

Before submitting:

1. **Check the diff**:
   ```bash
   git diff origin/main
   ```

2. **Look for**:
   - Accidental console.log statements
   - Commented-out code
   - TypeScript `any` types
   - Missing tests
   - Style inconsistencies

3. **Review test coverage**:
   ```bash
   nx test <lib> --coverage
   ```

4. **Check bundle impact**:
   ```bash
   npm run analyze-bundle
   ```

## Quick Reference

| Task | Command |
|------|---------|
| Create PR | `gh pr create` |
| Check status | `gh pr status` |
| View PR | `gh pr view` |
| Add reviewer | `gh pr edit -a <user>` |
| View checks | `gh pr checks` |
| Merge PR | GitHub UI (safer) |
| Close PR | `gh pr close` |

## Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub CLI Docs](https://cli.github.com/manual/)
- [Nx Monorepo Guide](https://nx.dev/docs/getting-started/what-is-nx)
- [Angular Best Practices](https://angular.dev/guide)
