import { useMemo } from 'react';
import { normalizeImageUrl } from '@/utils/imageUrl';

/**
 * Avatar Component
 * Displays a circular user avatar with fallback to initials
 * 
 * Props:
 * - user: User object with picture_url and username
 * - size: 'small' | 'medium' | 'large' (default: 'medium')
 * - className: Additional CSS classes
 * - showBorder: Whether to show a border (default: false)
 */
export const Avatar = ({ user, size = 'medium', className = '', showBorder = false }) => {
  // Size classes
  const sizeClasses = useMemo(() => {
    switch (size) {
      case 'small':
        return 'w-8 h-8 sm:w-10 sm:h-10';
      case 'medium':
        return 'w-10 h-10 sm:w-12 sm:h-12';
      case 'large':
      default:
        return 'w-20 h-20 sm:w-24 sm:h-24';
    }
  }, [size]);

  // Text size classes
  const textSizeClasses = useMemo(() => {
    switch (size) {
      case 'small':
        return 'text-xs sm:text-sm';
      case 'medium':
        return 'text-sm sm:text-base';
      case 'large':
      default:
        return 'text-xl sm:text-2xl md:text-3xl';
    }
  }, [size]);

  // Avatar URL
  const avatarUrl = useMemo(() => {
    return normalizeImageUrl(user?.picture_url);
  }, [user?.picture_url]);

  // Initials
  const initials = useMemo(() => {
    return user?.username?.[0]?.toUpperCase() || 'U';
  }, [user?.username]);

  return (
    <div className={`relative ${sizeClasses} ${className}`}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={user?.username || 'User'}
          className={`${sizeClasses} rounded-full object-cover ${
            showBorder ? 'border-2 border-gray-200' : ''
          }`}
          onError={(e) => {
            e.target.style.display = 'none';
            if (e.target.nextSibling) {
              e.target.nextSibling.style.display = 'flex';
            }
          }}
        />
      ) : null}
      <div
        className={`${sizeClasses} rounded-full bg-primary-200 flex items-center justify-center ${
          showBorder ? 'border-2 border-gray-200' : ''
        } ${avatarUrl ? 'hidden' : ''}`}
      >
        <span className={`text-primary-600 font-medium ${textSizeClasses}`}>
          {initials}
        </span>
      </div>
    </div>
  );
};
