/**frontend/src/config/api.js
 * API Configuration
 * Base URL and default settings for API requests
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    SIGNUP: "/auth/signup",
    LOGIN: "/auth/login",
    GET_USER: "/auth/user",
    CHANGE_USERNAME: "/auth/user/username",
    CHANGE_PRIVACY: "/auth/user/privacy",
  },
  // Account
  ACCOUNT: {
    SEARCH: (text) => `/account/search/${text}`,
    GET_BY_ID: (id) => `/account/${id}`,
    FOLLOWERS: "/account/followers",
    FOLLOWERS_BY_USER: (userId) => `/account/followers/${userId}`,
    FOLLOWINGS: "/account/followings",
    FOLLOWINGS_BY_USER: (userId) => `/account/followings/${userId}`,
    REQUESTS: "/account/requests",
    FOLLOW: (id) => `/account/${id}/follow`,
    ACCEPT_REQUEST: (id) => `/account/request/${id}/accept`,
    DECLINE_REQUEST: (id) => `/account/request/${id}/decline`,
    RECOMMENDED: (limit = 20) => `/account/recommended?limit=${limit}`,
    UPLOAD_AVATAR: "/account/avatar",
    DELETE_AVATAR: "/account/avatar",
  },
  // Posts
  POSTS: {
    LIST: "/posts",
    LIST_BY_USER: (userId) => `/posts?userId=${userId}`,
    CREATE: "/posts",
    GET_BY_ID: (id) => `/posts/${id}`,
    LIKE: (id) => `/posts/${id}/like`,
    COMMENTS: (id) => `/posts/${id}/comments`,
  },
};
