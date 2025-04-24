#!/bin/bash

# Smithery MCP Script for GitHub Operations
# This script automates common git operations

CONFIG_FILE=".smithery/mcp.json"

# Check if config file exists
if [ ! -f "$CONFIG_FILE" ]; then
  echo "Error: MCP configuration file not found!"
  exit 1
fi

# Configure git credential helper to store credentials
git config --global credential.helper store

# Set GitHub token if not already set
if [ -z "$GITHUB_TOKEN" ]; then
  export GITHUB_TOKEN="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"
fi

# Parse config file (simplified version)
REPO=$(grep -o '"repository": *"[^"]*"' "$CONFIG_FILE" | cut -d'"' -f4)
BRANCH=$(grep -o '"branch": *"[^"]*"' "$CONFIG_FILE" | cut -d'"' -f4)
AUTO_COMMIT=$(grep -o '"autoCommit": *[^,}]*' "$CONFIG_FILE" | cut -d':' -f2 | tr -d ' ')
AUTO_PUSH=$(grep -o '"autoPush": *[^,}]*' "$CONFIG_FILE" | cut -d':' -f2 | tr -d ' ')

# Function to commit changes
commit_changes() {
  local message="$1"

  # Check if there are changes to commit
  if [ -z "$(git status --porcelain)" ]; then
    echo "No changes to commit"
    return 0
  fi

  # Add all changes
  git add .

  # Commit with message
  git commit -m "[MCP] $message"

  echo "Changes committed successfully"
  return 0
}

# Function to push changes
push_changes() {
  echo "Using token authentication for GitHub"

  # Always use the token for authentication
  git push https://x-access-token:${GITHUB_TOKEN}@github.com/${REPO}.git "$BRANCH"

  echo "Changes pushed to $REPO:$BRANCH"
  return 0
}

# Main function
main() {
  local command="$1"
  shift

  case "$command" in
    "commit")
      commit_changes "$1"
      ;;
    "push")
      push_changes
      ;;
    "auto")
      if [ "$AUTO_COMMIT" = "true" ]; then
        commit_changes "$1"
        if [ "$AUTO_PUSH" = "true" ]; then
          push_changes
        fi
      fi
      ;;
    *)
      echo "Usage: mcp.sh [commit|push|auto] [message]"
      exit 1
      ;;
  esac
}

# Run main function
main "$@"
