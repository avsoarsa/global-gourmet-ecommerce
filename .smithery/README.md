# Smithery Model Context Protocol (MCP)

This directory contains scripts and configuration for the Smithery Model Context Protocol (MCP), which automates GitHub operations.

## Setup

1. Make sure all scripts are executable:
   ```bash
   chmod +x .smithery/*.sh
   ```

2. Initialize the MCP:
   ```bash
   ./.smithery/init.sh
   ```

## Authentication Options

You have several options for authenticating with GitHub:

### Option 1: Credential Helper (Recommended)

The MCP script automatically configures Git's credential helper to cache your credentials for 1 hour. The first time you push, you'll be prompted for your username and password/token. After that, Git will remember your credentials.

### Option 2: Personal Access Token

You can set up a Personal Access Token for more secure authentication:

1. Run the setup-token script:
   ```bash
   ./.smithery/setup-token.sh
   ```

2. Follow the prompts to enter your GitHub username and token.

### Option 3: Environment Variable

You can set the `GITHUB_TOKEN` environment variable with your GitHub Personal Access Token:

```bash
export GITHUB_TOKEN=your_personal_access_token
```

The MCP will automatically use this token when pushing to GitHub.

## Usage

### Commit Changes

```bash
./.smithery/mcp.sh commit "Your commit message"
```

### Push Changes

```bash
./.smithery/mcp.sh push
```

### Commit and Push in One Step

```bash
./.smithery/mcp.sh auto "Your commit message"
```

## Configuration

The MCP configuration is stored in `.smithery/mcp.json`. You can edit this file to change the repository, branch, and other settings.
