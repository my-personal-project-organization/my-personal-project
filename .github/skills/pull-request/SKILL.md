---
name: pull-request
description: 'Create and manage Pull Requests with conventional PR format, intelligent branch selection, and automated validation. Use when user asks to open a PR, create a pull request, or mentions "/pr". Supports: (1) Auto-detecting source and target branches, (2) Generating conventional PR titles and descriptions, (3) Adding reviewers and labels, (4) Validating branch protection rules and CI status'
license: MIT
---

# Pull Request Management

## Overview

Create comprehensive, well-structured Pull Requests following best practices and conventional PR format. Automate branch detection, validation, and PR creation workflows.

## Pull Request Format

```
<type>(<scope>): <description>

## Description
[What changes are being made and why]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123
Relates to #456

## Testing
[How to test this change]

## Checklist
- [ ] Tests passing locally
- [ ] No new warnings
- [ ] Updated documentation
- [ ] Code follows style guidelines
```

## PR Types

| Type       | Purpose                                  |
| ---------- | ---------------------------------------- |
| `feat`     | New feature or functionality             |
| `fix`      | Bug fix or issue resolution              |
| `docs`     | Documentation changes only               |
| `style`    | Code style/formatting (no logic changes) |
| `refactor` | Code refactoring (no feature/fix)        |
| `perf`     | Performance improvement                  |
| `test`     | Add/update tests                         |
| `build`    | Build system/dependency changes          |
| `ci`       | CI/CD pipeline configuration changes     |
| `chore`    | Maintenance/misc changes                 |

## Workflow

### 1. Verify Local Changes

```bash
# Check current branch name
git branch --show-current

# Review status of your changes
git status

# Verify all changes are committed
git log --oneline -5

# Check if branch is up-to-date with remote
git fetch origin
git log --oneline origin/main..HEAD
```

### 2. Validate Branch Requirements

**Important**: Follow these branch naming conventions:

- Feature: `feat/issue-#-description` or `<issue-#>-description`
- Bug fix: `fix/issue-#-description` or `<issue-#>-description`
- Documentation: `docs/description`
- Chore: `chore/description`

Example branch names:

- `49-add-new-auth-service`
- `feat/35-update-login-flow`
- `fix/128-auth-guard-bug`
- `docs/update-readme`

### 3. Determine Target Branch

| Current Branch      | Target Branch | Purpose                         |
| ------------------- | ------------- | ------------------------------- |
| `feat/*`, `fix/*`   | `main`        | Feature/bugfix to main          |
| `docs/*`, `chore/*` | `main`        | Documentation/chore to main     |
| `main`              | `develop`     | Release preparation             |
| Feature branch      | `develop`     | Integration before main release |

### 4. Generate PR Title & Description

Analyze your commit messages and branch name to create:

- **Title**: `<type>(<scope>): <description>` from your branch/commits
- **Scope**: The affected app/library (e.g., `shared/ui`, `b2b`)
- **Description**: Summary of changes, why they were made, and testing approach

#### Title Guidelines

- Keep title under 72 characters
- Use imperative mood ("add feature" not "added feature")
- Reference issue number: `feat(49-new-auth): add login process`
- Format: `<type>(<branch-or-scope>): <description>`

#### Description Template

```markdown
## Description

Brief summary of the changes and the problem they solve.

## Type of Change

- [x] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentation update

## Related Issues

Closes #<issue-number>
Relates to #<other-issue>

## Changes Made

- Detail 1
- Detail 2
- Detail 3

## Testing

Steps to verify the change works:

1. Step 1
2. Step 2
3. Expected result

## Checklist

- [x] Tests passing locally
- [x] No new warnings
- [x] Updated documentation if needed
- [x] Code follows project style guidelines
- [ ] Breaking changes documented
```

### 5. Create Pull Request

#### Via BitBucket Web Interface

```bash
# 1. Push your branch to origin
git push origin <branch-name>

# 2. (Optional) Set upstream for first push
git push -u origin <branch-name>

# 3. Visit BitBucket and create PR
# https://bitbucket.org/your-workspace/your-repo/pulls
```

### 6. Validate PR Requirements

Before finalizing, verify:

```bash
# ✅ Branch is up-to-date
git fetch origin
git rebase origin/main

# ✅ All tests pass locally
npm run test
npm run lint
npm run build

# ✅ No merge conflicts
# (BitBucket will show if conflicts exist)

# ✅ Commits are logical and well-labeled
git log --oneline origin/main..HEAD

# ✅ No accidental commits
git diff origin/main

# ✅ No large binary files
git ls-tree -r HEAD | awk '{print $4}' | xargs ls -lh | awk '$5 > 5242880 {print}'
```

### 7. Request Reviews

When creating the PR:

1. **Auto-add Reviewers** based on code ownership:

   - CODEOWNERS file (if present)
   - Previous contributors to modified files
   - Team members

2. **Add Labels** for categorization:

   - `bug` - Bug fixes
   - `feature` - New features
   - `enhancement` - Improvements
   - `documentation` - Documentation updates
   - `needs-review` - Waiting for review
   - `blocked` - Blocked by other PRs
   - `wip` - Work in progress
   - `dependencies` - Dependency updates

3. **Link Issues**:
   - "Closes #123" - Auto-closes issue when merged
   - "Relates to #456" - Links related issues
   - "Fixes #789" - References fixes

### 8. Handle CI/Checks

```bash
# Wait for CI to complete
# BitBucket will show build status and test results

# If CI fails:
# 1. Check the build logs
# 2. Fix the issues locally
# 3. Commit with message: fix(pr-branch): resolve CI failures
# 4. Push to force update PR: git push origin <branch-name>

# If merge conflict exists:
git fetch origin
git rebase origin/main
# Resolve conflicts
git add .
git rebase --continue
git push origin <branch-name> --force-with-lease
```

### 9. Code Review Loop

During review:

1. **Respond to Comments**:

   - Address feedback with new commits (don't amend)
   - Comment back when issue is resolved
   - Push changes automatically updates PR

2. **Request Re-review**:

   - After addressing feedback, click "Request Review"
   - Mention reviewer: `@reviewer-username`

3. **Approve & Merge**:
   - Once approved, merge via BitBucket UI
   - Choose merge strategy (usually "Squash and merge" or "Merge commit")
   - Delete branch after merge

## Best Practices

- **One feature per PR**: Keep changes focused and reviewable
- **Small PRs are better**: Easier to review, faster to merge
- **Descriptive titles**: Someone should understand the change from the title
- **Update documentation**: If you change functionality, update docs
- **Link to issues**: Always reference related issues
- **Respond to feedback**: Engage with reviewers promptly
- **Test before submitting**: Ensure tests pass locally first
- **No work-in-progress merges**: Only merge when ready
- **Consistent with commit history**: PR title should match commit messages
- **Screenshots for UI changes**: Include visual proof for UI modifications

## Nx Monorepo Guidelines

When creating PRs in the Nx monorepo:

- **Scope**: Specify affected apps/libs in PR title

  - `feat(b2c): add new component`
  - `fix(shared/ui): resolve button styling`
  - `refactor(b2b): improve performance`

- **Test affected projects**:

  ```bash
  # Test changed package
  npx nx test <project-name>

  # Build changed package
  npx nx build <project-name>

  # Check affected projects
  npx nx affected:test
  npx nx affected:build
  ```

- **Update multiple projects consistently** if changes affect shared libraries

- **Document API changes** if modifying shared interfaces or services

## Safety Protocol

- **NEVER** merge your own PR without review (require at least 1+ approval)
- **NEVER** force-push to `main` or `develop` branches
- **NEVER** merge unvalidated code (CI must pass)
- **NEVER** include credentials or secrets in PR
- **NEVER** commit `packages/shared.diff` file
- **NEVER** disable branch protection rules
- **NEVER** bypass required checks without explicit authorization
- **VERIFY** all commits are yours before pushing
- **CLEAN** up branches after merge
- **DOCUMENT** breaking changes in PR description
- **HANDLE** merge conflicts carefully - don't auto-resolve without review

## Troubleshooting

### PR Won't Push

```bash
# Check if branch exists remotely
git fetch origin

# If rejected, may need to update
git pull origin <branch-name>

# Try again with lease (safe force push)
git push --force-with-lease origin <branch-name>
```

### Merge Conflicts

```bash
# Update your branch
git fetch origin
git rebase origin/main

# Resolve conflicts in your editor
# Then continue rebase
git add .
git rebase --continue

# Push updated branch
git push --force-with-lease origin <branch-name>
```

### CI Pipeline Failing

1. Check BitBucket build logs
2. Run locally: `npm run test`, `npm run lint`, `npm run build`
3. Fix issues and push new commit
4. CI will automatically re-run

### PR Needs Updates from Main

```bash
# Option 1: Rebase (cleaner history)
git fetch origin
git rebase origin/main
git push --force-with-lease origin <branch-name>

# Option 2: Merge (preserves history)
git fetch origin
git merge origin/main
git push origin <branch-name>
```
