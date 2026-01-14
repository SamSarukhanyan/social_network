import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/config/api';

/**
 * Authentication Service
 * Handles all auth-related API calls
 */
export const authService = {
  /**
   * Sign up a new user
   * @param {Object} data - { username, password, name?, surname? }
   * @returns {Promise<{ ok: boolean, payload: User }>}
   */
  signup: async (data) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.SIGNUP, data);
    return response.data;
  },

  /**
   * Login user
   * @param {Object} credentials - { username, password }
   * @returns {Promise<{ ok: boolean, payload: string }>} - token
   */
  login: async (credentials) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  /**
   * Get authenticated user
   * @returns {Promise<{ ok: boolean, payload: User }>}
   */
  getAuthUser: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.AUTH.GET_USER);
    return response.data;
  },

  /**
   * Change username
   * @param {Object} data - { username, password }
   * @returns {Promise<{ ok: boolean, payload: User }>}
   */
  changeUsername: async (data) => {
    const response = await axiosInstance.patch(API_ENDPOINTS.AUTH.CHANGE_USERNAME, data);
    return response.data;
  },

  /**
   * Change privacy setting
   * @param {boolean} isPrivate
   * @returns {Promise<{ ok: boolean, payload: boolean }>}
   */
  changePrivacy: async (isPrivate) => {
    const response = await axiosInstance.patch(API_ENDPOINTS.AUTH.CHANGE_PRIVACY, { isPrivate });
    return response.data;
  },
};

