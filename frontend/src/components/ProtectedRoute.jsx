import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, token } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  // If we have a token, wait for user data to load before making a decision
  if (isLoading || (token && !isAuthenticated)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If no token and not loading, user is definitely not authenticated
  if (!token && !isLoading) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If we have a token but user data failed to load (and not loading), token is invalid
  if (token && !isAuthenticated && !isLoading) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated
  return children;
};

