import { useMemo } from 'react';
import { usePosts } from '@/hooks/usePosts';
import { PostForm } from '@/components/Post/PostForm';
import { PostCard } from '@/components/Post/PostCard';
import { PostSkeleton } from '@/components/Skeleton';
import { Layout } from '@/components/Layout/Layout';
import { RecommendedUsers } from '@/components/Recommended/RecommendedUsers';

const HomePage = () => {
  const { data: posts, isLoading, error } = usePosts();

  // Memoize posts array to prevent unnecessary re-renders
  const postsList = useMemo(() => {
    if (!posts || !Array.isArray(posts)) return [];
    return posts;
  }, [posts]);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <PostForm />

          <div className="space-y-4 sm:space-y-6">
            {isLoading ? (
              <>
                <PostSkeleton />
                <PostSkeleton />
              </>
            ) : error ? (
              <div className="card text-center py-8 sm:py-12">
                <p className="text-sm sm:text-base text-red-600">Failed to load posts. Please try again.</p>
              </div>
            ) : postsList.length > 0 ? (
              postsList.map((post) => (
                <PostCard key={post.id || `post-${post.title}`} post={post} />
              ))
            ) : (
              <div className="card text-center py-8 sm:py-12">
                <p className="text-sm sm:text-base text-gray-500">No posts yet. Create your first post!</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Recommended Users */}
        {/* Hidden on mobile, shown on tablet+ but below content, fixed sidebar on desktop */}
        <div className="lg:block order-first lg:order-last">
          <div className="lg:sticky lg:top-20">
            <RecommendedUsers limit={20} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;

