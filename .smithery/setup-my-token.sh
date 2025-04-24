#!/bin/bash

# Script to set up GitHub Personal Access Token for authentication

# Prompt for GitHub username and token
echo "Please enter your GitHub credentials:"
read -p "GitHub Username: " USERNAME
read -sp "GitHub Personal Access Token: " TOKEN
echo ""

echo "Setting up GitHub Personal Access Token for authentication..."

# Store the credentials using git credential store
git config --global credential.helper store
echo "https://$USERNAME:$TOKEN@github.com" > ~/.git-credentials
chmod 600 ~/.git-credentials

# Also set the token as an environment variable for the current session
export GITHUB_TOKEN="$TOKEN"
echo "export GITHUB_TOKEN=\"$TOKEN\"" >> ~/.bashrc
echo "export GITHUB_TOKEN=\"$TOKEN\"" >> ~/.zshrc

echo "Credentials stored successfully!"
echo "Your GitHub token has been set up and will be used for future git operations."
echo "You should now be able to push to GitHub without entering your password."
