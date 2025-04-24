# Global Gourmet E-commerce

A premium e-commerce platform for dry fruits, spices, and gourmet products with a focus on user experience and conversion optimization.

## Features

- **User Authentication**: Secure login and registration with Supabase
- **Product Browsing**: Browse products by category with filtering and sorting
- **Shopping Cart**: Add products to cart, adjust quantities, and checkout
- **User Profiles**: Save and manage user information and preferences
- **Wishlist**: Save products for later purchase
- **Gift Boxes**: Create custom gift boxes with selected products
- **Responsive Design**: Optimized for desktop and mobile devices

## Technology Stack

- **Frontend**: React with Vite, TailwindCSS
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Deployment**: Vercel

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
4. Open [http://localhost:5173](http://localhost:5173) in your browser
