import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '@/services/account.service';
import toast from 'react-hot-toast';

/**
 * Account Hooks
 * React Query hooks for account operations
 */

/**
 * Search users by name
 */
export const useSearchUsers = (text, enabled = true) => {
  return useQuery({
    queryKey: ['account', 'search', text],
    queryFn: async () => {
      const response = await accountService.search(text);
      return response.payload.users;
    },
    enabled: enabled && text.length >= 1,
    staleTime: 1000 * 30, // 30 seconds for search results
  });
};

/**
 * Get account by ID
 */
export const useAccount = (id) => {
  return useQuery({
    queryKey: ['account', id],
    queryFn: async () => {
      const response = await accountService.getById(id);
      return response.payload.account;
    },
    enabled: !!id,
  });
};

/**
 * Get current user's followers
 */
export const useFollowers = () => {
  return useQuery({
    queryKey: ['account', 'followers'],
    queryFn: async () => {
      const response = await accountService.getFollowers();
      return response.payload.users;
    },
  });
};

/**
 * Get current user's followings
 */
export const useFollowings = () => {
  return useQuery({
    queryKey: ['account', 'followings'],
    queryFn: async () => {
      const response = await accountService.getFollowings();
      return response.payload.users;
    },
  });
};

/**
 * Get follow requests
 */
export const useFollowRequests = () => {
  return useQuery({
    queryKey: ['account', 'requests'],
    queryFn: async () => {
      const response = await accountService.getRequests();
      // Backend returns { ok: true, users: [...] }
      const requests = response.users || [];
      // Ensure each request has an ID
      return requests.filter(request => request.id);
    },
    refetchInterval: 1000 * 30, // Refetch every 30 seconds for real-time updates
  });
};

/**
 * Follow/Unfollow mutation with optimistic updates
 */
export const useFollow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => accountService.follow(id),
    onMutate: async (userId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['account', userId] });

      // Snapshot previous value
      const previousAccount = queryClient.getQueryData(['account', userId]);

      // Optimistically update
      queryClient.setQueryData(['account', userId], (old) => {
        if (!old) return old;
        return {
          ...old,
          // We'll update the follow status optimistically
        };
      });

      return { previousAccount };
    },
    onSuccess: (data, userId, context) => {
      const { status, targetUser } = data.payload;
      
      // Get previous status from context for toast message
      const previousStatus = context?.previousAccount?.followStatus;
      
      // Update account cache with new follow status
      queryClient.setQueryData(['account', userId], (old) => {
        if (!old) return old;
        return {
          ...old,
          followStatus: status,
          // Update counts optimistically
          counts: {
            ...old.counts,
            followers: status === 'followed' 
              ? (old.counts?.followers || 0) + 1
              : status === 'unfollowed'
              ? Math.max(0, (old.counts?.followers || 0) - 1)
              : old.counts?.followers || 0,
          },
        };
      });

      // Invalidate related queries to trigger re-render
      queryClient.invalidateQueries({ queryKey: ['account', userId] });
      queryClient.invalidateQueries({ queryKey: ['account', 'followers'] });
      queryClient.invalidateQueries({ queryKey: ['account', 'followings'] });
      queryClient.invalidateQueries({ queryKey: ['account', 'followers', userId] });
      queryClient.invalidateQueries({ queryKey: ['account', 'followings', userId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts', 'user'] });
      // Invalidate recommended users to sync follow status across all pages
      // This ensures the recommended list updates when follow status changes
      queryClient.invalidateQueries({ 
        queryKey: ['account', 'recommended'],
        exact: false // Invalidate all recommended queries regardless of limit
      });

      // Show appropriate message based on status and previous status
      if (status === 'followed') {
        toast.success(`Following ${targetUser.username}`);
      } else if (status === 'requested') {
        toast.success(`Follow request sent to ${targetUser.username}`);
      } else if (status === 'unfollowed') {
        // Check previous status to determine if it was a cancel or unfollow
        if (previousStatus === 'requested') {
          toast.success(`Follow request canceled`);
        } else {
          toast.success(`Unfollowed ${targetUser.username}`);
        }
      }
    },
    onError: (error, userId, context) => {
      // Rollback on error
      if (context?.previousAccount) {
        queryClient.setQueryData(['account', userId], context.previousAccount);
      }
      toast.error(error.response?.data?.message || 'Failed to update follow status');
    },
  });
};

/**
 * Accept follow request
 */
export const useAcceptRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => accountService.acceptRequest(id),
    onSuccess: () => {
      // Invalidate requests list to remove accepted request
      queryClient.invalidateQueries({ queryKey: ['account', 'requests'] });
      // Invalidate followers list to show new follower
      queryClient.invalidateQueries({ queryKey: ['account', 'followers'] });
      // Invalidate user-specific queries
      queryClient.invalidateQueries({ queryKey: ['account'] });
      toast.success('Follow request accepted');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to accept request';
      toast.error(errorMessage);
      console.error('Accept request error:', error);
    },
  });
};

/**
 * Decline follow request
 */
export const useDeclineRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => accountService.declineRequest(id),
    onSuccess: () => {
      // Invalidate requests list to remove declined request
      queryClient.invalidateQueries({ queryKey: ['account', 'requests'] });
      toast.success('Follow request declined');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to decline request';
      toast.error(errorMessage);
      console.error('Decline request error:', error);
    },
  });
};

