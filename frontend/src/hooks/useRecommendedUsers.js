import { useQuery } from '@tanstack/react-query';
import { accountService } from '@/services/account.service';
import { useAuth } from '@/contexts/auth';

/**
 * Recommended Users Hook
 * React Query hook for fetching recommended users
 * 
 * This hook is route-independent and always fetches for the authenticated user.
 * It works consistently across all pages (HomePage, ProfilePage, UserProfilePage).
 * 
 * @param {number} limit - Maximum number of users to fetch (default: 20)
 * @returns {UseQueryResult} React Query result with recommended users
 */
export const useRecommendedUsers = (limit = 20) => {
  const { isAuthenticated, user } = useAuth();
  
  return useQuery({
    queryKey: ['account', 'recommended', limit], // Stable cache key, route-independent
    queryFn: async () => {
      const response = await accountService.getRecommended(limit);
      const users = response.payload?.users || [];
      
      // Ensure each user has required fields and normalized followStatus
      return users.map(user => ({
        ...user,
        followStatus: user.followStatus || 'unfollowed', // Ensure followStatus is always present
      }));
    },
    enabled: isAuthenticated && !!user, // Only fetch when authenticated and user data is loaded
    staleTime: 1000 * 60 * 5, // 5 minutes - recommended users don't change frequently
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: 'always', // Always refetch when component mounts (ensures fresh data after navigation)
  });
};

