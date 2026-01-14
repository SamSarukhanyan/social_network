import { memo } from 'react';
import { useRecommendedUsers } from '@/hooks/useRecommendedUsers';
import { RecommendedUserRow } from './RecommendedUserRow';
import { LoadingSpinner } from '@/components/Loading';
import { useAuth } from '@/contexts/auth';

/**
 * RecommendedUsers Component
 * Displays a list of recommended users
 * 
 * This component is route-independent and always fetches for the authenticated user.
 * It renders consistently across all pages (HomePage, ProfilePage, UserProfilePage).
 * 
 * Props:
 * - limit: Maximum number of users to display (default: 20)
 * - title: Section title (default: "Suggested for you")
 */
const RecommendedUsersComponent = ({ limit = 20, title = 'Suggested for you' }) => {
  const { isAuthenticated } = useAuth();
  const { data: users = [], isLoading, error } = useRecommendedUsers(limit);

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
        <div className="py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
        <div className="py-4 text-center">
          <p className="text-sm text-gray-500">Unable to load suggestions</p>
        </div>
      </div>
    );
  }

  // Show empty state only if truly no users (not just loading)
  if (!users || users.length === 0) {
    return (
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
        <div className="py-4 text-center">
          <p className="text-sm text-gray-500">No suggestions available</p>
        </div>
      </div>
    );
  }

  // Render users list
  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="space-y-1">
        {users.map((user) => (
          <RecommendedUserRow key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export const RecommendedUsers = memo(RecommendedUsersComponent);

RecommendedUsers.displayName = 'RecommendedUsers';

