# Simplified Database Migration Guide

This guide provides step-by-step instructions for setting up the database schema and migrating data from the frontend to Supabase.

## Step 1: Create Basic Tables

1. Go to the Supabase dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `create_basic_tables.sql`
4. Paste into the SQL Editor and run the query
5. Verify that the tables were created by checking the Table Editor

## Step 2: Fix or Recreate the Products Table (if needed)

If you encounter an error about missing columns:

1. Go to the SQL Editor
2. Copy the contents of `recreate_products_table.sql`
3. Paste into the SQL Editor and run the query
4. Verify that the products table has been recreated with the correct schema

## Step 3: Migrate Basic Data

1. Go to the SQL Editor
2. Copy the contents of `migrate_basic_data_simple.sql`
3. Paste into the SQL Editor and run the query
4. Verify that the data was migrated by checking the Table Editor

## Step 3: Create User Profiles Table

1. Go to the SQL Editor
2. Copy the contents of `create_user_profiles.sql`
3. Paste into the SQL Editor and run the query
4. Verify that the table was created by checking the Table Editor

## Step 4: Add RLS Policies (Optional)

1. Go to the SQL Editor
2. Copy the contents of `add_rls_policies.sql`
3. Paste into the SQL Editor and run the query
4. Verify that the policies were added by checking the Auth > Policies section

## Troubleshooting

If you encounter any errors during the migration process:

1. Check the error message for details about what went wrong
2. Verify that you're running the scripts in the correct order
3. Make sure you have the necessary permissions to create tables and insert data
4. If a table already exists, you may need to drop it first or modify the script to handle existing tables

## Next Steps

After completing the migration, you should:

1. Create an admin user in Supabase Auth
2. Update the frontend code to use Supabase instead of mock data
3. Test the application to ensure everything is working correctly
