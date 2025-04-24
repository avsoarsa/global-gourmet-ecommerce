# Global Gourmet E-commerce Database Setup

This directory contains SQL scripts to set up the database schema and populate it with sample data for the Global Gourmet E-commerce platform.

## Quick Start

For a quick setup, you can run the `master_script.sql` file in the Supabase SQL Editor. This script:

1. Creates all necessary tables
2. Inserts sample categories
3. Inserts sample products with variants and images
4. Inserts sample reviews
5. Inserts gift box templates
6. Inserts subscription plans
7. Enables Row Level Security (RLS) policies

## Step-by-Step Setup

If you prefer to set up the database in smaller steps, you can run the following scripts in order:

1. `1_create_tables.sql` - Creates all tables
2. `2_insert_categories.sql` - Inserts product categories
3. `3_insert_products.sql` - Inserts products, variants, and images
4. `4_insert_reviews.sql` - Inserts product reviews
5. `5_insert_gift_boxes.sql` - Inserts gift box templates
6. `6_insert_subscriptions.sql` - Inserts subscription plans
7. `7_enable_rls.sql` - Enables Row Level Security policies

## Execution Instructions

1. Log in to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy the contents of the script you want to run
4. Paste it into the SQL Editor
5. Click "Run" to execute the script
6. Verify the results in the Table Editor

## Important Notes

- The scripts use UUIDs with specific values to ensure consistent relationships between tables
- The scripts include "ON CONFLICT" clauses to handle cases where records already exist
- Row Level Security (RLS) policies are set up to control access to data based on user roles
- The sample data is designed to match what was previously shown in the frontend

## Troubleshooting

If you encounter errors:

1. **Column does not exist**: Make sure you've run the table creation script first
2. **Syntax error**: Check for special characters in text fields that might need proper escaping
3. **Foreign key constraint**: Ensure you're inserting data in the correct order (referenced tables first)
4. **Duplicate key value**: Use the ON CONFLICT clauses or drop existing tables before recreating them
