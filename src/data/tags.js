// Sample tags data
export const tags = [
  {
    id: 1,
    name: 'Bestseller',
    slug: 'bestseller',
    color: '#FF6B6B',
    description: 'Products that are selling well',
    count: 12
  },
  {
    id: 2,
    name: 'New Arrival',
    slug: 'new-arrival',
    color: '#4ECDC4',
    description: 'Recently added products',
    count: 8
  },
  {
    id: 3,
    name: 'Sale',
    slug: 'sale',
    color: '#FFD166',
    description: 'Products on sale',
    count: 15
  },
  {
    id: 4,
    name: 'Organic',
    slug: 'organic',
    color: '#6BCB77',
    description: 'Certified organic products',
    count: 20
  },
  {
    id: 5,
    name: 'Gluten Free',
    slug: 'gluten-free',
    color: '#9D65C9',
    description: 'Products without gluten',
    count: 7
  },
  {
    id: 6,
    name: 'Vegan',
    slug: 'vegan',
    color: '#41B3A3',
    description: 'Products suitable for vegans',
    count: 10
  },
  {
    id: 7,
    name: 'Sugar Free',
    slug: 'sugar-free',
    color: '#E27D60',
    description: 'Products without added sugar',
    count: 5
  },
  {
    id: 8,
    name: 'Limited Edition',
    slug: 'limited-edition',
    color: '#C38D9E',
    description: 'Products available for a limited time',
    count: 3
  },
  {
    id: 9,
    name: 'Gift Idea',
    slug: 'gift-idea',
    color: '#E8A87C',
    description: 'Products that make great gifts',
    count: 9
  },
  {
    id: 10,
    name: 'Premium',
    slug: 'premium',
    color: '#85CDCA',
    description: 'High-quality premium products',
    count: 6
  }
];

// Function to get all tags
export const getAllTags = () => {
  return tags;
};

// Function to get a tag by ID
export const getTagById = (id) => {
  return tags.find(tag => tag.id === id);
};

// Function to get a tag by slug
export const getTagBySlug = (slug) => {
  return tags.find(tag => tag.slug === slug);
};

// Function to create a new tag (in a real app, this would be an API call)
export const createTag = (tag) => {
  const newTag = {
    ...tag,
    id: Math.max(...tags.map(t => t.id)) + 1,
    count: 0
  };
  
  tags.push(newTag);
  return newTag;
};

// Function to update a tag (in a real app, this would be an API call)
export const updateTag = (id, updatedTag) => {
  const index = tags.findIndex(tag => tag.id === id);
  
  if (index !== -1) {
    tags[index] = {
      ...tags[index],
      ...updatedTag
    };
    return tags[index];
  }
  
  return null;
};

// Function to delete a tag (in a real app, this would be an API call)
export const deleteTag = (id) => {
  const index = tags.findIndex(tag => tag.id === id);
  
  if (index !== -1) {
    const deletedTag = tags[index];
    tags.splice(index, 1);
    return deletedTag;
  }
  
  return null;
};

// Function to get product tags (in a real app, this would be from a product-tags relationship)
export const getProductTags = (productId) => {
  // This is a mock implementation
  // In a real app, you would have a product-tags relationship table
  const productTagMap = {
    1: [1, 4, 9],    // Product 1 has tags 1, 4, 9
    2: [2, 6, 10],   // Product 2 has tags 2, 6, 10
    3: [3, 5, 7],    // Product 3 has tags 3, 5, 7
    4: [1, 8],       // Product 4 has tags 1, 8
    5: [2, 4, 6],    // Product 5 has tags 2, 4, 6
    // Add more product-tag relationships as needed
  };
  
  const tagIds = productTagMap[productId] || [];
  return tagIds.map(id => getTagById(id)).filter(Boolean);
};

// Function to add a tag to a product (in a real app, this would update a relationship table)
export const addTagToProduct = (productId, tagId) => {
  // This is a mock implementation
  // In a real app, you would update a product-tags relationship table
  console.log(`Added tag ${tagId} to product ${productId}`);
  return true;
};

// Function to remove a tag from a product (in a real app, this would update a relationship table)
export const removeTagFromProduct = (productId, tagId) => {
  // This is a mock implementation
  // In a real app, you would update a product-tags relationship table
  console.log(`Removed tag ${tagId} from product ${productId}`);
  return true;
};

export default {
  getAllTags,
  getTagById,
  getTagBySlug,
  createTag,
  updateTag,
  deleteTag,
  getProductTags,
  addTagToProduct,
  removeTagFromProduct
};
