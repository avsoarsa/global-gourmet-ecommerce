#!/bin/bash

# This script sets the GITHUB_TOKEN environment variable for the current session
# without storing the token in any files

echo "Setting up GitHub token as environment variable"
echo "----------------------------------------------"
echo "This will set the GITHUB_TOKEN environment variable for the current terminal session only."
echo "You will need to run this script again if you open a new terminal."
echo ""

# Prompt for the token
read -sp "Enter your GitHub Personal Access Token: " TOKEN
echo ""

# Set the environment variable
export GITHUB_TOKEN="$TOKEN"

echo "GITHUB_TOKEN environment variable has been set for this session."
echo "You can now use the MCP to push changes without entering your password."
echo ""
echo "To test, try running: .smithery/mcp.sh push"
