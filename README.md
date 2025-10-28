# Global Gourmet E-commerce

A premium e-commerce platform for dry fruits, spices, and gourmet products with a focus on user experience and conversion optimization.

## Features

- **Static Data Experience**: All pages are powered by rich mock data so you can explore the full UI without any backend.
- **Product Browsing**: Browse products by category with filtering, sorting, and personalized recommendations.
- **Shopping Journey**: Add items to the cart, walk through checkout, and view confirmation screens with simulated payments.
- **Account Tools**: Manage profile details, wishlist items, loyalty rewards, and subscriptions.
- **Gift Boxes**: Create bespoke gift boxes with curated gourmet selections.
- **Responsive Design**: Tailored layouts for desktop, tablet, and mobile devices.

## Technology Stack

- **Framework**: Next.js (App Router) with React 18
- **Styling**: Tailwind CSS
- **State & Data**: Context providers backed by local mock data
- **Tooling**: ESLint, Jest (configuration retained)

## Development

This project uses Smithery MCP (Model Context Protocol) for automated GitHub operations. To use it:

```bash
# Commit changes
.smithery/mcp.sh commit "Your commit message"

# Push changes
.smithery/mcp.sh push

# Commit and push in one step
.smithery/mcp.sh auto "Your commit message"
```

## Getting Started

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Start the development server: `pnpm dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser
