import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '@/components/Account/Avatar';
import { ProfileCardSkeleton } from '@/components/Skeleton';

/**
 * FollowingsList Component
 * Displays list of users that a user is following
 */
const FollowingsListComponent = ({ followings = [], isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <ProfileCardSkeleton />
        <ProfileCardSkeleton />
        <ProfileCardSkeleton />
      </div>
    );
  }

  if (followings.length === 0) {
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
        <p className="text-gray-600">Not following anyone yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {followings.map((following) => (
        <div key={following.id} className="card">
          <Link
            to={`/user/${following.id}`}
            className="flex items-center space-x-4 hover:opacity-80 transition-opacity"
          >
            <Avatar user={following} size="medium" className="flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 truncate">
                {following.name} {following.surname}
              </div>
              <div className="text-sm text-gray-500 truncate">@{following.username}</div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export const FollowingsList = memo(FollowingsListComponent);

FollowingsList.displayName = 'FollowingsList';

