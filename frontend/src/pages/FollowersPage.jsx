import { useFollowers } from '@/hooks/useAccount';
import { Layout } from '@/components/Layout/Layout';
import { LoadingSpinner } from '@/components/Loading';
import { Link } from 'react-router-dom';
import { Avatar } from '@/components/Account/Avatar';

const FollowersPage = () => {
  const { data: followers = [], isLoading, error } = useFollowers();

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <LoadingSpinner className="py-12" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <div className="card text-center py-12">
            <p className="text-red-600">Failed to load followers. Please try again.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Followers</h1>

        {followers.length > 0 ? (
          <div className="space-y-4">
            {followers.map((follower) => (
              <div key={follower.id} className="card">
                <div className="flex items-center justify-between">
                  <Link
                    to={`/user/${follower.id}`}
                    className="flex items-center space-x-4 flex-1 hover:opacity-80 transition-opacity"
                  >
                    <Avatar user={follower} size="medium" className="flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {follower.name} {follower.surname}
                      </div>
                      <div className="text-sm text-gray-500 truncate">@{follower.username}</div>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
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
            <p className="text-gray-600">No followers yet</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FollowersPage;

