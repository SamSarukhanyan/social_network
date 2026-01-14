import { memo, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLikePost } from '@/hooks/usePosts';
import { LikeButton } from './LikeButton';
import { CommentSection } from './CommentSection';
import { PostImages } from './PostImages';
import { Avatar } from '@/components/Account/Avatar';

const PostCardComponent = ({ post }) => {
  const likeMutation = useLikePost();

  const handleLike = useCallback(() => {
    if (post.id) {
      likeMutation.mutate(post.id);
    }
  }, [likeMutation, post.id]);

  // Memoize post images array
  const postImages = useMemo(() => {
    if (!post.images || !Array.isArray(post.images)) return [];
    return post.images;
  }, [post.images]);

  return (
    <article className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-5 md:p-6 mb-5 sm:mb-6 transition-shadow hover:shadow-lg">
      {/* Post Header */}
      <div className="flex items-center space-x-3 mb-3 sm:mb-4">
        <Avatar user={post.author} size="medium" />
        <div className="flex-1 min-w-0">
          <Link
            to={`/user/${post.author?.id}`}
            className="block font-semibold text-gray-900 hover:text-primary-600 transition-colors text-sm sm:text-base"
          >
            {post.author?.name} {post.author?.surname}
          </Link>
          <div className="text-xs sm:text-sm text-gray-400 mt-0.5">
            {post.author?.username && `@${post.author.username}`}
          </div>
        </div>
      </div>

      {/* Post Content */}
      {(post.title || post.description) && (
        <div className="mb-3 sm:mb-4">
          {post.title && (
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 leading-tight">
              {post.title}
            </h3>
          )}
          {post.description && (
            <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap leading-relaxed">
              {post.description}
            </p>
          )}
        </div>
      )}

      {/* Post Images - Handles single and multiple images */}
      <PostImages images={postImages} />

      {/* Post Actions */}
      <div className="flex items-center space-x-4 sm:space-x-6 pt-3 sm:pt-4 border-t border-gray-100">
        <LikeButton
          liked={post.liked || false}
          likesCount={post.likesCount || 0}
          onClick={handleLike}
          disabled={likeMutation.isPending}
        />
        <div className="flex items-center space-x-1.5 sm:space-x-2 text-gray-500">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span className="text-xs sm:text-sm">{post.commentsCount || 0}</span>
        </div>
        <Link
          to={`/post/${post.id}`}
          className="text-primary-600 hover:text-primary-700 text-xs sm:text-sm font-medium transition-colors ml-auto"
        >
          View Post
        </Link>
      </div>

      {/* Comments Section */}
      <CommentSection postId={post.id} />
    </article>
  );
};

// Memoize with custom comparison
export const PostCard = memo(PostCardComponent, (prevProps, nextProps) => {
  // Only re-render if these specific props change
  const prevPost = prevProps.post;
  const nextPost = nextProps.post;
  
  return (
    prevPost.id === nextPost.id &&
    prevPost.liked === nextPost.liked &&
    prevPost.likesCount === nextPost.likesCount &&
    prevPost.commentsCount === nextPost.commentsCount &&
    prevPost.title === nextPost.title &&
    prevPost.description === nextPost.description &&
    prevPost.author?.id === nextPost.author?.id &&
    JSON.stringify(prevPost.images) === JSON.stringify(nextPost.images)
  );
});

PostCard.displayName = 'PostCard';

