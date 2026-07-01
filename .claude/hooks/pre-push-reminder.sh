#!/bin/bash
# Friendly reminder before git push
# Exit code 0 = always allow (this is a soft reminder, not a gate)

json_payload=$(cat)
command=$(echo "$json_payload" | jq -r '.tool_input.command // empty' 2>/dev/null)

if [[ -z "$command" ]]; then
  exit 0
fi

# Check if this is a git push command
if [[ "$command" =~ ^git\ push ]]; then
  echo "💡 Reminder: Consider running a code review before pushing." >&2
  echo "   Run: /code-review or /code-review ultra for detailed feedback" >&2
fi

exit 0
