// Sample recipes data
export const recipes = [
  {
    id: 1,
    title: "Almond Date Energy Balls",
    description: "Healthy energy balls made with almonds and dates - perfect for a quick snack.",
    ingredients: [
      "1 cup Medjool dates, pitted",
      "1/2 cup almonds",
      "1/4 cup shredded coconut",
      "1 tablespoon chia seeds",
      "1 teaspoon vanilla extract",
      "Pinch of salt"
    ],
    instructions: [
      "Add almonds to a food processor and process until finely chopped.",
      "Add dates, coconut, chia seeds, vanilla, and salt. Process until mixture sticks together.",
      "Roll into 1-inch balls and refrigerate for at least 30 minutes.",
      "Store in an airtight container in the refrigerator for up to 2 weeks."
    ],
    prepTime: "15 minutes",
    difficulty: "Easy",
    servings: 12,
    image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    relatedProductIds: [1, 5, 12] // Almonds, Dates, Coconut
  },
  {
    id: 2,
    title: "Cashew Curry",
    description: "A rich and creamy curry featuring cashews as the star ingredient.",
    ingredients: [
      "1 cup raw cashews",
      "2 tablespoons vegetable oil",
      "1 onion, finely chopped",
      "2 cloves garlic, minced",
      "1 tablespoon curry powder",
      "1 teaspoon turmeric",
      "1 can (14 oz) coconut milk",
      "1 cup vegetable broth",
      "Salt and pepper to taste",
      "Fresh cilantro for garnish"
    ],
    instructions: [
      "Soak cashews in hot water for 30 minutes, then drain.",
      "Heat oil in a large pan over medium heat. Add onion and cook until soft.",
      "Add garlic, curry powder, and turmeric. Cook for 1 minute until fragrant.",
      "Add cashews, coconut milk, and vegetable broth. Simmer for 15 minutes.",
      "Season with salt and pepper. Garnish with fresh cilantro before serving."
    ],
    prepTime: "45 minutes",
    difficulty: "Medium",
    servings: 4,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    relatedProductIds: [2, 18] // Cashews, Curry Powder
  },
  {
    id: 3,
    title: "Pistachio Crusted Salmon",
    description: "Salmon fillets with a crunchy pistachio crust - an elegant dinner option.",
    ingredients: [
      "4 salmon fillets",
      "1 cup pistachios, shelled and finely chopped",
      "2 tablespoons Dijon mustard",
      "2 tablespoons honey",
      "1 tablespoon olive oil",
      "Zest of 1 lemon",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Preheat oven to 375°F (190°C).",
      "Mix chopped pistachios with lemon zest, salt, and pepper in a shallow dish.",
      "In a small bowl, combine Dijon mustard and honey.",
      "Brush salmon fillets with the mustard-honey mixture.",
      "Press the salmon into the pistachio mixture to coat the top.",
      "Heat olive oil in an oven-safe skillet over medium-high heat.",
      "Place salmon, pistachio side up, in the skillet and cook for 2 minutes.",
      "Transfer skillet to oven and bake for 12-15 minutes until salmon is cooked through."
    ],
    prepTime: "30 minutes",
    difficulty: "Medium",
    servings: 4,
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    relatedProductIds: [7] // Pistachios
  },
  {
    id: 4,
    title: "Saffron Rice Pudding",
    description: "A luxurious dessert infused with saffron and cardamom.",
    ingredients: [
      "1/2 cup Basmati rice",
      "4 cups whole milk",
      "1/2 cup sugar",
      "1/4 teaspoon saffron threads",
      "1/4 teaspoon ground cardamom",
      "1/4 cup pistachios, chopped",
      "2 tablespoons rose water (optional)",
      "Dried rose petals for garnish (optional)"
    ],
    instructions: [
      "Rinse rice until water runs clear. Drain well.",
      "In a heavy-bottomed pot, combine rice and milk. Bring to a simmer over medium heat.",
      "Reduce heat to low and cook, stirring occasionally, for 25-30 minutes until rice is tender.",
      "Add sugar, saffron, and cardamom. Stir well and cook for another 10 minutes.",
      "Remove from heat and stir in rose water if using.",
      "Let cool slightly, then refrigerate until chilled.",
      "Serve garnished with pistachios and rose petals."
    ],
    prepTime: "45 minutes plus chilling time",
    difficulty: "Medium",
    servings: 6,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    relatedProductIds: [8, 19] // Saffron, Cardamom
  },
  {
    id: 5,
    title: "Trail Mix Energy Bars",
    description: "Homemade energy bars packed with nuts, dried fruits, and seeds.",
    ingredients: [
      "1 cup mixed nuts (almonds, walnuts, cashews)",
      "1/2 cup dried cranberries",
      "1/2 cup dried apricots, chopped",
      "1/4 cup pumpkin seeds",
      "1/4 cup sunflower seeds",
      "1/3 cup honey or maple syrup",
      "2 tablespoons nut butter",
      "1 teaspoon vanilla extract",
      "1/2 teaspoon cinnamon",
      "Pinch of salt"
    ],
    instructions: [
      "Line an 8x8 inch baking pan with parchment paper.",
      "Roughly chop the nuts and combine with dried fruits and seeds in a large bowl.",
      "In a small saucepan, warm honey and nut butter until smooth.",
      "Remove from heat and stir in vanilla, cinnamon, and salt.",
      "Pour the liquid mixture over the dry ingredients and mix thoroughly.",
      "Press the mixture firmly into the prepared pan.",
      "Refrigerate for at least 2 hours before cutting into bars.",
      "Store in an airtight container in the refrigerator."
    ],
    prepTime: "20 minutes plus chilling time",
    difficulty: "Easy",
    servings: 12,
    image: "https://images.unsplash.com/photo-1490567674467-89aa01d7cae9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    relatedProductIds: [1, 2, 3, 4, 6] // Various nuts and dried fruits
  }
];

// Get recipes for a specific product
export const getRecipesForProduct = (productId) => {
  return recipes.filter(recipe => recipe.relatedProductIds.includes(productId));
};

// Get a recipe by ID
export const getRecipeById = (recipeId) => {
  return recipes.find(recipe => recipe.id === recipeId);
};

export default {
  recipes,
  getRecipesForProduct,
  getRecipeById
};
