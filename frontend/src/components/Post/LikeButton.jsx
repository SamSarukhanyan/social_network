import { memo, useCallback } from 'react';

const LikeButtonComponent = ({ liked, likesCount, onClick, disabled }) => {
  const handleClick = useCallback(() => {
    if (!disabled) {
      onClick();
    }
  }, [onClick, disabled]);
  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`flex items-center space-x-1.5 sm:space-x-2 transition-all ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80 active:scale-95'
      }`}
    >
      {liked ? (
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 fill-current"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      )}
      <span className={`text-xs sm:text-sm font-medium ${liked ? 'text-red-500' : 'text-gray-500'}`}>
        {likesCount}
      </span>
    </button>
  );
};

export const LikeButton = memo(LikeButtonComponent, (prevProps, nextProps) => {
  return (
    prevProps.liked === nextProps.liked &&
    prevProps.likesCount === nextProps.likesCount &&
    prevProps.disabled === nextProps.disabled
  );
});

LikeButton.displayName = 'LikeButton';

