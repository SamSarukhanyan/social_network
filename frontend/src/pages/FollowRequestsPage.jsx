import { useFollowRequests, useAcceptRequest, useDeclineRequest } from '@/hooks/useAccount';
import { Layout } from '@/components/Layout/Layout';
import { LoadingSpinner } from '@/components/Loading';
import { Avatar } from '@/components/Account/Avatar';

const FollowRequestsPage = () => {
  const { data: requests = [], isLoading } = useFollowRequests();
  const acceptMutation = useAcceptRequest();
  const declineMutation = useDeclineRequest();

  const handleAccept = (requestId) => {
    acceptMutation.mutate(requestId);
  };

  const handleDecline = (requestId) => {
    declineMutation.mutate(requestId);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Follow Requests</h1>

        {isLoading ? (
          <LoadingSpinner className="py-12" />
        ) : requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((request) => {
              const user = request.sender;
              const requestId = request.id; // Use Follow record ID from backend

              if (!requestId) {
                console.error('Request missing ID:', request);
                return null;
              }

              return (
                <div key={requestId} className="card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <Avatar user={user} size="medium" className="flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {user?.name || ''} {user?.surname || ''}
                        </div>
                        <div className="text-sm text-gray-500 truncate">@{user?.username || 'user'}</div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAccept(requestId)}
                        disabled={acceptMutation.isPending || declineMutation.isPending}
                        className="btn btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {acceptMutation.isPending ? 'Accepting...' : 'Accept'}
                      </button>
                      <button
                        onClick={() => handleDecline(requestId)}
                        disabled={acceptMutation.isPending || declineMutation.isPending}
                        className="btn btn-outline text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {declineMutation.isPending ? 'Declining...' : 'Decline'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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
            <p className="text-gray-600">No pending follow requests</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FollowRequestsPage;

