import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Supabase credentials
const supabaseUrl = 'https://lxljeehmdzrvxwaqlmhf.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'your-service-key-here';

// Initialize Supabase client with service key for admin privileges
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to read JSON files
const readJsonFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
};

// Helper function to create tables if they don't exist
const createTablesIfNotExist = async () => {
  try {
    console.log('Creating tables if they don\'t exist...');
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'create_tables.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Execute the SQL
    const { error } = await supabase.rpc('run_sql_script', { sql_script: sqlContent });
    
    if (error) {
      console.error('Error creating tables:', error);
      return false;
    }
    
    console.log('Tables created or already exist');
    return true;
  } catch (error) {
    console.error('Error creating tables:', error);
    return false;
  }
};

// Migrate categories
const migrateCategories = async () => {
  try {
    console.log('Migrating categories...');
    
    // Read categories from server data
    const productsData = readJsonFile(path.join(__dirname, '../server/data/products.json'));
    
    if (!productsData || !productsData.categories) {
      console.error('No categories found in products.json');
      return false;
    }
    
    const categories = productsData.categories;
    
    // Insert categories into Supabase
    for (const category of categories) {
      const { data, error } = await supabase
        .from('product_categories')
        .upsert({
          id: category.id,
          name: category.name,
          slug: category.name.toLowerCase().replace(/\\s+/g, '-'),
          description: '',
          image: category.image,
          is_active: true,
          display_order: category.id,
          created_at: new Date(),
          updated_at: new Date()
        }, { onConflict: 'id' });
      
      if (error) {
        console.error(`Error inserting category ${category.name}:`, error);
      } else {
        console.log(`Category ${category.name} inserted/updated successfully`);
      }
    }
    
    console.log('Categories migration completed');
    return true;
  } catch (error) {
    console.error('Error migrating categories:', error);
    return false;
  }
};

// Migrate products
const migrateProducts = async () => {
  try {
    console.log('Migrating products...');
    
    // Read products from server data
    const productsData = readJsonFile(path.join(__dirname, '../server/data/products.json'));
    
    if (!productsData || !productsData.products) {
      console.error('No products found in products.json');
      return false;
    }
    
    const products = productsData.products;
    
    // Insert products into Supabase
    for (const product of products) {
      // Find category ID
      let categoryId = null;
      if (product.category) {
        const { data: categoryData } = await supabase
          .from('product_categories')
          .select('id')
          .eq('name', product.category)
          .single();
        
        if (categoryData) {
          categoryId = categoryData.id;
        }
      }
      
      // Insert product
      const { data, error } = await supabase
        .from('products')
        .upsert({
          id: product.id,
          name: product.name,
          slug: product.name.toLowerCase().replace(/\\s+/g, '-'),
          description: product.description,
          short_description: product.description?.substring(0, 150) || '',
          price: product.price,
          compare_at_price: product.originalPrice || null,
          discount_percentage: product.discount || 0,
          hs_code: product.hsCode || null,
          origin: product.origin || null,
          nutritional_info: product.nutritionalInfo || null,
          stock_quantity: product.inStock ? 100 : 0,
          is_featured: product.featured || false,
          is_bestseller: product.isBestseller || false,
          is_organic: product.isOrganic || false,
          rating: product.rating || 0,
          review_count: product.reviews || 0,
          category_id: categoryId,
          created_at: new Date(),
          updated_at: new Date()
        }, { onConflict: 'id' });
      
      if (error) {
        console.error(`Error inserting product ${product.name}:`, error);
        continue;
      }
      
      console.log(`Product ${product.name} inserted/updated successfully`);
      
      // Insert product image
      if (product.image) {
        const { error: imageError } = await supabase
          .from('product_images')
          .upsert({
            product_id: product.id,
            image_url: product.image,
            is_primary: true,
            display_order: 1,
            created_at: new Date(),
            updated_at: new Date()
          }, { onConflict: 'product_id, image_url' });
        
        if (imageError) {
          console.error(`Error inserting image for product ${product.name}:`, imageError);
        }
      }
      
      // Insert product variants (weight options)
      if (product.weightOptions && Array.isArray(product.weightOptions)) {
        for (let i = 0; i < product.weightOptions.length; i++) {
          const variant = product.weightOptions[i];
          
          const { error: variantError } = await supabase
            .from('product_variants')
            .upsert({
              product_id: product.id,
              name: variant.weight,
              weight: variant.weight,
              price: variant.price,
              compare_at_price: variant.originalPrice || null,
              stock_quantity: variant.inStock ? 100 : 0,
              is_default: i === 0, // First variant is default
              created_at: new Date(),
              updated_at: new Date()
            }, { onConflict: 'product_id, name' });
          
          if (variantError) {
            console.error(`Error inserting variant ${variant.weight} for product ${product.name}:`, variantError);
          }
        }
      }
    }
    
    console.log('Products migration completed');
    return true;
  } catch (error) {
    console.error('Error migrating products:', error);
    return false;
  }
};

// Migrate reviews
const migrateReviews = async () => {
  try {
    console.log('Migrating reviews...');
    
    // Read reviews from server data
    const reviewsData = readJsonFile(path.join(__dirname, '../server/data/reviews.json'));
    
    if (!reviewsData || !reviewsData.reviews) {
      console.error('No reviews found in reviews.json');
      return false;
    }
    
    const reviews = reviewsData.reviews;
    
    // Insert reviews into Supabase
    for (const review of reviews) {
      const { data, error } = await supabase
        .from('product_reviews')
        .upsert({
          id: review.id,
          product_id: review.productId,
          user_id: review.userId,
          user_name: review.userName,
          user_avatar: review.userAvatar,
          rating: review.rating,
          title: review.title,
          content: review.content,
          is_verified: review.verified || false,
          helpful_count: review.helpfulCount || 0,
          created_at: new Date(review.date) || new Date(),
          updated_at: new Date()
        }, { onConflict: 'id' });
      
      if (error) {
        console.error(`Error inserting review for product ${review.productId}:`, error);
      } else {
        console.log(`Review for product ${review.productId} inserted/updated successfully`);
      }
      
      // Insert review images
      if (review.images && Array.isArray(review.images)) {
        for (let i = 0; i < review.images.length; i++) {
          const imageUrl = review.images[i];
          
          const { error: imageError } = await supabase
            .from('review_images')
            .upsert({
              review_id: review.id,
              image_url: imageUrl,
              display_order: i + 1,
              created_at: new Date(),
              updated_at: new Date()
            }, { onConflict: 'review_id, image_url' });
          
          if (imageError) {
            console.error(`Error inserting image for review ${review.id}:`, imageError);
          }
        }
      }
    }
    
    console.log('Reviews migration completed');
    return true;
  } catch (error) {
    console.error('Error migrating reviews:', error);
    return false;
  }
};

// Migrate users
const migrateUsers = async () => {
  try {
    console.log('Migrating users...');
    
    // Read users from server data
    const usersData = readJsonFile(path.join(__dirname, '../server/data/users.json'));
    
    if (!usersData || !usersData.users) {
      console.error('No users found in users.json');
      return false;
    }
    
    const users = usersData.users;
    
    // Insert users into Supabase
    for (const user of users) {
      // Skip admin user as it's already created in Supabase Auth
      if (user.role === 'admin') {
        console.log('Skipping admin user as it should be created manually in Supabase Auth');
        continue;
      }
      
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          first_name: user.firstName,
          last_name: user.lastName,
          role: user.role || 'customer'
        }
      });
      
      if (authError) {
        console.error(`Error creating user ${user.email} in Supabase Auth:`, authError);
        continue;
      }
      
      const userId = authData.user.id;
      console.log(`User ${user.email} created in Supabase Auth with ID: ${userId}`);
      
      // Insert user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: userId,
          phone: user.phone,
          birthdate: user.birthdate ? new Date(user.birthdate) : null,
          preferences: user.preferences || {},
          created_at: new Date(),
          updated_at: new Date()
        }, { onConflict: 'user_id' });
      
      if (profileError) {
        console.error(`Error inserting profile for user ${user.email}:`, profileError);
      } else {
        console.log(`Profile for user ${user.email} inserted/updated successfully`);
      }
      
      // Insert user addresses
      if (user.addresses && Array.isArray(user.addresses)) {
        for (const address of user.addresses) {
          const { error: addressError } = await supabase
            .from('addresses')
            .upsert({
              user_id: userId,
              address_type: 'both',
              is_default: address.isDefault || false,
              first_name: user.firstName,
              last_name: user.lastName,
              address_line1: address.street,
              city: address.city,
              state: address.state,
              postal_code: address.zipCode,
              country: address.country,
              phone: user.phone,
              created_at: new Date(),
              updated_at: new Date()
            }, { onConflict: 'user_id, address_line1' });
          
          if (addressError) {
            console.error(`Error inserting address for user ${user.email}:`, addressError);
          }
        }
      }
      
      // Insert orders
      if (user.orders && Array.isArray(user.orders)) {
        for (const order of user.orders) {
          const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .upsert({
              id: order.id,
              user_id: userId,
              order_number: `ORD-${order.id}`,
              status: order.status.toLowerCase(),
              subtotal: order.total * 0.9, // Approximate subtotal
              shipping_cost: order.total * 0.05, // Approximate shipping
              tax_amount: order.total * 0.05, // Approximate tax
              discount_amount: 0,
              total_amount: order.total,
              currency: 'USD',
              payment_status: 'paid',
              created_at: new Date(order.date) || new Date(),
              updated_at: new Date(),
              completed_at: order.status === 'Delivered' ? new Date() : null
            }, { onConflict: 'id' });
          
          if (orderError) {
            console.error(`Error inserting order ${order.id} for user ${user.email}:`, orderError);
            continue;
          }
          
          // Insert order items
          if (order.items && Array.isArray(order.items)) {
            for (const item of order.items) {
              const { error: itemError } = await supabase
                .from('order_items')
                .upsert({
                  order_id: order.id,
                  product_id: item.productId,
                  quantity: item.quantity,
                  price: item.price,
                  total: item.price * item.quantity,
                  created_at: new Date(),
                  updated_at: new Date()
                }, { onConflict: 'order_id, product_id' });
              
              if (itemError) {
                console.error(`Error inserting order item for order ${order.id}:`, itemError);
              }
            }
          }
        }
      }
      
      // Insert wishlist items
      if (user.wishlist && Array.isArray(user.wishlist)) {
        for (const productId of user.wishlist) {
          const { error: wishlistError } = await supabase
            .from('wishlist_items')
            .upsert({
              user_id: userId,
              product_id: productId,
              created_at: new Date(),
              updated_at: new Date()
            }, { onConflict: 'user_id, product_id' });
          
          if (wishlistError) {
            console.error(`Error inserting wishlist item for user ${user.email}:`, wishlistError);
          }
        }
      }
    }
    
    console.log('Users migration completed');
    return true;
  } catch (error) {
    console.error('Error migrating users:', error);
    return false;
  }
};

// Migrate gift boxes
const migrateGiftBoxes = async () => {
  try {
    console.log('Migrating gift boxes...');
    
    // Read gift boxes from server data
    const giftBoxesData = readJsonFile(path.join(__dirname, '../server/data/giftBoxes.json'));
    
    if (!giftBoxesData || !giftBoxesData.giftBoxes) {
      console.error('No gift boxes found in giftBoxes.json');
      return false;
    }
    
    const giftBoxes = giftBoxesData.giftBoxes;
    
    // Insert gift box templates into Supabase
    for (const giftBox of giftBoxes) {
      const { data, error } = await supabase
        .from('gift_box_templates')
        .upsert({
          id: giftBox.id,
          name: giftBox.name,
          description: giftBox.description,
          image_url: giftBox.image,
          base_price: giftBox.price,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        }, { onConflict: 'id' });
      
      if (error) {
        console.error(`Error inserting gift box template ${giftBox.name}:`, error);
      } else {
        console.log(`Gift box template ${giftBox.name} inserted/updated successfully`);
      }
    }
    
    console.log('Gift boxes migration completed');
    return true;
  } catch (error) {
    console.error('Error migrating gift boxes:', error);
    return false;
  }
};

// Migrate subscriptions
const migrateSubscriptions = async () => {
  try {
    console.log('Migrating subscription plans...');
    
    // Create default subscription plans
    const subscriptionPlans = [
      {
        id: 1,
        name: 'Weekly',
        description: 'Get your favorite products delivered every week',
        frequency: 'weekly',
        discount_percentage: 15,
        is_active: true
      },
      {
        id: 2,
        name: 'Biweekly',
        description: 'Get your favorite products delivered every two weeks',
        frequency: 'biweekly',
        discount_percentage: 12,
        is_active: true
      },
      {
        id: 3,
        name: 'Monthly',
        description: 'Get your favorite products delivered every month',
        frequency: 'monthly',
        discount_percentage: 10,
        is_active: true
      }
    ];
    
    // Insert subscription plans into Supabase
    for (const plan of subscriptionPlans) {
      const { data, error } = await supabase
        .from('subscription_plans')
        .upsert({
          id: plan.id,
          name: plan.name,
          description: plan.description,
          frequency: plan.frequency,
          discount_percentage: plan.discount_percentage,
          is_active: plan.is_active,
          created_at: new Date(),
          updated_at: new Date()
        }, { onConflict: 'id' });
      
      if (error) {
        console.error(`Error inserting subscription plan ${plan.name}:`, error);
      } else {
        console.log(`Subscription plan ${plan.name} inserted/updated successfully`);
      }
    }
    
    console.log('Subscription plans migration completed');
    return true;
  } catch (error) {
    console.error('Error migrating subscription plans:', error);
    return false;
  }
};

// Main migration function
const migrateData = async () => {
  try {
    console.log('Starting data migration to Supabase...');
    
    // Create tables if they don't exist
    const tablesCreated = await createTablesIfNotExist();
    if (!tablesCreated) {
      console.error('Failed to create tables. Migration aborted.');
      return;
    }
    
    // Migrate data in the correct order
    await migrateCategories();
    await migrateProducts();
    await migrateReviews();
    await migrateGiftBoxes();
    await migrateSubscriptions();
    await migrateUsers(); // Users should be migrated last as they depend on other data
    
    console.log('Data migration completed successfully!');
  } catch (error) {
    console.error('Error during data migration:', error);
  }
};

// Run the migration
migrateData();
