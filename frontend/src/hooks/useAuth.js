import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { useAuth as useAuthContext } from '@/contexts/auth';
import toast from 'react-hot-toast';

/**
 * Auth Hooks
 * React Query mutations for auth operations
 * 
 * Note: useAuth is exported from @/contexts/auth
 * This file only contains mutation hooks that depend on auth context
 */

export const useChangeUsername = () => {
  const queryClient = useQueryClient();
  const { refetchUser } = useAuthContext();

  return useMutation({
    mutationFn: (data) => authService.changeUsername(data),
    onSuccess: async (response) => {
      toast.success('Username updated successfully');
      await refetchUser();
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update username');
    },
  });
};

export const useChangePrivacy = () => {
  const queryClient = useQueryClient();
  const { refetchUser } = useAuthContext();

  return useMutation({
    mutationFn: (isPrivate) => authService.changePrivacy(isPrivate),
    onSuccess: async (response) => {
      const status = response.payload ? 'private' : 'public';
      toast.success(`Account set to ${status}`);
      await refetchUser();
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      // Invalidate account queries since privacy affects visibility
      queryClient.invalidateQueries({ queryKey: ['account'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update privacy');
    },
  });
};

