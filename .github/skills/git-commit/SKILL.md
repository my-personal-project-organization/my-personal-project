---
name: git-commit
description: 'Execute git commit with conventional commit message analysis, intelligent staging, and message generation. Use when user asks to commit changes, create a git commit, or mentions "/commit". Supports: (0) Don't add packages/shared submodule files, (1) Auto-detecting type and scope from changes, (2) Generating conventional commit messages from diff, (3) Interactive commit with optional type/scope/description overrides, (4) Intelligent file staging for logical grouping'
license: MIT
allowed-tools: Bash
---

# Git Commit with Conventional Commits

## Overview

Create standardized, semantic git commits using the Conventional Commits specification. Analyze the actual diff to determine appropriate type, scope, and message.

## Conventional Commit Format

```
<type>(<branch-name>): <description>

[optional body]

[optional footer(s)]
```

## Commit Types

| Type       | Purpose                        |
| ---------- | ------------------------------ |
| `feat`     | New feature                    |
| `fix`      | Bug fix                        |
| `docs`     | Documentation only             |
| `style`    | Formatting/style (no logic)    |
| `refactor` | Code refactor (no feature/fix) |
| `perf`     | Performance improvement        |
| `test`     | Add/update tests               |
| `build`    | Build system/dependencies      |
| `ci`       | CI/config changes              |
| `chore`    | Maintenance/misc               |
| `revert`   | Revert commit                  |

## Breaking Changes

```
# Exclamation mark after type/scope
feat!: remove deprecated endpoint

# BREAKING CHANGE footer
feat: allow config to extend other configs

BREAKING CHANGE: `extends` key behavior changed
```

## Workflow

### 0. packages/shared submodule

**Important**: Never stage or commit packages/shared.diff file

- NEVER update packages/shared submodule

### 1. Analyze Diff

```bash
# If files are staged, use staged diff
git diff --staged

# If nothing staged, use working tree diff
git diff

# Also check status
git status --porcelain
```

### 2. Stage Files (if needed)

**Important**: Never commit packages/shared.diff file

If nothing is staged or you want to group changes differently:

```bash
# Stage specific files
git add path/to/file1 path/to/file2

# Stage by pattern
git add *.test.*
git add src/components/*

# Interactive staging
git add -p
```

**Never commit secrets** (.env, credentials.json, private keys).
**Never commit packages/shared** (packages/shared.diff).

### 3. Generate Commit Message

Analyze the diff to determine:

- **Type**: What kind of change is this?
- **Scope**: What area/module is affected?
- **Description**: One-line summary of what changed (present tense, imperative mood, <72 chars)

#### Guidelines

- **IMPORTANT**: The <branch-name> should be the name of the git current name branch.
- **IMPORTANT**: If in GIT the branch name is called 56-add-new-auth-service then <branch-name> is 56-add-new-auth-service
- The description should be in present tense, lowercase, and without a period at the end

#### Examples

- Regular commit: `feat(49-my-branch-name): add login functionality`
- Breaking change: `feat(35-other-branch-name)!: change authentication endpoints`

  `BREAKING CHANGE: The authentication endpoints now require a different payload structure`

#### Additional Guidelines & Generation Instructions

- Always Limit the first line (description) to 72 characters or less.
- Always Use the imperative mood in the description line (e.g., "add feature" not "added feature" or "adds feature").
- **Commit message template:** `<type>(<branch-name>): <description>` followed by a blank line, then the optional `<body>`.
- The Header (`<type>(<branch-name>)[!]: <description>`) is mandatory.
- The Body is optional, but encouraged for anything non-trivial.
- Always Use the body to explain _what_ and _why_ vs. _how_.
- Separate the description from the body with a blank line.
- Further paragraphs in the body come after blank lines.
- Bullet points are okay in the body:
  - Use a hyphen or asterisk for bullets.
  - Use a hanging indent if needed.

### 4. Execute Commit

```bash
# Single line
git commit -m "<type>(<branch-name>): <description>"

# Multi-line with body/footer
git commit -m "$(cat <<'EOF'
<type>(<branch-name>): <description>

<optional body>

<optional footer>
EOF
)"
```

## Best Practices

- Never commit packages/shared.diff file
- One logical change per commit
- Present tense: "add" not "added"
- Imperative mood: "fix bug" not "fixes bug"
- Reference issues: `Closes #123`, `Refs #456`
- Keep description under 72 characters

## Git Safety Protocol

- NEVER update git config
- NEVER update packages/shared submodule
- NEVER run destructive commands (--force, hard reset) without explicit request
- NEVER skip hooks (--no-verify) unless user asks
- NEVER force push to main/master
- If commit fails due to hooks, fix and create NEW commit (don't amend)
