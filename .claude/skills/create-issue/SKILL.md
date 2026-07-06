---
name: create-issue
description: 'Turn a rough description into a well-researched GitHub issue and kick off automated implementation. Analyzes the ask against the actual codebase (not just the user''s words), writes a descriptive title and a body detailed enough for an unattended AI agent to implement, creates the issue, then posts a follow-up "@claude implement" comment to trigger `.github/workflows/claude-implement-issue.yml`. Use when the user says "create an issue for X", "file an issue about X", or "/create-issue".'
---

# Create Issue

Turns a short, informal description into an issue good enough to hand to an
unattended coding agent. This is the mirror image of the `implement-issue`
skill: that one starts from an issue and produces a PR; this one starts from
an idea and produces the issue that `implement-issue` (or the `@claude
implement` GitHub Action) will later consume. Quality control lives here,
before creation — once the trigger comment is posted, an agent starts working
against the real repo unattended.

## When to Use This Skill

- User says "create an issue for X", "file an issue about X", or types `/create-issue`
- User has a goal in mind but hasn't fully specified scope, current state, or
  acceptance criteria — that's the gap this skill fills in
- User wants the issue to immediately trigger automated implementation via
  `@claude implement`, not just sit in the backlog

## Prerequisites

- `gh` CLI authenticated (`gh auth status`)
- The description to turn into an issue (ask the user if not given inline)

## Step-by-Step Workflow

### 1. Understand the ask — don't guess

If the description is vague, spans multiple unrelated changes, or is
ambiguous about scope (e.g. "improve performance" with no target area), ask
clarifying questions with `AskUserQuestion` before doing anything else. This
issue will be implemented by an agent with no access to this conversation —
anything left ambiguous here becomes the implementer's problem later. Do not
guess versions, package names, or API shapes; verify them (step 2) instead of
asserting them.

### 2. Analyze deep — verify against the actual repo, not the skill's memory

Before drafting anything, ground the issue in the real codebase state:

- Check for existing/duplicate issues first: `gh issue list --search "<keywords>" --state all`.
  If a close match exists, tell the user and ask whether to proceed, link to
  it, or stop.
- Read the relevant code (`Read`/`Grep`/`Bash`), not just this repo's docs —
  `.claude/skills/*/SKILL.md` and `.github/prompts/*.prompt.md` files can
  contain generic template content (verified example: the `nx-migration`
  skill's compatibility tables and app names like `web-app`/`b2b` don't match
  this repo at all). Cross-check anything a skill or prompt file claims
  against the actual `package.json`, `project.json`, or source before it goes
  in the issue.
- For version/dependency claims, verify via `npm view <package> version` /
  `npm view <package>@<version> peerDependencies` rather than asserting from
  memory (see how issue #74 verified `@nx/angular@22.7.6`'s Angular peer
  range before filing).
- For larger or open-ended asks, use the `Explore` agent or a `general-purpose`
  agent to survey the affected area rather than guessing from file names.
- Note current versions/state, affected apps/libs (per
  `.claude/rules/nx-boundaries.md`), and any risk areas or non-obvious
  constraints a future implementer would otherwise rediscover the hard way.

### 3. Draft a descriptive title

Match this repo's existing issue title style — a short, direct description of
the outcome, not a Conventional Commit string (that's for the PR, not the
issue). Examples from this repo: "Migrate NX to 22.7.6", "Create a reusable
GlobalError infrastructure", "Translate static text to use Spanish and
English. Use component to switch languages".

### 4. Draft the body for an unattended implementer

Structure (see issue #74 for a worked example):

```markdown
## Goal
<what outcome this issue achieves and why>

## Instructions for implementation
<name specific skills to use if applicable, e.g. "Use the nx-migration skill">
<flag any generic/template content elsewhere in the repo that doesn't apply>

## Current state (verified)
<versions, files, behavior — confirmed by reading code/running commands, not assumed>

## Steps / approach
<concrete steps, real commands from this repo's package.json>

## Out of scope
<what NOT to touch, to prevent scope creep>

## PR
Open a PR against `main` following `.claude/rules/git-commits.md` and the
`pull-request` skill. Reference/close this issue.
```

Skip sections that don't apply rather than leaving placeholder text.

### 5. Pick labels

Check available labels first (`gh label list`) — don't invent new ones. This
repo's convention is one type label (`bug`, `enhancement`, `documentation`,
`ci/cd`, `performance`, `question`) plus one priority label (`HIGH`,
`MEDIUM`, `LOW`). If priority isn't clear from the user's request, ask rather
than guessing — priority is a judgment call the user should make, not the
implementer.

### 6. Create the issue

```bash
gh issue create --title "<title>" --body-file <tmpfile> --label "<type>" --label "<priority>"
```

Capture the returned URL — the issue number is the trailing path segment.

### 7. Post the trigger comment — as a separate comment, not in the body

```bash
gh issue comment <issue-number> --body "@claude implement"
```

This **must** be a separate comment, not part of the issue body. Read
`.github/workflows/claude-implement-issue.yml`: it triggers on
`issue_comment` events and checks `contains(github.event.comment.body,
'@claude implement')` — text in the issue body itself never fires it.

### 8. Report back

Give the user the issue URL and a one-line summary of what will happen next
(the GitHub Action will pick it up and open a PR automatically).

## Troubleshooting

| Issue | Resolution |
|---|---|
| Description too vague to draft a good issue | Ask clarifying questions before creating anything |
| A near-duplicate issue already exists | Tell the user, ask whether to proceed anyway |
| Unsure which priority label applies | Ask the user — don't guess |
| Claim from a skill/prompt file conflicts with the actual repo | Trust the repo, verify with `npm view`/`Read`/`Grep`, note the discrepancy in the issue if relevant |
| User wants the issue created but NOT auto-implemented yet | Skip step 7; tell the user they can trigger it later by commenting `@claude implement` themselves |

## Quick Reference

```bash
# 1-2. Clarify + verify — AskUserQuestion, gh issue list --search, Read/Grep/npm view

# 3-4. Draft title + body to a temp file

# 5. Labels
gh label list

# 6. Create
gh issue create --title "<title>" --body-file <tmpfile> --label "<type>" --label "<priority>"

# 7. Trigger implementation (separate comment, exact phrase)
gh issue comment <issue-number> --body "@claude implement"
```
