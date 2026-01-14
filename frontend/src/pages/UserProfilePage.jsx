import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAccount } from '@/hooks/useAccount';
import { useAuth } from '@/contexts/auth';
import { FollowButton } from '@/components/Account/FollowButton';
import { ProfileSkeleton } from '@/components/Skeleton';
import { Layout } from '@/components/Layout/Layout';
import { Avatar } from '@/components/Account/Avatar';
import { ProfileTabs } from '@/components/Profile/ProfileTabs';
import { PostCard } from '@/components/Post/PostCard';
import { PostSkeleton } from '@/components/Skeleton';
import { FollowersList } from '@/components/Profile/FollowersList';
import { FollowingsList } from '@/components/Profile/FollowingsList';
import { useUserPosts, useUserFollowers, useUserFollowings } from '@/hooks/useProfile';
import { RecommendedUsers } from '@/components/Recommended/RecommendedUsers';

const UserProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const userId = id ? parseInt(id) : null;
  const [activeTab, setActiveTab] = useState('posts');

  // Fetch account data
  const { data: account, isLoading, error } = useAccount(userId);
  
  // Determine if we can view content (for conditional fetching)
  // Only calculate after account data is loaded
  const isOwnProfile = currentUser?.id === userId;
  const followStatus = account?.followStatus || 'unfollowed';
  const canViewContent = account 
    ? (isOwnProfile || !account.isPrivate || followStatus === 'followed')
    : false;
  
  // Fetch user-specific data (only if we can view content and account is loaded)
  const { data: posts, isLoading: postsLoading } = useUserPosts(userId, canViewContent && !!account);
  const { data: followers = [], isLoading: followersLoading } = useUserFollowers(userId, canViewContent && !!account);
  const { data: followings = [], isLoading: followingsLoading } = useUserFollowings(userId, canViewContent && !!account);

  // Reset tab when navigating to different user
  useEffect(() => {
    setActiveTab('posts');
  }, [userId]);

  // Memoize counts
  const counts = useMemo(() => ({
    posts: account?.counts?.posts || 0,
    followers: account?.counts?.followers || 0,
    followings: account?.counts?.followings || 0,
  }), [account]);

  // Handle tab change
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <ProfileSkeleton />
        </div>
      </Layout>
    );
  }

  if (error || !account) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="card text-center py-12">
            <p className="text-red-600">User not found or you don't have access to this profile.</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Instagram-like visibility logic
  // Can view content if: own profile OR public OR (private AND following)
  const isPrivateAndNotFollowing = account.isPrivate && !isOwnProfile && followStatus !== 'followed';

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="card mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6">
            {/* Avatar - Read-only for other users */}
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <Avatar user={account} size="large" />
            </div>
            
            {/* User Info */}
            <div className="flex-1 w-full sm:w-auto text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 space-y-3 sm:space-y-0">
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                    {account.name} {account.surname}
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600">@{account.username}</p>
                </div>
                {!isOwnProfile && (
                  <div className="flex justify-center sm:justify-end">
                    <FollowButton
                      userId={account.id}
                      isPrivate={account.isPrivate}
                      followStatus={followStatus}
                    />
                  </div>
                )}
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
                  <span className="font-semibold text-gray-900">{counts.followers}</span>
                  <span className="ml-2 text-sm sm:text-base">followers</span>
                </button>
                <button
                  onClick={() => handleTabChange('followings')}
                  className={`hover:underline ${
                    activeTab === 'followings' ? 'font-semibold text-gray-900' : 'text-gray-600'
                  }`}
                >
                  <span className="font-semibold text-gray-900">{counts.followings}</span>
                  <span className="ml-2 text-sm sm:text-base">following</span>
                </button>
              </div>
              
              {/* Private Badge */}
              {account.isPrivate && (
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

        {/* Tabs - Only show if can view content */}
        {canViewContent && (
          <ProfileTabs activeTab={activeTab} onTabChange={handleTabChange} />
        )}

        {/* Tab Content */}
        {isPrivateAndNotFollowing ? (
          // Private account and not following - show lock message for all tabs
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <p className="text-gray-600 mb-2 text-lg font-medium">This account is private</p>
            <p className="text-sm text-gray-500">
              Follow this account to see their posts, followers, and following
            </p>
          </div>
        ) : (
          <>
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
                    <p className="text-sm sm:text-base text-gray-500">No posts yet.</p>
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
          </>
        )}

        {/* Recommended Users Section */}
        <div className="mt-6 sm:mt-8">
          <RecommendedUsers limit={20} />
        </div>
      </div>
    </Layout>
  );
};

export default UserProfilePage;
