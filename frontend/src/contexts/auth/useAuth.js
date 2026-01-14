import { useContext } from 'react';
import { AuthContext } from './AuthContext';

/**
 * useAuth Hook
 * Custom hook to access authentication context
 * 
 * Fast Refresh compatible: Only exports a hook function
 * 
 * @returns {Object} Auth context value
 * @throws {Error} If used outside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

