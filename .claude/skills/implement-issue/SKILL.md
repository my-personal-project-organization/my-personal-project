---
name: implement-issue
description: 'Implement the GitHub issue linked to the current branch end-to-end: read the issue (and comments) with gh, implement the fix in an isolated git worktree via the Agent tool, then push and open a PR with the pull-request skill. Use when the user says "implement the issue", "implement this issue", "work on the issue for this branch", or "/implement-issue".'
---

# Implement Issue

Turns a branch that is named after a GitHub issue into a merged-ready PR with a
single instruction. Reads the issue, does the implementation work in an isolated
worktree (so the current working tree is untouched while it runs), then pushes
and opens the PR.

## When to Use This Skill

- User says "implement the issue", "implement this issue for this branch", or types `/implement-issue`
- Current branch name encodes an issue number (e.g. `30-migrate-to-tailwind-4`,
  `feat/45-dark-mode-toggle`)
- User wants the full loop — read issue, implement, push, open PR — without
  driving each step manually

## Prerequisites

- `gh` CLI authenticated (`gh auth status`)
- Current branch name contains the issue number
- Repo is clean enough to branch from (uncommitted work on the current branch is
  fine — the worktree is a separate checkout, it won't touch it)

## Step-by-Step Workflow

### 1. Resolve the issue number from the branch

```bash
git branch --show-current
```

Extract the first run of digits from the branch name:

```bash
echo "$branch" | grep -oE '[0-9]+' | head -1
```

This covers both `<number>-<description>` and `<type>/<number>-<description>`
naming (see `.claude/rules/git-commits.md` for the convention). If no digits are
found, or more than one plausible issue number could be meant, ask the user
which issue to use — do not guess.

### 2. Read the issue

```bash
gh issue view <issue-number> --json number,title,body,state,labels,url
gh issue view <issue-number> --comments
```

- If the issue is already `CLOSED`, confirm with the user before proceeding.
- Read every comment, not just the body — issues in this repo often carry
  clarifications or known gaps in comments (see the tailwind-v4 issue #30 for
  an example: the body has the plan, the comment flags what didn't work).

### 3. Launch the implementation in an isolated worktree

Use the Agent tool with `isolation: "worktree"` so the implementation runs on a
separate checkout and never touches the user's current working tree. Run it in
the foreground (`run_in_background: false`) — pushing and opening the PR in
step 4 depend on its result.

Brief the agent like a colleague who has not seen the issue:

- Paste the full issue title, body, and comments verbatim — don't summarize
  away detail the implementer will need.
- Tell it which branch to work on: the current branch name from step 1, so
  pushing from the worktree lands on the right remote branch.
- Point it at house style: `.claude/rules/angular-conventions.md`,
  `.claude/rules/typescript.md`, `.claude/rules/testing.md`,
  `.claude/rules/nx-boundaries.md`, `.claude/rules/git-commits.md`.
- Require it to write tests alongside implementation (project convention) and
  run `npm run run-before-pr` before considering the work done.
- Require it to commit using Conventional Commits format per
  `.claude/rules/git-commits.md`.
- Ask it to report back the worktree path, branch name, and a summary of what
  it changed and validated.

### 4. Push and open the PR

Once the agent reports success:

```bash
cd <worktree-path>
git push -u origin <branch-name>
```

Then invoke the `pull-request` skill to open the PR. Give it:
- Title in Conventional Commits format (type + scope inferred from the issue and changed libs)
- Body including `Closes #<issue-number>`
- A summary of changes and how they were validated, from the agent's report

### 5. Report back and clean up

- Tell the user the PR URL.
- The worktree can be removed once its branch is pushed — the commits live on
  the remote branch regardless:
  ```bash
  git worktree remove <worktree-path>
  ```
  Skip this if the agent's result indicates it made no changes (nothing to
  clean up beyond what the Agent tool already did automatically).

## Troubleshooting

| Issue | Resolution |
|---|---|
| No digits in branch name | Ask the user for the issue number explicitly |
| Multiple numbers in branch name (e.g. a date) | Ask the user to confirm which one is the issue |
| Issue is closed | Confirm with the user before implementing |
| Branch already has an open PR | Update the existing PR instead of creating a new one (`gh pr view <branch>` first) |
| Worktree agent reports it made no changes | Don't push or open a PR — report why to the user |
| `npm run run-before-pr` fails in the worktree | Do not push; report the failure and let the user decide whether to fix or abandon |

## Quick Reference

```bash
# 1. Resolve issue number
branch=$(git branch --show-current)
issue_num=$(echo "$branch" | grep -oE '[0-9]+' | head -1)

# 2. Read issue
gh issue view "$issue_num" --comments

# 3. Agent tool, isolation: "worktree", run_in_background: false
#    (implement, test, commit — see Step 3 above)

# 4. Push from the worktree path returned by the agent
git push -u origin "$branch"

# 5. Use the pull-request skill to open the PR with "Closes #$issue_num"
```
