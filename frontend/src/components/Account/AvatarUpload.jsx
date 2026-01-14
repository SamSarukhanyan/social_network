import { useState, useRef, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '@/services/account.service';
import { useAuth } from '@/contexts/auth';
import { normalizeImageUrl } from '@/utils/imageUrl';
import toast from 'react-hot-toast';

/**
 * AvatarUpload Component
 * Allows users to upload, change, or delete their profile picture
 * 
 * Props:
 * - size: 'small' | 'medium' | 'large' (default: 'large')
 * - className: Additional CSS classes
 */
export const AvatarUpload = ({ size = 'large', className = '' }) => {
  const { user, refetchUser } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Size classes
  const sizeClasses = useMemo(() => {
    switch (size) {
      case 'small':
        return 'w-12 h-12 sm:w-14 sm:h-14';
      case 'medium':
        return 'w-16 h-16 sm:w-20 sm:h-20';
      case 'large':
      default:
        return 'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28';
    }
  }, [size]);

  // Avatar URL
  const avatarUrl = useMemo(() => {
    return normalizeImageUrl(user?.picture_url);
  }, [user?.picture_url]);

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      return await accountService.uploadAvatar(file);
    },
    onSuccess: async (data) => {
      // Update auth user in cache
      await refetchUser();
      
      // Invalidate all user-related queries
      await queryClient.invalidateQueries({ queryKey: ['authUser'] });
      await queryClient.invalidateQueries({ queryKey: ['account'] });
      await queryClient.invalidateQueries({ queryKey: ['posts'] });
      await queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      
      toast.success('Profile picture updated successfully!');
      setIsMenuOpen(false);
    },
    onError: (error) => {
      const message = error?.response?.data?.message || 'Failed to upload profile picture. Please try again.';
      toast.error(message);
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await accountService.deleteAvatar();
    },
    onSuccess: async (data) => {
      // Update auth user in cache
      await refetchUser();
      
      // Invalidate all user-related queries
      await queryClient.invalidateQueries({ queryKey: ['authUser'] });
      await queryClient.invalidateQueries({ queryKey: ['account'] });
      await queryClient.invalidateQueries({ queryKey: ['posts'] });
      await queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      
      toast.success('Profile picture removed successfully!');
      setIsMenuOpen(false);
    },
    onError: (error) => {
      const message = error?.response?.data?.message || 'Failed to remove profile picture. Please try again.';
      toast.error(message);
    },
  });

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Please select a JPEG, PNG, or GIF image.');
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('File size too large. Maximum size is 5MB.');
      return;
    }

    setIsUploading(true);
    uploadMutation.mutate(file);
  };

  // Handle click on avatar
  const handleAvatarClick = () => {
    if (isUploading || uploadMutation.isPending || deleteMutation.isPending) return;
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle upload button click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handle delete button click
  const handleDeleteClick = () => {
    if (window.confirm('Are you sure you want to remove your profile picture?')) {
      deleteMutation.mutate();
    }
  };

  const isLoading = isUploading || uploadMutation.isPending || deleteMutation.isPending;

  return (
    <div className={`relative ${className}`}>
      {/* Avatar Container */}
      <div
        className={`relative ${sizeClasses} rounded-full cursor-pointer group transition-all ${
          isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
        }`}
        onClick={handleAvatarClick}
      >
        {/* Avatar Image or Placeholder */}
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={user?.username || 'Profile'}
            className={`${sizeClasses} rounded-full object-cover border-2 border-gray-200`}
            onError={(e) => {
              e.target.style.display = 'none';
              if (e.target.nextSibling) {
                e.target.nextSibling.style.display = 'flex';
              }
            }}
          />
        ) : null}
        <div
          className={`${sizeClasses} rounded-full bg-primary-200 flex items-center justify-center border-2 border-gray-200 ${
            avatarUrl ? 'hidden' : ''
          }`}
        >
          <span className="text-primary-600 font-medium text-lg sm:text-xl md:text-2xl">
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </span>
        </div>

        {/* Hover Overlay */}
        {!isLoading && (
          <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 rounded-full bg-black bg-opacity-20 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      {/* Dropdown Menu */}
      {isMenuOpen && !isLoading && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <button
              onClick={handleUploadClick}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center space-x-2 text-sm font-medium text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>{avatarUrl ? 'Change Photo' : 'Upload Photo'}</span>
            </button>
            {avatarUrl && (
              <button
                onClick={handleDeleteClick}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center space-x-2 text-sm font-medium text-red-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Remove Photo</span>
              </button>
            )}
          </div>
        </>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};
