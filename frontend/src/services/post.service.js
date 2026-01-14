import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/config/api';

/**
 * Post Service
 * Handles posts, likes, and comments
 */
export const postService = {
  /**
   * Get posts list (current user or specific user)
   * @param {number|null} userId - User ID (optional, defaults to current user)
   * @returns {Promise<{ ok: boolean, data: Post[] }>}
   */
  getPosts: async (userId = null) => {
    const endpoint = userId 
      ? API_ENDPOINTS.POSTS.LIST_BY_USER(userId)
      : API_ENDPOINTS.POSTS.LIST;
    const response = await axiosInstance.get(endpoint);
    return response.data;
  },

  /**
   * Create a new post
   * @param {FormData} formData - { title, description, files: File[] }
   * @returns {Promise<{ ok: boolean, data: Post }>}
   */
  createPost: async (formData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.POSTS.CREATE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Get post by ID with full details
   * @param {number} id - Post ID
   * @returns {Promise<{ ok: boolean, data: Post }>}
   */
  getPostById: async (id) => {
    const response = await axiosInstance.get(API_ENDPOINTS.POSTS.GET_BY_ID(id));
    return response.data;
  },

  /**
   * Like/Unlike a post
   * @param {number} id - Post ID
   * @returns {Promise<{ ok: boolean, data: { liked: boolean, message: string } }>}
   */
  likePost: async (id) => {
    const response = await axiosInstance.post(API_ENDPOINTS.POSTS.LIKE(id));
    return response.data;
  },

  /**
   * Add comment to a post
   * @param {number} id - Post ID
   * @param {Object} data - { comment: string }
   * @returns {Promise<{ ok: boolean, data: Comment }>}
   */
  addComment: async (id, data) => {
    const response = await axiosInstance.post(API_ENDPOINTS.POSTS.COMMENTS(id), data);
    return response.data;
  },
};

