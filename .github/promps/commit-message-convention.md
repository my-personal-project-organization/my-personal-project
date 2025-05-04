# Commit Message Convention

This project follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

## Format

`<type>(<branch-name>)[!]: <description>`

## Types

- **feat**: A new feature (correlates with MINOR in SemVer)
- **fix**: A bug fix (correlates with PATCH in SemVer)
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify source or test files

## Breaking Changes

Add `!` after the type/scope to indicate a breaking change (correlates with MAJOR in SemVer).

For breaking changes, include a `BREAKING CHANGE:` footer with a description of the breaking change.

## Guidelines

- IMPORTANT: The <branch-name> should be the name of the git current name branch.
- IMPORTANT: If in GIT the branch name is called 56-add-new-auth-service then <branch-name> is 56-add-new-auth-service
- The description should be in present tense, lowercase, and without a period at the end

## Examples

- Regular commit: `feat(49-my-branch-name): add login functionality`
- Breaking change: `feat(35-other-branch-name)!: change authentication endpoints`

  `BREAKING CHANGE: The authentication endpoints now require a different payload structure`

## Additional Guidelines & Generation Instructions

- Always Limit the first line (description) to 72 characters or less.
- Always Use the imperative mood in the description line (e.g., "add feature" not "added feature" or "adds feature").
- **Commit message template:** `<type>(<branch-name-refactor>): <description>` followed by a blank line, then the optional `<body>`.
- The Header (`<type>(<branch-name>)[!]: <description>`) is mandatory.
- The Body is optional, but encouraged for anything non-trivial.
- Always Use the body to explain _what_ and _why_ vs. _how_.
- Separate the description from the body with a blank line.
- Further paragraphs in the body come after blank lines.
- Bullet points are okay in the body:
  - Use a hyphen or asterisk for bullets.
  - Use a hanging indent if needed.

**Now, based on the changes provided, please generate _only_ the commit message content following the template and rules above. Ensure it includes an accurate and informative description line summarizing the key changes, and includes the required blank line between the description and the body (if a body is needed).**
