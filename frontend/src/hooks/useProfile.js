import { useQuery } from '@tanstack/react-query';
import { accountService } from '@/services/account.service';
import { postService } from '@/services/post.service';

/**
 * Profile Hooks
 * React Query hooks for profile-specific operations
 */

/**
 * Get user's posts
 * @param {number|null} userId - User ID (null for current user)
 * @param {boolean} enabled - Whether the query should run
 */
export const useUserPosts = (userId = null, enabled = true) => {
  return useQuery({
    queryKey: ['posts', 'user', userId],
    queryFn: async () => {
      const response = await postService.getPosts(userId);
      const posts = response.data || [];
      
      // Transform posts to ensure consistent structure
      return posts.map((post) => ({
        ...post,
        id: post.id,
        title: post.title || '',
        description: post.description || '',
        images: post.images || [],
        liked: post.liked || false,
        likesCount: post.likesCount || 0,
        commentsCount: post.commentsCount || 0,
        author: {
          id: post.author?.id,
          name: post.author?.name || '',
          surname: post.author?.surname || '',
          username: post.author?.username || '',
          picture_url: post.author?.picture_url,
        },
      }));
    },
    enabled: userId !== undefined && enabled,
  });
};

/**
 * Get user's followers
 * @param {number|null} userId - User ID (null for current user)
 * @param {boolean} enabled - Whether the query should run
 */
export const useUserFollowers = (userId = null, enabled = true) => {
  return useQuery({
    queryKey: ['account', 'followers', userId],
    queryFn: async () => {
      const response = await accountService.getFollowers(userId);
      return response.payload.users || [];
    },
    enabled: userId !== undefined && enabled,
  });
};

/**
 * Get user's followings
 * @param {number|null} userId - User ID (null for current user)
 * @param {boolean} enabled - Whether the query should run
 */
export const useUserFollowings = (userId = null, enabled = true) => {
  return useQuery({
    queryKey: ['account', 'followings', userId],
    queryFn: async () => {
      const response = await accountService.getFollowings(userId);
      return response.payload.users || [];
    },
    enabled: userId !== undefined && enabled,
  });
};

