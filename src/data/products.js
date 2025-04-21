export const products = [
  // Helper function to calculate prices for different weights
  // This would normally be on the server side
  ...(function() {
    const calculatePriceForWeight = (basePrice, weight) => {
      const weightMultipliers = {
        '250g': 0.5,
        '500g': 1.0,
        '1kg': 1.9,
        '5kg': 8.5
      };
      return parseFloat((basePrice * weightMultipliers[weight]).toFixed(2));
    };

    return [];  // This is just to make the IIFE work with the spread operator
  })(),
  // Dry Fruits
  {
    id: 1,
    name: "Premium Medjool Dates",
    category: "Dry Fruits",
    price: 12.99,  // Base price for 500g
    originalPrice: 15.99, // Original MRP for 500g
    discount: 19, // Discount percentage
    hsCode: "0804.10.20", // HS code for dates
    image: "https://images.unsplash.com/photo-1593904308074-e1a3f1f0a673?q=80&w=1000&auto=format&fit=crop",
    description: "Soft, sweet and delicious Medjool dates sourced from the finest date farms. Rich in fiber and essential nutrients.",
    origin: "Jordan",
    nutritionalInfo: "Rich in fiber, potassium, and antioxidants",
    rating: 4.8,
    reviews: 124,
    inStock: true,
    featured: true,
    weightOptions: [
      { weight: '250g', price: 6.49, originalPrice: 7.99, inStock: true },
      { weight: '500g', price: 12.99, originalPrice: 15.99, inStock: true },
      { weight: '1kg', price: 24.69, originalPrice: 29.99, inStock: true },
      { weight: '5kg', price: 110.42, originalPrice: 134.99, inStock: false }
    ],
    defaultWeight: '500g'
  },
  {
    id: 2,
    name: "Organic Turkish Apricots",
    category: "Dry Fruits",
    price: 9.99,  // Base price for 500g
    image: "https://images.unsplash.com/photo-1597371424128-8ffb9cb8cb36?q=80&w=1000&auto=format&fit=crop",
    description: "Naturally dried Turkish apricots with no added sugar or preservatives. Sweet, tangy and packed with nutrients.",
    origin: "Turkey",
    nutritionalInfo: "High in vitamin A, potassium, and iron",
    rating: 4.6,
    reviews: 89,
    inStock: true,
    featured: false,
    weightOptions: [
      { weight: '250g', price: 4.99, inStock: true },
      { weight: '500g', price: 9.99, inStock: true },
      { weight: '1kg', price: 18.99, inStock: true },
      { weight: '5kg', price: 84.99, inStock: true }
    ],
    defaultWeight: '500g'
  },
  {
    id: 3,
    name: "Golden Raisins",
    category: "Dry Fruits",
    price: 7.99,  // Base price for 500g
    originalPrice: 9.99,
    discount: 20,
    hsCode: "0806.20.10", // HS code for raisins
    image: "https://images.unsplash.com/photo-1596273312170-8f17f4cc9980?q=80&w=1000&auto=format&fit=crop",
    description: "Sweet and juicy golden raisins made from the finest green grapes. Perfect for baking, cooking, or snacking.",
    origin: "California, USA",
    nutritionalInfo: "Good source of fiber, iron, and antioxidants",
    rating: 4.5,
    reviews: 76,
    inStock: true,
    featured: false,
    weightOptions: [
      { weight: '250g', price: 3.99, originalPrice: 4.99, inStock: true },
      { weight: '500g', price: 7.99, originalPrice: 9.99, inStock: true },
      { weight: '1kg', price: 15.49, originalPrice: 18.99, inStock: true },
      { weight: '5kg', price: 69.99, originalPrice: 84.99, inStock: true }
    ],
    defaultWeight: '500g'
  },

  // Nuts & Seeds
  {
    id: 4,
    name: "Georgia Pecan Nuts",
    category: "Nuts & Seeds",
    price: 18.99,  // Base price for 500g
    originalPrice: 23.99, // Original MRP for 500g
    discount: 21, // Discount percentage
    hsCode: "0802.90.10", // HS code for pecans
    image: "https://images.unsplash.com/photo-1573851552153-816785fecb1f?q=80&w=1000&auto=format&fit=crop",
    description: "Premium quality pecan nuts from Georgia. Rich, buttery flavor perfect for snacking or baking.",
    origin: "Georgia, USA",
    nutritionalInfo: "High in healthy fats, protein, and antioxidants",
    rating: 4.9,
    reviews: 112,
    inStock: true,
    featured: true,
    weightOptions: [
      { weight: '250g', price: 9.49, originalPrice: 11.99, inStock: true },
      { weight: '500g', price: 18.99, originalPrice: 23.99, inStock: true },
      { weight: '1kg', price: 35.99, originalPrice: 45.99, inStock: true },
      { weight: '5kg', price: 159.99, originalPrice: 199.99, inStock: true }
    ],
    defaultWeight: '500g'
  },
  {
    id: 5,
    name: "Raw Cashews",
    category: "Nuts & Seeds",
    price: 14.99,  // Base price for 500g
    originalPrice: 17.99, // Original MRP for 500g
    discount: 17, // Discount percentage
    hsCode: "0801.32.00", // HS code for cashews
    image: "https://images.unsplash.com/photo-1563412885-139e4045ebc3?q=80&w=1000&auto=format&fit=crop",
    description: "Creamy, delicious raw cashews. Versatile for snacking, cooking, or making homemade cashew milk.",
    origin: "Vietnam",
    nutritionalInfo: "Good source of protein, healthy fats, and minerals",
    rating: 4.7,
    reviews: 95,
    inStock: true,
    featured: true,
    weightOptions: [
      { weight: '250g', price: 7.49, originalPrice: 8.99, inStock: true },
      { weight: '500g', price: 14.99, originalPrice: 17.99, inStock: true },
      { weight: '1kg', price: 28.49, originalPrice: 33.99, inStock: true },
      { weight: '5kg', price: 127.42, originalPrice: 149.99, inStock: true }
    ],
    defaultWeight: '500g'
  },
  {
    id: 6,
    name: "Organic Chia Seeds",
    category: "Nuts & Seeds",
    price: 8.99,  // Base price for 500g
    originalPrice: 10.99,
    discount: 18,
    hsCode: "1207.99.03", // HS code for chia seeds
    image: "https://images.unsplash.com/photo-1541990202460-a0a91a4d1fe1?q=80&w=1000&auto=format&fit=crop",
    description: "Nutrient-dense chia seeds that are perfect for adding to smoothies, yogurt, or baking.",
    origin: "Mexico",
    nutritionalInfo: "Rich in omega-3 fatty acids, fiber, and protein",
    rating: 4.6,
    reviews: 83,
    inStock: true,
    featured: false,
    weightOptions: [
      { weight: '250g', price: 4.49, originalPrice: 5.49, inStock: true },
      { weight: '500g', price: 8.99, originalPrice: 10.99, inStock: true },
      { weight: '1kg', price: 16.99, originalPrice: 20.99, inStock: true },
      { weight: '5kg', price: 79.99, originalPrice: 94.99, inStock: true }
    ],
    defaultWeight: '500g'
  },

  // Spices
  {
    id: 7,
    name: "Kashmiri Saffron",
    category: "Spices",
    price: 29.99,  // Base price for 5g
    originalPrice: 34.99,
    discount: 14,
    hsCode: "0910.20.00", // HS code for saffron
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1000&auto=format&fit=crop",
    description: "Premium Kashmiri saffron threads known for their distinct aroma, flavor, and vibrant color.",
    origin: "Kashmir, India",
    nutritionalInfo: "Contains antioxidants and mood-enhancing properties",
    rating: 4.9,
    reviews: 67,
    inStock: true,
    featured: true,
    weightOptions: [
      { weight: '1g', price: 5.99, originalPrice: 6.99, inStock: true },
      { weight: '5g', price: 29.99, originalPrice: 34.99, inStock: true },
      { weight: '10g', price: 57.99, originalPrice: 67.99, inStock: true },
      { weight: '25g', price: 139.99, originalPrice: 159.99, inStock: true }
    ],
    defaultWeight: '5g'
  },
  {
    id: 8,
    name: "Ceylon Cinnamon Sticks",
    category: "Spices",
    price: 11.99,  // Base price for 100g
    originalPrice: 13.99,
    discount: 14,
    hsCode: "0906.11.00", // HS code for cinnamon
    image: "https://images.unsplash.com/photo-1608057891470-11447fb5967e?q=80&w=1000&auto=format&fit=crop",
    description: "True Ceylon cinnamon sticks with a delicate, sweet flavor. Perfect for teas, desserts, and curries.",
    origin: "Sri Lanka",
    nutritionalInfo: "Contains anti-inflammatory properties and antioxidants",
    rating: 4.7,
    reviews: 54,
    inStock: true,
    featured: false,
    weightOptions: [
      { weight: '50g', price: 5.99, originalPrice: 6.99, inStock: true },
      { weight: '100g', price: 11.99, originalPrice: 13.99, inStock: true },
      { weight: '250g', price: 28.99, originalPrice: 33.99, inStock: true },
      { weight: '500g', price: 54.99, originalPrice: 64.99, inStock: true }
    ],
    defaultWeight: '100g'
  },
  {
    id: 9,
    name: "Organic Turmeric Powder",
    category: "Spices",
    price: 9.99,  // Base price for 100g
    originalPrice: 11.99,
    discount: 17,
    hsCode: "0910.30.00", // HS code for turmeric
    image: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?q=80&w=1000&auto=format&fit=crop",
    description: "Vibrant, aromatic turmeric powder with high curcumin content. Essential for curries and golden milk.",
    origin: "India",
    nutritionalInfo: "High in curcumin with anti-inflammatory properties",
    rating: 4.8,
    reviews: 102,
    inStock: true,
    featured: false,
    weightOptions: [
      { weight: '50g', price: 4.99, originalPrice: 5.99, inStock: true },
      { weight: '100g', price: 9.99, originalPrice: 11.99, inStock: true },
      { weight: '250g', price: 23.99, originalPrice: 28.99, inStock: true },
      { weight: '500g', price: 44.99, originalPrice: 54.99, inStock: true }
    ],
    defaultWeight: '100g'
  },

  // Whole Foods
  {
    id: 10,
    name: "Minnesota Wild Rice",
    category: "Whole Foods",
    price: 14.99,  // Base price for 500g
    originalPrice: 17.99,
    discount: 17,
    hsCode: "1006.40.00", // HS code for wild rice
    image: "https://images.unsplash.com/photo-1586201375761-83865001e8ac?q=80&w=1000&auto=format&fit=crop",
    description: "Hand-harvested wild rice from Minnesota lakes. Nutty flavor and chewy texture.",
    origin: "Minnesota, USA",
    nutritionalInfo: "High in protein, fiber, and B vitamins",
    rating: 4.7,
    reviews: 48,
    inStock: true,
    featured: true,
    weightOptions: [
      { weight: '250g', price: 7.49, originalPrice: 8.99, inStock: true },
      { weight: '500g', price: 14.99, originalPrice: 17.99, inStock: true },
      { weight: '1kg', price: 28.99, originalPrice: 34.99, inStock: true },
      { weight: '5kg', price: 139.99, originalPrice: 169.99, inStock: true }
    ],
    defaultWeight: '500g'
  },
  {
    id: 11,
    name: "Organic Quinoa",
    category: "Whole Foods",
    price: 10.99,  // Base price for 500g
    originalPrice: 12.99,
    discount: 15,
    hsCode: "1008.50.00", // HS code for quinoa
    image: "https://images.unsplash.com/photo-1612358405970-e1adb2bfb6f3?q=80&w=1000&auto=format&fit=crop",
    description: "Versatile, protein-rich quinoa. Perfect base for salads, bowls, or as a side dish.",
    origin: "Peru",
    nutritionalInfo: "Complete protein with all essential amino acids",
    rating: 4.6,
    reviews: 73,
    inStock: true,
    featured: false,
    weightOptions: [
      { weight: '250g', price: 5.49, originalPrice: 6.49, inStock: true },
      { weight: '500g', price: 10.99, originalPrice: 12.99, inStock: true },
      { weight: '1kg', price: 20.99, originalPrice: 24.99, inStock: true },
      { weight: '5kg', price: 99.99, originalPrice: 119.99, inStock: true }
    ],
    defaultWeight: '500g'
  },
  {
    id: 12,
    name: "Pure Canadian Maple Syrup",
    category: "Whole Foods",
    price: 24.99,  // Base price for 250ml
    originalPrice: 29.99,
    discount: 17,
    hsCode: "1702.20.00", // HS code for maple syrup
    image: "https://images.unsplash.com/photo-1589418435338-51a8c38dcc5f?q=80&w=1000&auto=format&fit=crop",
    description: "Authentic Grade A maple syrup from Quebec. Rich, amber color with robust flavor.",
    origin: "Quebec, Canada",
    nutritionalInfo: "Contains antioxidants and essential minerals",
    rating: 4.9,
    reviews: 86,
    inStock: true,
    featured: true,
    weightOptions: [
      { weight: '100ml', price: 9.99, originalPrice: 11.99, inStock: true },
      { weight: '250ml', price: 24.99, originalPrice: 29.99, inStock: true },
      { weight: '500ml', price: 47.99, originalPrice: 57.99, inStock: true },
      { weight: '1L', price: 89.99, originalPrice: 109.99, inStock: true }
    ],
    defaultWeight: '250ml'
  },

  // Sprouts
  {
    id: 13,
    name: "Organic Mung Bean Sprouts",
    category: "Sprouts",
    price: 6.99,  // Base price for 250g
    originalPrice: 8.49,
    discount: 18,
    hsCode: "0708.90.00", // HS code for sprouts
    image: "https://images.unsplash.com/photo-1576486969744-7fe7c8b6ad6a?q=80&w=1000&auto=format&fit=crop",
    description: "Fresh, crisp mung bean sprouts. Ready to add to stir-fries, salads, or sandwiches.",
    origin: "USA",
    nutritionalInfo: "Low in calories, high in protein and vitamin C",
    rating: 4.5,
    reviews: 42,
    inStock: true,
    featured: false,
    weightOptions: [
      { weight: '100g', price: 2.99, originalPrice: 3.49, inStock: true },
      { weight: '250g', price: 6.99, originalPrice: 8.49, inStock: true },
      { weight: '500g', price: 12.99, originalPrice: 15.99, inStock: true },
      { weight: '1kg', price: 24.99, originalPrice: 29.99, inStock: true }
    ],
    defaultWeight: '250g'
  },
  {
    id: 14,
    name: "Alfalfa Sprouts",
    category: "Sprouts",
    price: 5.99,  // Base price for 250g
    originalPrice: 7.49,
    discount: 20,
    hsCode: "0708.90.00", // HS code for sprouts
    image: "https://images.unsplash.com/photo-1550828484-a8e73ece4e7c?q=80&w=1000&auto=format&fit=crop",
    description: "Delicate, nutty alfalfa sprouts. Perfect for sandwiches, wraps, and salads.",
    origin: "USA",
    nutritionalInfo: "Rich in vitamins A, C, K, and folate",
    rating: 4.4,
    reviews: 38,
    inStock: true,
    featured: false,
    weightOptions: [
      { weight: '100g', price: 2.49, originalPrice: 2.99, inStock: true },
      { weight: '250g', price: 5.99, originalPrice: 7.49, inStock: true },
      { weight: '500g', price: 11.49, originalPrice: 13.99, inStock: true },
      { weight: '1kg', price: 21.99, originalPrice: 26.99, inStock: true }
    ],
    defaultWeight: '250g'
  },

  // Dried Fruits
  {
    id: 17,
    name: "Sun-Dried Cranberries",
    category: "Dried Fruits",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1597371424128-8ffb9cb8cb36?q=80&w=1000&auto=format&fit=crop",
    description: "Naturally sweetened dried cranberries. Perfect for baking, salads, or snacking.",
    origin: "United States",
    nutritionalInfo: "Rich in antioxidants and vitamin C",
    rating: 4.7,
    reviews: 42,
    inStock: true,
    featured: true,
    weightOptions: [
      { weight: '250g', price: 4.49, inStock: true },
      { weight: '500g', price: 8.99, inStock: true },
      { weight: '1kg', price: 16.99, inStock: true },
      { weight: '5kg', price: 79.99, inStock: true }
    ],
    defaultWeight: '500g'
  },
  {
    id: 18,
    name: "Dried Mango Slices",
    category: "Dried Fruits",
    price: 10.99,
    originalPrice: 13.99,
    discount: 21,
    image: "https://images.unsplash.com/photo-1596273312170-8f17f4cc9980?q=80&w=1000&auto=format&fit=crop",
    description: "Sweet and tangy dried mango slices with no added sugar. A tropical treat.",
    origin: "Philippines",
    nutritionalInfo: "Good source of vitamin A and fiber",
    rating: 4.8,
    reviews: 63,
    inStock: true,
    featured: true,
    weightOptions: [
      { weight: '250g', price: 5.49, originalPrice: 6.99, inStock: true },
      { weight: '500g', price: 10.99, originalPrice: 13.99, inStock: true },
      { weight: '1kg', price: 20.99, originalPrice: 26.99, inStock: true },
      { weight: '5kg', price: 99.99, originalPrice: 119.99, inStock: true }
    ],
    defaultWeight: '500g'
  },
  {
    id: 19,
    name: "Dried Blueberries",
    category: "Dried Fruits",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?q=80&w=1000&auto=format&fit=crop",
    description: "Naturally dried blueberries that retain their sweet flavor and nutritional benefits.",
    origin: "Canada",
    nutritionalInfo: "High in antioxidants and vitamin K",
    rating: 4.6,
    reviews: 38,
    inStock: true,
    featured: true,
    weightOptions: [
      { weight: '250g', price: 6.49, inStock: true },
      { weight: '500g', price: 12.99, inStock: true },
      { weight: '1kg', price: 24.99, inStock: true },
      { weight: '5kg', price: 119.99, inStock: false }
    ],
    defaultWeight: '500g'
  },
  // Superfoods
  {
    id: 15,
    name: "Organic Spirulina Powder",
    category: "Superfoods",
    price: 19.99,  // Base price for 100g
    originalPrice: 24.99,
    discount: 20,
    hsCode: "2102.90.00", // HS code for spirulina
    image: "https://images.unsplash.com/photo-1622485482481-5c1c9e748823?q=80&w=1000&auto=format&fit=crop",
    description: "Nutrient-dense blue-green algae. Add to smoothies, juices, or energy balls.",
    origin: "Hawaii, USA",
    nutritionalInfo: "Complete protein with essential amino acids and B vitamins",
    rating: 4.6,
    reviews: 57,
    inStock: true,
    featured: false,
    weightOptions: [
      { weight: '50g', price: 9.99, originalPrice: 12.49, inStock: true },
      { weight: '100g', price: 19.99, originalPrice: 24.99, inStock: true },
      { weight: '250g', price: 47.99, originalPrice: 59.99, inStock: true },
      { weight: '500g', price: 89.99, originalPrice: 109.99, inStock: true }
    ],
    defaultWeight: '100g'
  },
  {
    id: 16,
    name: "Organic Maca Powder",
    category: "Superfoods",
    price: 16.99,  // Base price for 100g
    originalPrice: 19.99,
    discount: 15,
    hsCode: "1106.20.90", // HS code for maca powder
    image: "https://images.unsplash.com/photo-1602523961358-f9f03dd557db?q=80&w=1000&auto=format&fit=crop",
    description: "Adaptogenic maca root powder from the Peruvian Andes. Malty flavor for smoothies and baking.",
    origin: "Peru",
    nutritionalInfo: "Contains minerals, vitamins, and adaptogenic compounds",
    rating: 4.7,
    reviews: 63,
    inStock: true,
    featured: false,
    weightOptions: [
      { weight: '50g', price: 8.49, originalPrice: 9.99, inStock: true },
      { weight: '100g', price: 16.99, originalPrice: 19.99, inStock: true },
      { weight: '250g', price: 39.99, originalPrice: 47.99, inStock: true },
      { weight: '500g', price: 74.99, originalPrice: 89.99, inStock: true }
    ],
    defaultWeight: '100g'
  }
];

export const categories = [
  {
    id: 1,
    name: "All Products",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Dry Fruits",
    image: "https://images.unsplash.com/photo-1596273312170-8f17f4cc9980?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 8,
    name: "Dried Fruits",
    image: "https://images.unsplash.com/photo-1597371424128-8ffb9cb8cb36?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Nuts & Seeds",
    image: "https://images.unsplash.com/photo-1563412885-139e4045ebc3?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Spices",
    image: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Whole Foods",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e8ac?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 6,
    name: "Sprouts",
    image: "https://images.unsplash.com/photo-1576486969744-7fe7c8b6ad6a?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 7,
    name: "Superfoods",
    image: "https://images.unsplash.com/photo-1622485482481-5c1c9e748823?q=80&w=1000&auto=format&fit=crop"
  }
];

export const giftBoxes = [
  {
    id: 1,
    name: "Gourmet Delight Box",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1607897441350-dc0d9c061a6f?q=80&w=1000&auto=format&fit=crop",
    description: "A carefully curated selection of our finest dry fruits and spices, perfect for gifting.",
    contents: ["Premium Medjool Dates", "Georgia Pecan Nuts", "Kashmiri Saffron", "Ceylon Cinnamon Sticks", "Raw Cashews"],
    label: "BESTSELLER"
  },
  {
    id: 2,
    name: "Wellness Package",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1607897441350-dc0d9c061a6f?q=80&w=1000&auto=format&fit=crop",
    description: "Organic superfoods and sprouts for health-conscious individuals.",
    contents: ["Organic Spirulina Powder", "Organic Maca Powder", "Organic Chia Seeds", "Organic Mung Bean Sprouts", "Organic Turmeric Powder"],
    label: "ORGANIC"
  },
  {
    id: 3,
    name: "Corporate Gift Hamper",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1607897441350-dc0d9c061a6f?q=80&w=1000&auto=format&fit=crop",
    description: "Premium selection for corporate gifting with customizable branding options.",
    contents: ["Pure Canadian Maple Syrup", "Georgia Pecan Nuts", "Kashmiri Saffron", "Premium Medjool Dates", "Raw Cashews", "Ceylon Cinnamon Sticks"],
    label: "PREMIUM"
  },
  {
    id: 4,
    name: "Festive Celebration Box",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=1000&auto=format&fit=crop",
    description: "A luxurious assortment of premium nuts and dried fruits perfect for holiday celebrations and special occasions.",
    contents: ["Premium Medjool Dates", "Raw Cashews", "Georgia Pecan Nuts", "Organic Turkish Apricots", "Golden Raisins", "Organic Chia Seeds"],
    label: "LIMITED EDITION"
  },
  {
    id: 5,
    name: "Spice Enthusiast Collection",
    price: 54.99,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1000&auto=format&fit=crop",
    description: "A carefully selected assortment of premium spices from around the world for the culinary adventurer.",
    contents: ["Kashmiri Saffron", "Ceylon Cinnamon Sticks", "Organic Turmeric Powder", "Cardamom Pods", "Whole Cloves", "Star Anise"],
    label: "CHEF'S CHOICE"
  },
  {
    id: 6,
    name: "Breakfast Essentials Box",
    price: 45.99,
    image: "https://images.unsplash.com/photo-1589418435338-51a8c38dcc5f?q=80&w=1000&auto=format&fit=crop",
    description: "Start your day right with this collection of premium breakfast ingredients and superfoods.",
    contents: ["Pure Canadian Maple Syrup", "Organic Quinoa", "Organic Chia Seeds", "Organic Maca Powder", "Golden Raisins"],
    label: "MORNING BOOST"
  },
  {
    id: 7,
    name: "Nut Lover's Dream",
    price: 64.99,
    image: "https://images.unsplash.com/photo-1563412885-139e4045ebc3?q=80&w=1000&auto=format&fit=crop",
    description: "A premium selection of the world's finest nuts, perfect for snacking or cooking.",
    contents: ["Georgia Pecan Nuts", "Raw Cashews", "Organic Almonds", "Macadamia Nuts", "Pistachios", "Hazelnuts"],
    label: "PROTEIN RICH"
  },
  {
    id: 8,
    name: "Superfood Starter Kit",
    price: 74.99,
    image: "https://images.unsplash.com/photo-1622485482481-5c1c9e748823?q=80&w=1000&auto=format&fit=crop",
    description: "Boost your nutrition with this collection of powerful superfoods from around the world.",
    contents: ["Organic Spirulina Powder", "Organic Maca Powder", "Organic Chia Seeds", "Organic Turmeric Powder", "Goji Berries", "Hemp Seeds"],
    label: "NUTRIENT DENSE"
  },
  {
    id: 9,
    name: "Exotic Tastes Box",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1608057891470-11447fb5967e?q=80&w=1000&auto=format&fit=crop",
    description: "Experience unique flavors from around the world with this carefully curated collection of exotic ingredients.",
    contents: ["Kashmiri Saffron", "Dragon Fruit Chips", "Black Garlic", "Dried Persimmons", "Sumac", "Dried Kaffir Lime Leaves"],
    label: "GLOBAL FLAVORS"
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Health Food Store Owner",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    text: "The quality of almonds I received was exceptional. They're now my regular supplier for my health food store."
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Corporate Client",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    text: "Their corporate gift hampers were a hit with our clients. The packaging was elegant and the products premium quality."
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Restaurant Owner",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    text: "As a restaurant owner, I appreciate their consistent quality and reliable bulk delivery service for my kitchen needs."
  }
];
