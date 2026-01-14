import { useParams, useNavigate } from 'react-router-dom';
import { usePost } from '@/hooks/usePosts';
import { PostSkeleton } from '@/components/Skeleton';
import { Layout } from '@/components/Layout/Layout';
import { PostImages } from '@/components/Post/PostImages';
import { LikeButton } from '@/components/Post/LikeButton';
import { CommentSection } from '@/components/Post/CommentSection';
import { useLikePost } from '@/hooks/usePosts';
import { Avatar } from '@/components/Account/Avatar';
import { useCallback, useMemo } from 'react';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: post, isLoading, error } = usePost(id);
  const likeMutation = useLikePost();

  const handleLike = useCallback(() => {
    if (post?.id) {
      likeMutation.mutate(post.id);
    }
  }, [likeMutation, post?.id]);


  // Memoize post images array
  const postImages = useMemo(() => {
    if (!post?.images || !Array.isArray(post.images)) return [];
    return post.images;
  }, [post?.images]);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto">
          <PostSkeleton />
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto">
          <div className="card text-center py-12">
            <p className="text-red-600 mb-4">
              {error?.response?.data?.message || 'Post not found or you don\'t have access to view it.'}
            </p>
            <button
              onClick={() => navigate(-1)}
              className="btn btn-primary"
            >
              Go Back
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <article className="card">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>

          {/* Post Header */}
          <div className="flex items-center space-x-3 mb-4">
            <Avatar user={post.author} size="medium" />
            <div>
              <div className="font-medium text-gray-900">
                {post.author?.name} {post.author?.surname}
              </div>
              <div className="text-sm text-gray-500">
                {post.author?.username && `@${post.author.username}`}
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="mb-4">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              {post.title || 'Untitled Post'}
            </h1>
            <p className="text-gray-700 whitespace-pre-wrap text-lg">
              {post.description || ''}
            </p>
          </div>

          {/* Post Images */}
          <PostImages images={postImages} />

          {/* Post Actions */}
          <div className="flex items-center space-x-6 pt-4 border-t border-gray-200">
            <LikeButton
              liked={post.liked || false}
              likesCount={post.likesCount || 0}
              onClick={handleLike}
              disabled={likeMutation.isPending}
            />
            <div className="flex items-center space-x-2 text-gray-600">
              <svg
                className="w-5 h-5"
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
              <span className="text-sm">{post.commentsCount || 0} comments</span>
            </div>
          </div>

          {/* Comments Section */}
          <CommentSection postId={post.id} />
        </article>
      </div>
    </Layout>
  );
};

export default PostDetailPage;

