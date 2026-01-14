export const PostSkeleton = () => {
  return (
    <div className="card animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <div className="skeleton h-12 w-12 rounded-full" />
        <div className="flex-1">
          <div className="skeleton h-4 w-32 mb-2" />
          <div className="skeleton h-3 w-24" />
        </div>
      </div>
      <div className="skeleton h-6 w-3/4 mb-2" />
      <div className="skeleton h-4 w-full mb-4" />
      <div className="skeleton h-64 w-full rounded-lg mb-4" />
      <div className="flex items-center space-x-4">
        <div className="skeleton h-6 w-16" />
        <div className="skeleton h-6 w-16" />
      </div>
    </div>
  );
};

export const ProfileSkeleton = () => {
  return (
    <div className="card animate-pulse">
      <div className="flex items-center space-x-6 mb-6">
        <div className="skeleton h-24 w-24 rounded-full" />
        <div className="flex-1">
          <div className="skeleton h-6 w-48 mb-2" />
          <div className="skeleton h-4 w-32 mb-4" />
          <div className="flex space-x-4">
            <div className="skeleton h-4 w-20" />
            <div className="skeleton h-4 w-20" />
            <div className="skeleton h-4 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProfileCardSkeleton = () => {
  return (
    <div className="card animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="skeleton h-12 w-12 rounded-full flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="skeleton h-4 w-32 mb-2" />
          <div className="skeleton h-3 w-24" />
        </div>
      </div>
    </div>
  );
};

