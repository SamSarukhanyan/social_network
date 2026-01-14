import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from './AuthContext';
import { authService } from '@/services/auth.service';

/**
 * AuthProvider Component
 * Provides authentication state and methods to the app
 * 
 * Fast Refresh compatible: Only exports a React component
 */
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const queryClient = useQueryClient();

  // Fetch authenticated user when token exists
  const {
    data: userData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      const response = await authService.getAuthUser();
      return response.payload;
    },
    enabled: !!token,
    retry: (failureCount, error) => {
      // Don't retry on 401 errors (invalid token)
      if (error?.response?.status === 401) {
        return false;
      }
      // Retry once for other errors
      return failureCount < 1;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    // If query fails with 401, clear token
    onError: (error) => {
      if (error?.response?.status === 401) {
        // Token is invalid, clear it
        setToken(null);
        localStorage.removeItem('auth_token');
        queryClient.clear();
      }
    },
  });

  // Update token in localStorage when it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
      queryClient.clear(); // Clear all queries on logout
    }
  }, [token, queryClient]);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const newToken = response.payload;
      
      // Set token in localStorage immediately (axios interceptor reads from here)
      localStorage.setItem('auth_token', newToken);
      // Then update state (which will trigger useEffect to sync)
      setToken(newToken);
      
      // Fetch user data - axios interceptor will use token from localStorage
      await refetch();
      
      return { success: true };
    } catch (error) {
      // Extract error message - backend returns { ok: false, message: "..." }
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Login failed. Please try again.';
      return { success: false, error: errorMessage };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authService.signup(userData);
      // Auto-login after signup
      const loginResponse = await authService.login({
        username: userData.username,
        password: userData.password,
      });
      const newToken = loginResponse.payload;
      
      // Set token in localStorage immediately (axios interceptor reads from here)
      localStorage.setItem('auth_token', newToken);
      // Then update state (which will trigger useEffect to sync)
      setToken(newToken);
      
      // Fetch user data - axios interceptor will use token from localStorage
      await refetch();
      
      return { success: true };
    } catch (error) {
      // Extract error message - backend returns { ok: false, message: "..." }
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Signup failed. Please try again.';
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    setToken(null);
    queryClient.clear();
  };

  // Authentication state: user is authenticated if token exists AND user data is loaded
  // We don't consider loading state as authenticated to avoid false positives
  // ProtectedRoute will handle the loading state separately
  const isAuthenticated = !!token && !!userData;

  const value = {
    user: userData,
    token,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    refetchUser: refetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

