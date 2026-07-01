#!/bin/bash
# Hook: Monitor package.json changes and suggest updating .claude folder
# Triggered on PostToolUse when Write tool modifies package.json

json_payload=$(cat)

# Extract the file path being written
file_path=$(echo "$json_payload" | jq -r '.tool_input.file_path // empty' 2>/dev/null)

if [[ -z "$file_path" ]]; then
  exit 0
fi

# Only trigger if package.json was modified
if [[ ! "$file_path" =~ package\.json$ ]]; then
  exit 0
fi

# Extract key versions from the updated package.json using jq
nx_version=$(jq -r '.dependencies.nx // .devDependencies.nx // empty' "$file_path" 2>/dev/null | head -1)
angular_version=$(jq -r '.dependencies."@angular/core" // .devDependencies."@angular/core" // empty' "$file_path" 2>/dev/null | head -1)
typescript_version=$(jq -r '.dependencies.typescript // .devDependencies.typescript // empty' "$file_path" 2>/dev/null | head -1)
jest_version=$(jq -r '.dependencies.jest // .devDependencies.jest // empty' "$file_path" 2>/dev/null | head -1)
playwright_version=$(jq -r '.dependencies."@playwright/test" // .devDependencies."@playwright/test" // empty' "$file_path" 2>/dev/null | head -1)

if [[ -n "$nx_version" ]]; then
  echo "💾 package.json updated with new versions:" >&2
  echo "   Nx: $nx_version" >&2
  echo "   Angular: $angular_version" >&2
  echo "   TypeScript: $typescript_version" >&2
  echo "   Jest: $jest_version" >&2
  echo "   Playwright: $playwright_version" >&2
  echo "" >&2
  echo "⚠️  Reminder: Update .claude/ folder documentation:" >&2
  echo "   1. Update .claude/conventions.yaml (if it exists)" >&2
  echo "   2. Update or create .claude/versions.md" >&2
  echo "   3. Update .claude/rules/angular-conventions.md (if Angular changed)" >&2
  echo "   4. Consider creating .claude/migration-notes/vX.md for breaking changes" >&2
  echo "" >&2
  echo "   Run the nx-migration skill or ask Claude to help with updates." >&2
fi

exit 0
