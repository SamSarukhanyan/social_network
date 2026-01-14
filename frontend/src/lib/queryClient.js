import { QueryClient } from '@tanstack/react-query';

/**
 * React Query client configuration
 * Optimized for social network use case with:
 * - Stale time for better caching
 * - Retry logic for failed requests
 * - Refetch on window focus for real-time updates
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false,
    },
  },
});

