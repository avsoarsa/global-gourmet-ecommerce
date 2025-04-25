import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get Supabase credentials from environment variables or use defaults
const supabaseUrl = process.env.SUPABASE_URL || 'https://lxljeehmdzrvxwaqlmhf.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('Error: Supabase key is required. Set SUPABASE_SERVICE_KEY or SUPABASE_ANON_KEY environment variable.');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function addProducts() {
  try {
    console.log('Checking if junction table exists...');

    // Read the check_junction_table SQL file
    const junctionSqlPath = path.join(__dirname, 'check_junction_table.sql');
    const junctionSqlContent = fs.readFileSync(junctionSqlPath, 'utf8');

    // Execute the junction table SQL
    const { error: junctionError } = await supabase.rpc('exec_sql', { sql_query: junctionSqlContent });

    if (junctionError) {
      throw junctionError;
    }

    console.log('Adding categories and products to the database...');

    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'add_category_products.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', { sql_query: sqlContent });

    if (error) {
      throw error;
    }

    console.log('Successfully added categories and products to the database!');

    // Verify the products were added
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('name, slug')
      .order('created_at', { ascending: false })
      .limit(9);

    if (productsError) {
      throw productsError;
    }

    console.log('Recently added products:');
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (${product.slug})`);
    });

  } catch (error) {
    console.error('Error adding products:', error);
    process.exit(1);
  }
}

// Run the function
addProducts();
