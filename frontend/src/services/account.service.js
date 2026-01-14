import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/config/api';

/**
 * Account Service
 * Handles user account, search, and follow operations
 */
export const accountService = {
  /**
   * Search users by name
   * @param {string} text - Search query
   * @returns {Promise<{ ok: boolean, payload: { users: User[] } }>}
   */
  search: async (text) => {
    const response = await axiosInstance.get(API_ENDPOINTS.ACCOUNT.SEARCH(text));
    return response.data;
  },

  /**
   * Get account by ID with counts
   * @param {number} id - User ID
   * @returns {Promise<{ ok: boolean, payload: { account: User & { counts: {...} } } }>}
   */
  getById: async (id) => {
    const response = await axiosInstance.get(API_ENDPOINTS.ACCOUNT.GET_BY_ID(id));
    return response.data;
  },

  /**
   * Get followers (current user or specific user)
   * @param {number|null} userId - User ID (optional, defaults to current user)
   * @returns {Promise<{ ok: boolean, payload: { users: User[] } }>}
   */
  getFollowers: async (userId = null) => {
    const endpoint = userId 
      ? API_ENDPOINTS.ACCOUNT.FOLLOWERS_BY_USER(userId)
      : API_ENDPOINTS.ACCOUNT.FOLLOWERS;
    const response = await axiosInstance.get(endpoint);
    return response.data;
  },

  /**
   * Get followings (current user or specific user)
   * @param {number|null} userId - User ID (optional, defaults to current user)
   * @returns {Promise<{ ok: boolean, payload: { users: User[] } }>}
   */
  getFollowings: async (userId = null) => {
    const endpoint = userId 
      ? API_ENDPOINTS.ACCOUNT.FOLLOWINGS_BY_USER(userId)
      : API_ENDPOINTS.ACCOUNT.FOLLOWINGS;
    const response = await axiosInstance.get(endpoint);
    return response.data;
  },

  /**
   * Get follow requests (for private accounts)
   * @returns {Promise<{ ok: boolean, users: Array<{ sender: User }> }>}
   */
  getRequests: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.ACCOUNT.REQUESTS);
    return response.data;
  },

  /**
   * Follow/Unfollow a user
   * @param {number} id - Target user ID
   * @returns {Promise<{ ok: boolean, payload: { status: 'followed'|'requested'|'unfollowed', targetUser: User } }>}
   */
  follow: async (id) => {
    const response = await axiosInstance.post(API_ENDPOINTS.ACCOUNT.FOLLOW(id));
    return response.data;
  },

  /**
   * Accept follow request
   * @param {number} id - Request ID
   * @returns {Promise<{ ok: boolean, status: string }>}
   */
  acceptRequest: async (id) => {
    const response = await axiosInstance.patch(API_ENDPOINTS.ACCOUNT.ACCEPT_REQUEST(id));
    return response.data;
  },

  /**
   * Decline follow request
   * @param {number} id - Request ID
   * @returns {Promise<{ ok: boolean, status: string }>}
   */
  declineRequest: async (id) => {
    const response = await axiosInstance.patch(API_ENDPOINTS.ACCOUNT.DECLINE_REQUEST(id));
    return response.data;
  },

  /**
   * Get recommended users
   * @param {number} limit - Maximum number of users to return (default: 20)
   * @returns {Promise<{ ok: boolean, payload: { users: User[], count: number } }>}
   */
  getRecommended: async (limit = 20) => {
    const response = await axiosInstance.get(API_ENDPOINTS.ACCOUNT.RECOMMENDED(limit));
    return response.data;
  },

  /**
   * Upload or replace profile picture (avatar)
   * @param {File} file - Image file to upload
   * @returns {Promise<{ ok: boolean, payload: User }>}
   */
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await axiosInstance.post(API_ENDPOINTS.ACCOUNT.UPLOAD_AVATAR, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Delete profile picture (avatar)
   * @returns {Promise<{ ok: boolean, payload: User }>}
   */
  deleteAvatar: async () => {
    const response = await axiosInstance.delete(API_ENDPOINTS.ACCOUNT.DELETE_AVATAR);
    return response.data;
  },
};

