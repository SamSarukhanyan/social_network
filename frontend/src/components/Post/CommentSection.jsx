import { memo, useState, useCallback, useEffect } from 'react';
import { useAddComment } from '@/hooks/usePosts';
import { useAuth } from '@/contexts/auth';
import { usePost } from '@/hooks/usePosts';
import { Avatar } from '@/components/Account/Avatar';
import { CommentList } from './CommentList';

/**
 * CommentSection Component
 * Handles comment form and displays comment list
 */
const CommentSectionComponent = ({ postId }) => {
  const [comment, setComment] = useState('');
  const { user } = useAuth();
  const addCommentMutation = useAddComment();
  
  // Fetch post to get comments (if available)
  // Use refetch to get updated comments after adding a new one
  const { data: post, isLoading: postLoading, refetch: refetchPost } = usePost(postId);
  const comments = post?.comments || [];
  
  // Refetch post when comment is added to get updated comments list
  useEffect(() => {
    if (addCommentMutation.isSuccess) {
      refetchPost();
    }
  }, [addCommentMutation.isSuccess, refetchPost]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    addCommentMutation.mutate(
      { postId, comment: comment.trim() },
      {
        onSuccess: () => {
          setComment('');
        },
      }
    );
  }, [comment, postId, addCommentMutation]);

  return (
    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
      {/* Comment List */}
      <CommentList comments={comments} isLoading={postLoading} />
      
      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="flex space-x-2 mt-3 sm:mt-4">
        <Avatar user={user} size="small" className="flex-shrink-0" />
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 input text-sm"
          disabled={addCommentMutation.isPending}
        />
        <button
          type="submit"
          disabled={!comment.trim() || addCommentMutation.isPending}
          className="btn btn-primary text-xs sm:text-sm px-3 sm:px-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {addCommentMutation.isPending ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export const CommentSection = memo(CommentSectionComponent);

CommentSection.displayName = 'CommentSection';

