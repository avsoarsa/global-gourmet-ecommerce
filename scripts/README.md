# Global Gourmet Data Migration

This directory contains scripts to migrate data from the frontend mock data to the Supabase backend.

## Prerequisites

- Node.js 16+ installed
- Supabase project set up
- Supabase service key (not the anon key)

## Setup

1. Copy the `.env.example` file to `.env`:
   ```
   cp .env.example .env
   ```

2. Edit the `.env` file and add your Supabase service key:
   ```
   SUPABASE_URL=https://lxljeehmdzrvxwaqlmhf.supabase.co
   SUPABASE_SERVICE_KEY=your-service-key-here
   ```

3. Install dependencies:
   ```
   npm install
   ```

## Running the Migration

To run the migration:

```
npm run migrate
```

This will:
1. Create all necessary tables in Supabase if they don't exist
2. Migrate categories from the frontend data
3. Migrate products and their variants
4. Migrate reviews
5. Migrate gift box templates
6. Migrate subscription plans
7. Migrate users, their profiles, addresses, orders, and wishlists

## Important Notes

- The migration script uses the Supabase service key, which has full access to your database. Keep this key secure.
- The script will not delete any existing data in Supabase. It will only add or update data.
- If you run the script multiple times, it will update existing records rather than creating duplicates.
- User passwords in the mock data are stored in plain text. In a real application, passwords should be hashed.

## Troubleshooting

If you encounter any issues:

1. Check the console output for error messages
2. Verify that your Supabase service key is correct
3. Make sure your Supabase project has the necessary permissions
4. Check that the SQL script in `create_tables.sql` is compatible with your Supabase version
