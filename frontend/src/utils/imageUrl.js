import { API_BASE_URL } from '@/config/api';

/**
 * Normalize image URL
 * Handles both relative and absolute URLs
 * 
 * Backend saves images as: "uploads/posts/filename.jpg"
 * This function converts them to: "http://localhost:5000/uploads/posts/filename.jpg"
 * 
 * @param {string|null|undefined} url - Image URL from backend
 * @returns {string|null} - Normalized URL or null if invalid
 */
export const normalizeImageUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  
  // Already absolute URL (http:// or https://)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Handle relative paths
  // Backend returns: "uploads/posts/filename.jpg" or "/uploads/posts/filename.jpg"
  let cleanUrl = url.trim();
  
  // Remove leading slash if present (to avoid double slashes with API_BASE_URL)
  if (cleanUrl.startsWith('/')) {
    cleanUrl = cleanUrl.slice(1);
  }
  
  // Ensure API_BASE_URL doesn't have trailing slash
  const baseUrl = API_BASE_URL.endsWith('/') 
    ? API_BASE_URL.slice(0, -1) 
    : API_BASE_URL;
  
  // Combine: baseUrl + "/" + cleanUrl
  return `${baseUrl}/${cleanUrl}`;
};

/**
 * Normalize multiple image URLs
 * Useful for post images array
 * 
 * @param {Array<string|object>|null|undefined} images - Array of image URLs or objects with image_url
 * @returns {Array<string>} - Array of normalized URLs
 */
export const normalizeImageUrls = (images) => {
  if (!images || !Array.isArray(images)) return [];
  
  return images
    .map((img) => {
      // Handle both string URLs and objects with image_url property
      const url = typeof img === 'string' ? img : img?.image_url;
      return normalizeImageUrl(url);
    })
    .filter(Boolean); // Remove null/undefined values
};

