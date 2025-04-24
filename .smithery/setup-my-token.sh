#!/bin/bash

# Script to automatically set up the provided GitHub Personal Access Token

# Your GitHub username and token
USERNAME="avsoarsa"
TOKEN="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"

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
