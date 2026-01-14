import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '@/components/Account/Avatar';
import { ProfileCardSkeleton } from '@/components/Skeleton';

/**
 * FollowersList Component
 * Displays list of followers for a user
 */
const FollowersListComponent = ({ followers = [], isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <ProfileCardSkeleton />
        <ProfileCardSkeleton />
        <ProfileCardSkeleton />
      </div>
    );
  }

  if (followers.length === 0) {
    return (
      <div className="card text-center py-12">
        <svg
          className="w-16 h-16 mx-auto text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <p className="text-gray-600">No followers yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {followers.map((follower) => (
        <div key={follower.id} className="card">
          <Link
            to={`/user/${follower.id}`}
            className="flex items-center space-x-4 hover:opacity-80 transition-opacity"
          >
            <Avatar user={follower} size="medium" className="flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 truncate">
                {follower.name} {follower.surname}
              </div>
              <div className="text-sm text-gray-500 truncate">@{follower.username}</div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export const FollowersList = memo(FollowersListComponent);

FollowersList.displayName = 'FollowersList';

