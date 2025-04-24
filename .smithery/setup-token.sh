#!/bin/bash

# Script to set up GitHub Personal Access Token for authentication

echo "Setting up GitHub Personal Access Token for authentication"
echo "--------------------------------------------------------"
echo "This script will help you set up a Personal Access Token (PAT) for GitHub authentication."
echo "This will allow you to push to GitHub without entering your password each time."
echo ""
echo "Steps:"
echo "1. You'll need to create a Personal Access Token on GitHub if you don't have one already."
echo "2. Go to https://github.com/settings/tokens and click 'Generate new token'"
echo "3. Give it a name like 'MCP Access', select the 'repo' scope, and click 'Generate token'"
echo "4. Copy the token and paste it below when prompted"
echo ""

read -p "Enter your GitHub username: " username
read -sp "Enter your GitHub Personal Access Token: " token
echo ""

# Store the credentials
git config --global credential.helper store
echo "https://$username:$token@github.com" > ~/.git-credentials
chmod 600 ~/.git-credentials

echo "Credentials stored successfully!"
echo "You should now be able to push to GitHub without entering your password."
echo ""
echo "To test, try running: .smithery/mcp.sh push"
