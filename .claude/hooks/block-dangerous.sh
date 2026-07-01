#!/bin/bash
# Block dangerous commands (git push --force, git reset --hard, rm -rf)
# Exit code 2 = block the command
# Exit code 0 = allow

# Read the PreToolUse JSON from stdin
json_payload=$(cat)

# Extract the command from tool_input.command
command=$(echo "$json_payload" | jq -r '.tool_input.command // empty' 2>/dev/null)

if [[ -z "$command" ]]; then
  exit 0
fi

# Check for dangerous patterns
if [[ "$command" =~ git\ push.*--force|--force-with-lease ]] || \
   [[ "$command" =~ git\ reset\ --hard ]] || \
   [[ "$command" =~ rm\ -rf ]]; then

  echo "❌ BLOCKED: Destructive command not allowed" >&2
  echo "   Command: $command" >&2
  echo "" >&2
  echo "   This command would make irreversible changes to git history or files." >&2
  echo "   To force-push, explicitly review your changes first." >&2

  exit 2
fi

exit 0
