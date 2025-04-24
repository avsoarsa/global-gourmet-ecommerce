import { supabase } from './supabaseClient';

/**
 * Upload a file to Supabase Storage
 * @param {File} file - The file to upload
 * @param {string} bucket - The storage bucket name
 * @param {string} path - The path within the bucket (optional)
 * @returns {Promise<{success: boolean, data?: {path: string, url: string}, error?: string}>}
 */
export const uploadFile = async (file, bucket, path = '') => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // Generate a unique file name to avoid collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    // Construct the full path
    const fullPath = path ? `${path}/${fileName}` : fileName;

    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fullPath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      success: true,
      data: {
        path: data.path,
        url: publicUrl
      }
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload file'
    };
  }
};

/**
 * Delete a file from Supabase Storage
 * @param {string} path - The file path
 * @param {string} bucket - The storage bucket name
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteFile = async (path, bucket) => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting file:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete file'
    };
  }
};

/**
 * Get a list of files from a Supabase Storage bucket
 * @param {string} bucket - The storage bucket name
 * @param {string} path - The path within the bucket (optional)
 * @returns {Promise<{success: boolean, data?: Array<Object>, error?: string}>}
 */
export const listFiles = async (bucket, path = '') => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path);

    if (error) {
      throw error;
    }

    // Add public URLs to each file
    const filesWithUrls = data.map(file => {
      if (!file.id) return file; // Skip folders
      
      const filePath = path ? `${path}/${file.name}` : file.name;
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
      
      return {
        ...file,
        url: publicUrl
      };
    });

    return {
      success: true,
      data: filesWithUrls
    };
  } catch (error) {
    console.error('Error listing files:', error);
    return {
      success: false,
      error: error.message || 'Failed to list files'
    };
  }
};

/**
 * Get a public URL for a file in Supabase Storage
 * @param {string} path - The file path
 * @param {string} bucket - The storage bucket name
 * @returns {string} The public URL
 */
export const getPublicUrl = (path, bucket) => {
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return publicUrl;
};
