import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '@/components/Account/Avatar';

/**
 * CommentItem Component
 * Individual comment display
 */
const CommentItemComponent = ({ comment }) => {
  return (
    <div className="flex items-start space-x-3 py-2">
      <Avatar user={comment.author} size="small" className="flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <Link
            to={`/user/${comment.author?.id || comment.userId}`}
            className="font-semibold text-gray-900 hover:underline text-sm"
          >
            {comment.author?.username || 'User'}
          </Link>
        </div>
        <p className="text-gray-700 text-sm whitespace-pre-wrap break-words">
          {comment.text || comment.comment}
        </p>
      </div>
    </div>
  );
};

const CommentItem = memo(CommentItemComponent, (prevProps, nextProps) => {
  return (
    prevProps.comment.id === nextProps.comment.id &&
    prevProps.comment.text === nextProps.comment.text
  );
});

CommentItem.displayName = 'CommentItem';

/**
 * CommentList Component
 * Displays list of comments for a post
 */
const CommentListComponent = ({ comments = [], isLoading }) => {
  // Sort comments: latest first (highest ID = newest)
  const sortedComments = useMemo(() => {
    if (!comments || !Array.isArray(comments)) return [];
    return [...comments].sort((a, b) => {
      // Sort by ID descending (newest first)
      // Handle both real IDs and optimistic temporary IDs
      const aId = a.id || 0;
      const bId = b.id || 0;
      return bId - aId;
    });
  }, [comments]);

  if (isLoading) {
    return (
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="skeleton h-8 w-8 rounded-full" />
            <div className="flex-1">
              <div className="skeleton h-4 w-24 mb-2" />
              <div className="skeleton h-4 w-full" />
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="skeleton h-8 w-8 rounded-full" />
            <div className="flex-1">
              <div className="skeleton h-4 w-24 mb-2" />
              <div className="skeleton h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (sortedComments.length === 0) {
    return null; // Don't show anything if no comments
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="space-y-1">
        {sortedComments.map((comment) => (
          <CommentItem key={comment.id || `comment-${comment.text}`} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export const CommentList = memo(CommentListComponent);

CommentList.displayName = 'CommentList';

