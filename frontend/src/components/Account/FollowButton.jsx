import { memo, useCallback, useMemo, useState, useEffect } from 'react';
import { useFollow } from '@/hooks/useAccount';
import { useAuth } from '@/contexts/auth';

/**
 * FollowButton Component
 * Handles follow/unfollow with optimistic updates
 * 
 * Props:
 * - userId: Target user ID
 * - isPrivate: Whether the user's account is private
 * - followStatus: Initial follow status ('followed' | 'requested' | 'unfollowed')
 */
const FollowButtonComponent = ({ userId, isPrivate, followStatus: initialFollowStatus = 'unfollowed' }) => {
  const { user } = useAuth();
  const followMutation = useFollow();
  
  // Local state for optimistic updates
  const [localFollowStatus, setLocalFollowStatus] = useState(initialFollowStatus);
  
  // Sync with prop changes (e.g., after refetch)
  useEffect(() => {
    setLocalFollowStatus(initialFollowStatus);
  }, [initialFollowStatus]);

  // Don't show button for own profile
  if (user?.id === userId) {
    return null;
  }

  // Determine button text based on current status (Instagram-like)
  const buttonText = useMemo(() => {
    if (localFollowStatus === 'followed') {
      return 'Following';
    }
    if (localFollowStatus === 'requested') {
      return 'Requested';
    }
    return 'Follow';
  }, [localFollowStatus]);

  // Determine button class based on status
  const buttonClass = useMemo(() => {
    if (localFollowStatus === 'followed') {
      return 'btn-outline';
    }
    if (localFollowStatus === 'requested') {
      return 'btn-secondary';
    }
    return 'btn-primary';
  }, [localFollowStatus]);

  // Handle follow/unfollow/cancel request click
  const handleClick = useCallback(() => {
    // Don't allow clicking if mutation is pending
    if (followMutation.isPending) {
      return;
    }

    // Optimistic update based on current status
    const currentStatus = localFollowStatus;
    let optimisticStatus;
    
    if (currentStatus === 'followed') {
      // Unfollow: change from "Following" to "Follow"
      optimisticStatus = 'unfollowed';
    } else if (currentStatus === 'requested') {
      // Cancel request: change from "Requested" to "Follow"
      optimisticStatus = 'unfollowed';
    } else if (currentStatus === 'unfollowed') {
      // Follow: change to "Requested" (private) or "Following" (public)
      optimisticStatus = isPrivate ? 'requested' : 'followed';
    } else {
      optimisticStatus = currentStatus;
    }

    setLocalFollowStatus(optimisticStatus);

    // Perform mutation
    followMutation.mutate(userId, {
      onSuccess: (data) => {
        // Update with server response
        const { status } = data.payload;
        setLocalFollowStatus(status);
      },
      onError: () => {
        // Rollback on error
        setLocalFollowStatus(currentStatus);
      },
    });
  }, [localFollowStatus, isPrivate, followMutation, userId]);

  return (
    <button
      onClick={handleClick}
      disabled={followMutation.isPending}
      className={`btn ${buttonClass} ${followMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {followMutation.isPending ? 'Loading...' : buttonText}
    </button>
  );
};

export const FollowButton = memo(FollowButtonComponent, (prevProps, nextProps) => {
  // Only re-render if userId or followStatus changes
  return (
    prevProps.userId === nextProps.userId &&
    prevProps.isPrivate === nextProps.isPrivate &&
    prevProps.followStatus === nextProps.followStatus
  );
});

FollowButton.displayName = 'FollowButton';
