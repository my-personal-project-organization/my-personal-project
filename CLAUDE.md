## Approach

- Read existing files before writing. Don't re-read unless changed.
- Thorough in reasoning, concise in output.
- Skip files over 100KB unless required.
- No sycophantic openers or closing fluff.
- No emojis or em-dashes.
- Do not guess APIs, versions, flags, commit SHAs, or package names. Verify by reading code or docs before asserting.

## Coding Standards

- TypeScript strict mode enabled
- Always write tests alongside implementation
- Follow existing patterns in codebase
- Reference: see ./.claude/conventions.yaml

## Commands

### Development

- Start dev server: `npm start`
- Run Storybook: `npm run storybook`

### Testing & Validation

- Run tests: `npm test`
- Run pre-PR checks (lint, test, build, e2e): `npm run run-before-pr`
- Build Storybook: `npm run build-storybook`
- Visual regression testing: `npm run chromatic`

### Build & Deploy

- Build: `npm run build`
- Analyze bundle size: `npm run analyze-bundle`
- Build with i18n & serve: `npm run localize`
- Deploy to Firebase: `npm run deploy`

## Files to Never Edit

- dist/
- build/
- node_modules/
