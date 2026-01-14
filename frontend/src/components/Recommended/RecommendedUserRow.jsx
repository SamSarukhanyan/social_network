import { memo } from 'react';
import { Link } from 'react-router-dom';
import { FollowButton } from '@/components/Account/FollowButton';
import { Avatar } from '@/components/Account/Avatar';

/**
 * RecommendedUserRow Component
 * Displays a single recommended user with follow button
 * 
 * Props:
 * - user: User object with id, username, name, surname, picture_url, isPrivate, followStatus
 */
const RecommendedUserRowComponent = ({ user }) => {
  return (
    <div className="flex items-center justify-between py-2">
      <Link
        to={`/user/${user.id}`}
        className="flex items-center space-x-3 flex-1 min-w-0 hover:opacity-80 transition-opacity"
      >
        <Avatar user={user} size="medium" className="flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 text-sm truncate">
            {user.username || `${user.name} ${user.surname}`.trim() || 'User'}
          </div>
          {user.name && user.surname && (
            <div className="text-xs text-gray-500 truncate">
              {user.name} {user.surname}
            </div>
          )}
        </div>
      </Link>
      <div className="ml-3 flex-shrink-0">
        <FollowButton
          userId={user.id}
          isPrivate={user.isPrivate || false}
          followStatus={user.followStatus || 'unfollowed'}
        />
      </div>
    </div>
  );
};

export const RecommendedUserRow = memo(RecommendedUserRowComponent, (prevProps, nextProps) => {
  // Only re-render if user data or follow status changes
  return (
    prevProps.user.id === nextProps.user.id &&
    prevProps.user.followStatus === nextProps.user.followStatus &&
    prevProps.user.username === nextProps.user.username
  );
});

RecommendedUserRow.displayName = 'RecommendedUserRow';

