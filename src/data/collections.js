// Sample collections data
export const collections = [
  {
    id: 1,
    name: 'Summer Favorites',
    slug: 'summer-favorites',
    description: 'Our top picks for the summer season',
    image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    featured: true,
    active: true,
    productIds: [1, 3, 5, 7, 9],
    createdAt: '2023-05-15T10:00:00Z',
    updatedAt: '2023-06-01T14:30:00Z'
  },
  {
    id: 2,
    name: 'Healthy Snacks',
    slug: 'healthy-snacks',
    description: 'Nutritious and delicious snack options',
    image: 'https://images.unsplash.com/photo-1581600140682-79c8177f60b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    featured: true,
    active: true,
    productIds: [2, 4, 6, 8, 10],
    createdAt: '2023-04-10T09:15:00Z',
    updatedAt: '2023-05-20T11:45:00Z'
  },
  {
    id: 3,
    name: 'Gift Boxes',
    slug: 'gift-boxes',
    description: 'Perfect presents for any occasion',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    featured: true,
    active: true,
    productIds: [11, 12, 13, 14, 15],
    createdAt: '2023-03-05T16:20:00Z',
    updatedAt: '2023-04-15T08:30:00Z'
  },
  {
    id: 4,
    name: 'Organic Selection',
    slug: 'organic-selection',
    description: 'Our certified organic products',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    featured: false,
    active: true,
    productIds: [1, 4, 7, 10, 13],
    createdAt: '2023-02-20T13:10:00Z',
    updatedAt: '2023-03-30T09:45:00Z'
  },
  {
    id: 5,
    name: 'Bestsellers',
    slug: 'bestsellers',
    description: 'Our most popular products',
    image: 'https://images.unsplash.com/photo-1584473457493-83c0d13a2517?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    featured: true,
    active: true,
    productIds: [2, 5, 8, 11, 14],
    createdAt: '2023-01-15T11:30:00Z',
    updatedAt: '2023-02-25T15:20:00Z'
  }
];

// Function to get all collections
export const getAllCollections = () => {
  return collections;
};

// Function to get active collections
export const getActiveCollections = () => {
  return collections.filter(collection => collection.active);
};

// Function to get featured collections
export const getFeaturedCollections = () => {
  return collections.filter(collection => collection.featured && collection.active);
};

// Function to get a collection by ID
export const getCollectionById = (id) => {
  return collections.find(collection => collection.id === id);
};

// Function to get a collection by slug
export const getCollectionBySlug = (slug) => {
  return collections.find(collection => collection.slug === slug);
};

// Function to create a new collection (in a real app, this would be an API call)
export const createCollection = (collection) => {
  const newCollection = {
    ...collection,
    id: Math.max(...collections.map(c => c.id)) + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    productIds: collection.productIds || []
  };
  
  collections.push(newCollection);
  return newCollection;
};

// Function to update a collection (in a real app, this would be an API call)
export const updateCollection = (id, updatedCollection) => {
  const index = collections.findIndex(collection => collection.id === id);
  
  if (index !== -1) {
    collections[index] = {
      ...collections[index],
      ...updatedCollection,
      updatedAt: new Date().toISOString()
    };
    return collections[index];
  }
  
  return null;
};

// Function to delete a collection (in a real app, this would be an API call)
export const deleteCollection = (id) => {
  const index = collections.findIndex(collection => collection.id === id);
  
  if (index !== -1) {
    const deletedCollection = collections[index];
    collections.splice(index, 1);
    return deletedCollection;
  }
  
  return null;
};

// Function to add a product to a collection
export const addProductToCollection = (collectionId, productId) => {
  const collection = getCollectionById(collectionId);
  
  if (collection) {
    if (!collection.productIds.includes(productId)) {
      collection.productIds.push(productId);
      collection.updatedAt = new Date().toISOString();
    }
    return collection;
  }
  
  return null;
};

// Function to remove a product from a collection
export const removeProductFromCollection = (collectionId, productId) => {
  const collection = getCollectionById(collectionId);
  
  if (collection) {
    collection.productIds = collection.productIds.filter(id => id !== productId);
    collection.updatedAt = new Date().toISOString();
    return collection;
  }
  
  return null;
};

// Function to get collections for a product
export const getProductCollections = (productId) => {
  return collections.filter(collection => 
    collection.productIds.includes(productId)
  );
};

export default {
  getAllCollections,
  getActiveCollections,
  getFeaturedCollections,
  getCollectionById,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  deleteCollection,
  addProductToCollection,
  removeProductFromCollection,
  getProductCollections
};
