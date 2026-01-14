import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '@/services/post.service';
import toast from 'react-hot-toast';

/**
 * Post Hooks
 * React Query hooks for post operations
 */

/**
 * Get posts list
 * Transforms backend response to ensure consistent data structure
 */
export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await postService.getPosts();
      const posts = response.data || [];
      
      // Ensure each post has required fields and transform images
      return posts.map((post) => ({
        ...post,
        id: post.id, // Ensure id exists
        title: post.title || '',
        description: post.description || '',
        images: post.images || [], // Ensure images array exists
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
  });
};

/**
 * Get single post by ID
 * Transforms backend response to ensure consistent data structure
 */
export const usePost = (id) => {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: async () => {
      const response = await postService.getPostById(id);
      const post = response.data;
      
      if (!post) return null;
      
      // Ensure consistent data structure
      return {
        ...post,
        id: post.id,
        title: post.title || '',
        description: post.description || '',
        images: post.images || [],
        liked: post.liked || false,
        likesCount: post.likesCount || 0,
        commentsCount: post.commentsCount || 0,
        comments: post.comments || [],
        author: {
          id: post.author?.id,
          name: post.author?.name || '',
          surname: post.author?.surname || '',
          username: post.author?.username || '',
          picture_url: post.author?.picture_url,
        },
      };
    },
    enabled: !!id,
  });
};

/**
 * Create post mutation
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) => postService.createPost(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post created successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create post');
    },
  });
};

/**
 * Like/Unlike post mutation with optimistic updates
 * Syncs across all query keys: posts list, user posts, single post
 */
export const useLikePost = () => {
  const queryClient = useQueryClient();

  // Helper function to update post in any query cache
  const updatePostInCache = (queryKey, postId, updater) => {
    queryClient.setQueryData(queryKey, (old) => {
      if (!old) return old;
      
      // Handle array (posts list)
      if (Array.isArray(old)) {
        return old.map((post) => {
          if (post.id === postId) {
            return updater(post);
          }
          return post;
        });
      }
      
      // Handle single post object
      if (old.id === postId) {
        return updater(old);
      }
      
      return old;
    });
  };

  return useMutation({
    mutationFn: (postId) => postService.likePost(postId),
    onMutate: async (postId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      await queryClient.cancelQueries({ queryKey: ['posts', postId] });

      // Snapshot previous values for rollback
      const previousPosts = queryClient.getQueryData(['posts']);
      const previousPost = queryClient.getQueryData(['posts', postId]);
      
      // Get all query keys that might contain this post
      const allPostQueries = queryClient.getQueryCache().findAll({ 
        queryKey: ['posts'],
        exact: false 
      });

      // Optimistically update all relevant caches
      allPostQueries.forEach((query) => {
        const queryKey = query.queryKey;
        updatePostInCache(queryKey, postId, (post) => {
          const wasLiked = post.liked || false;
          return {
            ...post,
            liked: !wasLiked,
            likesCount: wasLiked 
              ? Math.max(0, (post.likesCount || 0) - 1)
              : (post.likesCount || 0) + 1,
          };
        });
      });

      return { previousPosts, previousPost, allPostQueries };
    },
    onSuccess: (data, postId) => {
      const response = data.data || {};
      const liked = response.liked;
      const likesCount = response.likesCount;
      
      // Update all relevant caches with server response
      const allPostQueries = queryClient.getQueryCache().findAll({ 
        queryKey: ['posts'],
        exact: false 
      });

      allPostQueries.forEach((query) => {
        const queryKey = query.queryKey;
        updatePostInCache(queryKey, postId, (post) => {
          // Use server response if available, otherwise keep optimistic update
          const updatedLiked = liked !== undefined ? liked : post.liked;
          const updatedLikesCount = likesCount !== undefined ? likesCount : post.likesCount;
          
          return {
            ...post,
            liked: updatedLiked,
            likesCount: updatedLikesCount,
          };
        });
      });
      
      // Also invalidate user-specific posts queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['posts', 'user'] });
      
      // Invalidate single post query if it exists
      queryClient.invalidateQueries({ queryKey: ['posts', postId] });
    },
    onError: (error, postId, context) => {
      // Rollback all caches on error
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts);
      }
      if (context?.previousPost) {
        queryClient.setQueryData(['posts', postId], context.previousPost);
      }
      
      // Rollback other query caches
      if (context?.allPostQueries) {
        context.allPostQueries.forEach((query) => {
          // Try to restore from snapshot if available
          const previousData = query.state.data;
          if (previousData) {
            queryClient.setQueryData(query.queryKey, previousData);
          }
        });
      }
      
      toast.error(error.response?.data?.message || 'Failed to update like');
    },
  });
};

/**
 * Add comment mutation with optimistic updates
 * Syncs comment count and adds comment to list across all query keys
 */
export const useAddComment = () => {
  const queryClient = useQueryClient();

  // Helper function to update post in any query cache
  const updatePostInCache = (queryKey, postId, updater) => {
    queryClient.setQueryData(queryKey, (old) => {
      if (!old) return old;
      
      // Handle array (posts list)
      if (Array.isArray(old)) {
        return old.map((post) => {
          if (post.id === postId) {
            return updater(post);
          }
          return post;
        });
      }
      
      // Handle single post object
      if (old.id === postId) {
        return updater(old);
      }
      
      return old;
    });
  };

  return useMutation({
    mutationFn: ({ postId, comment }) => postService.addComment(postId, { comment }),
    onMutate: async ({ postId, comment }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      await queryClient.cancelQueries({ queryKey: ['posts', postId] });

      // Snapshot previous values
      const previousPosts = queryClient.getQueryData(['posts']);
      const previousPost = queryClient.getQueryData(['posts', postId]);
      
      // Get current user from auth context (we'll get it from the component)
      // For now, create optimistic comment without user data (will be updated on success)
      const optimisticComment = {
        id: Date.now(), // Temporary ID
        text: comment,
        userId: null, // Will be set from response
        postId,
        author: {
          id: null,
          name: '',
          surname: '',
          username: '',
          picture_url: null,
        },
      };

      // Get all query keys that might contain this post
      const allPostQueries = queryClient.getQueryCache().findAll({ 
        queryKey: ['posts'],
        exact: false 
      });

      // Optimistically update all relevant caches
      allPostQueries.forEach((query) => {
        const queryKey = query.queryKey;
        updatePostInCache(queryKey, postId, (post) => {
          const currentComments = post.comments || [];
          return {
            ...post,
            commentsCount: (post.commentsCount || 0) + 1,
            // Add optimistic comment to comments array (will be replaced with real data on success)
            comments: [...currentComments, optimisticComment],
          };
        });
      });

      return { previousPosts, previousPost, optimisticComment, allPostQueries };
    },
    onSuccess: (data, variables) => {
      const { postId } = variables;
      const newComment = data.data;
      
      // Update all relevant caches with server response
      const allPostQueries = queryClient.getQueryCache().findAll({ 
        queryKey: ['posts'],
        exact: false 
      });

      allPostQueries.forEach((query) => {
        const queryKey = query.queryKey;
        updatePostInCache(queryKey, postId, (post) => {
          // Replace optimistic comment with real comment
          const comments = post.comments || [];
          const optimisticIndex = comments.findIndex((c) => 
            c.id > 1000000 && c.text === newComment.text
          );
          
          let updatedComments;
          if (optimisticIndex >= 0) {
            // Replace optimistic comment with real one
            updatedComments = [...comments];
            updatedComments[optimisticIndex] = newComment;
          } else {
            // Add new comment if optimistic wasn't found
            updatedComments = [...comments, newComment];
          }
          
          return {
            ...post,
            commentsCount: updatedComments.length,
            comments: updatedComments,
          };
        });
      });

      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['posts', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      
      toast.success('Comment added');
    },
    onError: (error, variables, context) => {
      const { postId } = variables;
      
      // Rollback all caches on error
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts);
      }
      if (context?.previousPost) {
        queryClient.setQueryData(['posts', postId], context.previousPost);
      }
      
      // Rollback other query caches
      if (context?.allPostQueries) {
        context.allPostQueries.forEach((query) => {
          // Try to restore from snapshot if available
          const previousData = query.state.data;
          if (previousData) {
            queryClient.setQueryData(query.queryKey, previousData);
          }
        });
      }
      
      toast.error(error.response?.data?.message || 'Failed to add comment');
    },
  });
};

