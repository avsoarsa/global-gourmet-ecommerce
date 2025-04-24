#!/bin/bash

# Initialize Smithery MCP
echo "Initializing Smithery MCP..."

# Create directory if it doesn't exist
mkdir -p .smithery

# Check if git is initialized
if [ ! -d .git ]; then
  echo "Initializing git repository..."
  git init
fi

# Check if remote is set
if ! git remote -v | grep -q origin; then
  echo "Setting up remote repository..."
  git remote add origin https://github.com/avsoarsa/global-gourmet-ecommerce.git
fi

# Make the script executable
chmod +x .smithery/mcp.sh

echo "Smithery MCP initialized successfully!"
