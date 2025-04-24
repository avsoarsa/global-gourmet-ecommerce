# Supabase Database Migration Guide

This document provides step-by-step instructions for setting up the database schema and migrating data from the frontend to Supabase.

## Prerequisites

- Access to the Supabase project dashboard
- Admin privileges to run SQL queries

## Migration Steps

Follow these steps in order to set up the database and migrate the data:

### Step 1: Create Product and Category Tables

1. Go to the Supabase dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `create_tables_step1.sql`
4. Paste into the SQL Editor and run the query
5. Verify that the tables were created by checking the Table Editor

### Step 2: Migrate Product and Category Data

1. Go to the SQL Editor
2. Copy the contents of `migrate_data_step1.sql`
3. Paste into the SQL Editor and run the query
4. Verify that the data was migrated by checking the Table Editor

### Step 3: Create User Profiles and Reviews Tables

1. Go to the SQL Editor
2. Copy the contents of `create_tables_step2.sql`
3. Paste into the SQL Editor and run the query
4. Verify that the tables were created by checking the Table Editor

### Step 4: Migrate Reviews Data

1. Go to the SQL Editor
2. Copy the contents of `migrate_data_step2.sql`
3. Paste into the SQL Editor and run the query
4. Verify that the data was migrated by checking the Table Editor

### Step 5: Create Orders and Wishlist Tables

1. Go to the SQL Editor
2. Copy the contents of `create_tables_step3.sql`
3. Paste into the SQL Editor and run the query
4. Verify that the tables were created by checking the Table Editor

### Step 6: Create Gift Boxes and Subscriptions Tables

1. Go to the SQL Editor
2. Copy the contents of `create_tables_step4.sql`
3. Paste into the SQL Editor and run the query
4. Verify that the tables were created by checking the Table Editor

### Step 7: Migrate Gift Boxes and Subscriptions Data

1. Go to the SQL Editor
2. Copy the contents of `migrate_data_step3.sql`
3. Paste into the SQL Editor and run the query
4. Verify that the data was migrated by checking the Table Editor

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
