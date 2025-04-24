import { uploadFile, deleteFile, listFiles, getPublicUrl } from '../utils/storageUtils';

/**
 * Upload a product image
 * @param {File} file - The image file to upload
 * @returns {Promise<{success: boolean, data?: {path: string, url: string}, error?: string}>}
 */
export const uploadProductImage = async (file) => {
  return uploadFile(file, 'product-images');
};

/**
 * Upload a review image
 * @param {File} file - The image file to upload
 * @param {string} reviewId - The ID of the review
 * @returns {Promise<{success: boolean, data?: {path: string, url: string}, error?: string}>}
 */
export const uploadReviewImage = async (file, reviewId) => {
  return uploadFile(file, 'review-images', reviewId);
};

/**
 * Upload a user avatar
 * @param {File} file - The image file to upload
 * @param {string} userId - The ID of the user
 * @returns {Promise<{success: boolean, data?: {path: string, url: string}, error?: string}>}
 */
export const uploadUserAvatar = async (file, userId) => {
  return uploadFile(file, 'user-avatars', userId);
};

/**
 * Upload a gift box template image
 * @param {File} file - The image file to upload
 * @returns {Promise<{success: boolean, data?: {path: string, url: string}, error?: string}>}
 */
export const uploadGiftBoxImage = async (file) => {
  return uploadFile(file, 'gift-box-images');
};

/**
 * Upload a recipe image
 * @param {File} file - The image file to upload
 * @param {string} recipeId - The ID of the recipe (optional)
 * @returns {Promise<{success: boolean, data?: {path: string, url: string}, error?: string}>}
 */
export const uploadRecipeImage = async (file, recipeId = '') => {
  return uploadFile(file, 'recipe-images', recipeId);
};

/**
 * Upload a category image
 * @param {File} file - The image file to upload
 * @param {string} categoryId - The ID of the category (optional)
 * @returns {Promise<{success: boolean, data?: {path: string, url: string}, error?: string}>}
 */
export const uploadCategoryImage = async (file, categoryId = '') => {
  return uploadFile(file, 'category-images', categoryId);
};

/**
 * Upload a banner image
 * @param {File} file - The image file to upload
 * @param {string} location - The location of the banner (e.g., 'home', 'category') (optional)
 * @returns {Promise<{success: boolean, data?: {path: string, url: string}, error?: string}>}
 */
export const uploadBannerImage = async (file, location = '') => {
  return uploadFile(file, 'banner-images', location);
};

/**
 * Upload a blog image
 * @param {File} file - The image file to upload
 * @param {string} blogId - The ID of the blog post (optional)
 * @returns {Promise<{success: boolean, data?: {path: string, url: string}, error?: string}>}
 */
export const uploadBlogImage = async (file, blogId = '') => {
  return uploadFile(file, 'blog-images', blogId);
};

/**
 * Upload an about page image
 * @param {File} file - The image file to upload
 * @param {string} section - The section of the about page (optional)
 * @returns {Promise<{success: boolean, data?: {path: string, url: string}, error?: string}>}
 */
export const uploadAboutImage = async (file, section = '') => {
  return uploadFile(file, 'about-images', section);
};

/**
 * Delete a product image
 * @param {string} path - The file path
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteProductImage = async (path) => {
  return deleteFile(path, 'product-images');
};

/**
 * Delete a review image
 * @param {string} path - The file path
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteReviewImage = async (path) => {
  return deleteFile(path, 'review-images');
};

/**
 * Delete a user avatar
 * @param {string} path - The file path
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteUserAvatar = async (path) => {
  return deleteFile(path, 'user-avatars');
};

/**
 * Delete a gift box template image
 * @param {string} path - The file path
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteGiftBoxImage = async (path) => {
  return deleteFile(path, 'gift-box-images');
};

/**
 * Delete a recipe image
 * @param {string} path - The file path
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteRecipeImage = async (path) => {
  return deleteFile(path, 'recipe-images');
};

/**
 * Delete a category image
 * @param {string} path - The file path
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteCategoryImage = async (path) => {
  return deleteFile(path, 'category-images');
};

/**
 * Delete a banner image
 * @param {string} path - The file path
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteBannerImage = async (path) => {
  return deleteFile(path, 'banner-images');
};

/**
 * Delete a blog image
 * @param {string} path - The file path
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteBlogImage = async (path) => {
  return deleteFile(path, 'blog-images');
};

/**
 * Delete an about page image
 * @param {string} path - The file path
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteAboutImage = async (path) => {
  return deleteFile(path, 'about-images');
};

/**
 * Get a list of product images
 * @returns {Promise<{success: boolean, data?: Array<Object>, error?: string}>}
 */
export const listProductImages = async () => {
  return listFiles('product-images');
};

/**
 * Get a list of review images for a specific review
 * @param {string} reviewId - The ID of the review
 * @returns {Promise<{success: boolean, data?: Array<Object>, error?: string}>}
 */
export const listReviewImages = async (reviewId) => {
  return listFiles('review-images', reviewId);
};

/**
 * Get the public URL for a product image
 * @param {string} path - The file path
 * @returns {string} The public URL
 */
export const getProductImageUrl = (path) => {
  return getPublicUrl(path, 'product-images');
};

/**
 * Get the public URL for a review image
 * @param {string} path - The file path
 * @returns {string} The public URL
 */
export const getReviewImageUrl = (path) => {
  return getPublicUrl(path, 'review-images');
};

/**
 * Get the public URL for a user avatar
 * @param {string} path - The file path
 * @returns {string} The public URL
 */
export const getUserAvatarUrl = (path) => {
  return getPublicUrl(path, 'user-avatars');
};

/**
 * Get the public URL for a gift box template image
 * @param {string} path - The file path
 * @returns {string} The public URL
 */
export const getGiftBoxImageUrl = (path) => {
  return getPublicUrl(path, 'gift-box-images');
};

/**
 * Get the public URL for a recipe image
 * @param {string} path - The file path
 * @returns {string} The public URL
 */
export const getRecipeImageUrl = (path) => {
  return getPublicUrl(path, 'recipe-images');
};

/**
 * Get the public URL for a category image
 * @param {string} path - The file path
 * @returns {string} The public URL
 */
export const getCategoryImageUrl = (path) => {
  return getPublicUrl(path, 'category-images');
};

/**
 * Get the public URL for a banner image
 * @param {string} path - The file path
 * @returns {string} The public URL
 */
export const getBannerImageUrl = (path) => {
  return getPublicUrl(path, 'banner-images');
};

/**
 * Get the public URL for a blog image
 * @param {string} path - The file path
 * @returns {string} The public URL
 */
export const getBlogImageUrl = (path) => {
  return getPublicUrl(path, 'blog-images');
};

/**
 * Get the public URL for an about page image
 * @param {string} path - The file path
 * @returns {string} The public URL
 */
export const getAboutImageUrl = (path) => {
  return getPublicUrl(path, 'about-images');
};

export default {
  // Upload functions
  uploadProductImage,
  uploadReviewImage,
  uploadUserAvatar,
  uploadGiftBoxImage,
  uploadRecipeImage,
  uploadCategoryImage,
  uploadBannerImage,
  uploadBlogImage,
  uploadAboutImage,

  // Delete functions
  deleteProductImage,
  deleteReviewImage,
  deleteUserAvatar,
  deleteGiftBoxImage,
  deleteRecipeImage,
  deleteCategoryImage,
  deleteBannerImage,
  deleteBlogImage,
  deleteAboutImage,

  // List functions
  listProductImages,
  listReviewImages,

  // URL getter functions
  getProductImageUrl,
  getReviewImageUrl,
  getUserAvatarUrl,
  getGiftBoxImageUrl,
  getRecipeImageUrl,
  getCategoryImageUrl,
  getBannerImageUrl,
  getBlogImageUrl,
  getAboutImageUrl
};
