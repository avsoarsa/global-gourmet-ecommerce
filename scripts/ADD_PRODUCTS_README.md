# Adding Products to the Database

This directory contains scripts to add categories and products to the Supabase database.

## Prerequisites

1. Supabase project with the database schema already set up
2. Supabase service key or anon key with appropriate permissions

## Files

- `create_exec_sql_function.sql`: Creates a stored procedure to execute SQL statements
- `check_junction_table.sql`: Checks if the product_categories_junction table exists and creates it if needed
- `add_category_products.sql`: Adds categories (whole-foods, sprouts, superfoods) and 3 products for each
- `add_products.js`: Node.js script to execute the SQL files

## Setup

1. First, you need to run the `create_exec_sql_function.sql` script in the Supabase SQL editor to create the stored procedure.

2. Create a `.env` file in the scripts directory with the following content:
   ```
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_SERVICE_KEY=your-service-key
   ```

3. Install dependencies:
   ```
   cd scripts
   npm install
   ```

## Running the Script

```
node add_products.js
```

This will:
1. Check if the product_categories_junction table exists and create it if needed
2. Add the categories if they don't exist
3. Add 3 products for each category
4. Link the products to their respective categories
5. Add images for each product

## Products Added

### Whole Foods Category
1. Organic Quinoa
2. Organic Brown Rice
3. Organic Rolled Oats

### Sprouts Category
1. Organic Broccoli Sprouts
2. Fresh Alfalfa Sprouts
3. Mung Bean Sprouts

### Superfoods Category
1. Organic Chia Seeds
2. Organic Spirulina Powder
3. Dried Goji Berries
