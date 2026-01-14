import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/contexts/auth';
import { useUserPosts, useUserFollowers, useUserFollowings } from '@/hooks/useProfile';
import { PostCard } from '@/components/Post/PostCard';
import { PostSkeleton } from '@/components/Skeleton';
import { Layout } from '@/components/Layout/Layout';
import { Link } from 'react-router-dom';
import { normalizeImageUrl } from '@/utils/imageUrl';
import { ProfileTabs } from '@/components/Profile/ProfileTabs';
import { FollowersList } from '@/components/Profile/FollowersList';
import { FollowingsList } from '@/components/Profile/FollowingsList';
import { RecommendedUsers } from '@/components/Recommended/RecommendedUsers';
import { AvatarUpload } from '@/components/Account/AvatarUpload';

const ProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('posts');

  // Fetch data for current user (userId = null means current user)
  const { data: posts, isLoading: postsLoading } = useUserPosts(null);
  const { data: followers = [], isLoading: followersLoading } = useUserFollowers(null);
  const { data: followings = [], isLoading: followingsLoading } = useUserFollowings(null);

  // Memoize counts
  const counts = useMemo(() => ({
    posts: posts?.length || 0,
    followers: followers.length,
    followings: followings.length,
  }), [posts, followers, followings]);

  // Handle tab change
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  if (!user) {
    return (
      <Layout>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="card mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6">
            {/* Avatar - Editable for own profile */}
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <AvatarUpload size="large" />
            </div>
            
            {/* User Info */}
            <div className="flex-1 w-full sm:w-auto text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 space-y-3 sm:space-y-0">
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                    {user.name} {user.surname}
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600">@{user.username}</p>
                </div>
                <Link
                  to="/settings"
                  className="btn btn-outline text-sm sm:text-base px-4 py-2 w-full sm:w-auto"
                >
                  Edit Profile
                </Link>
              </div>
              
              {/* Stats */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6 mb-3 sm:mb-4">
                <button
                  onClick={() => handleTabChange('posts')}
                  className={`hover:underline ${
                    activeTab === 'posts' ? 'font-semibold text-gray-900' : 'text-gray-600'
                  }`}
                >
                  <span className="font-semibold text-gray-900">{counts.posts}</span>
                  <span className="ml-2 text-sm sm:text-base">posts</span>
                </button>
                <button
                  onClick={() => handleTabChange('followers')}
                  className={`hover:underline ${
                    activeTab === 'followers' ? 'font-semibold text-gray-900' : 'text-gray-600'
                  }`}
                >
                  <span className="font-semibold text-gray-900">
                    {followersLoading ? '...' : counts.followers}
                  </span>
                  <span className="ml-2 text-sm sm:text-base">followers</span>
                </button>
                <button
                  onClick={() => handleTabChange('followings')}
                  className={`hover:underline ${
                    activeTab === 'followings' ? 'font-semibold text-gray-900' : 'text-gray-600'
                  }`}
                >
                  <span className="font-semibold text-gray-900">
                    {followingsLoading ? '...' : counts.followings}
                  </span>
                  <span className="ml-2 text-sm sm:text-base">following</span>
                </button>
              </div>
              
              {/* Private Badge */}
              {user.isPrivate && (
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-xs sm:text-sm text-gray-700">Private Account</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <ProfileTabs activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Tab Content */}
        {activeTab === 'posts' && (
          <div className="space-y-4 sm:space-y-6">
            {postsLoading ? (
              <>
                <PostSkeleton />
                <PostSkeleton />
              </>
            ) : posts && posts.length > 0 ? (
              posts.map((post) => (
                <PostCard key={post.id || `post-${post.title}`} post={post} />
              ))
            ) : (
              <div className="card text-center py-8 sm:py-12">
                <p className="text-sm sm:text-base text-gray-500">You haven't posted anything yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'followers' && (
          <FollowersList followers={followers} isLoading={followersLoading} />
        )}

        {activeTab === 'followings' && (
          <FollowingsList followings={followings} isLoading={followingsLoading} />
        )}

        {/* Recommended Users Section */}
        <div className="mt-6 sm:mt-8">
          <RecommendedUsers limit={20} />
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
