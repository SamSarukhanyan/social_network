import { memo, useState, useCallback, useMemo } from 'react';
import { normalizeImageUrl } from '@/utils/imageUrl';

/**
 * PostImages Component
 * Displays multiple images for a post
 * - Single image: Full width display
 * - Multiple images: Grid layout (2-3 columns)
 * - Click to view full size (optional)
 */
const PostImagesComponent = ({ images = [] }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // Normalize all image URLs
  const normalizedImages = useMemo(() => {
    if (!images || !Array.isArray(images)) return [];
    
    // Handle both formats:
    // 1. Array of strings: ["uploads/posts/image.jpg"]
    // 2. Array of objects: [{ image_url: "uploads/posts/image.jpg" }]
    return images
      .map((img) => {
        const url = typeof img === 'string' ? img : img?.image_url;
        return normalizeImageUrl(url);
      })
      .filter(Boolean); // Remove null/undefined
  }, [images]);

  const handleImageClick = useCallback((index) => {
    setSelectedImageIndex(index);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedImageIndex(null);
  }, []);

  if (normalizedImages.length === 0) {
    return null;
  }

  // Single image - full width with constrained height
  if (normalizedImages.length === 1) {
    return (
      <div className="mb-3 sm:mb-4 rounded-lg sm:rounded-xl overflow-hidden bg-gray-100">
        <img
          src={normalizedImages[0]}
          alt="Post image"
          className="w-full h-auto max-h-[400px] sm:max-h-[450px] md:max-h-[500px] object-cover cursor-pointer hover:opacity-95 transition-opacity"
          loading="lazy"
          onClick={() => handleImageClick(0)}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
    );
  }

  // Multiple images - grid layout
  const gridClass = normalizedImages.length === 2 
    ? 'grid-cols-2' 
    : normalizedImages.length === 3
    ? 'grid-cols-3'
    : 'grid-cols-2 md:grid-cols-3';

  return (
    <>
      <div className={`mb-3 sm:mb-4 grid ${gridClass} gap-1.5 sm:gap-2`}>
        {normalizedImages.map((imageUrl, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg sm:rounded-xl overflow-hidden cursor-pointer group bg-gray-100"
            onClick={() => handleImageClick(index)}
          >
            <img
              src={imageUrl}
              alt={`Post image ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                e.target.parentElement.style.display = 'none';
              }}
            />
            {normalizedImages.length > 4 && index === 3 && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <span className="text-white font-semibold text-base sm:text-lg">
                  +{normalizedImages.length - 4}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <button
            onClick={handleCloseModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <img
            src={normalizedImages[selectedImageIndex]}
            alt={`Post image ${selectedImageIndex + 1}`}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {normalizedImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex((prev) =>
                    prev > 0 ? prev - 1 : normalizedImages.length - 1
                  );
                }}
                className="absolute left-4 text-white hover:text-gray-300 z-10"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex((prev) =>
                    prev < normalizedImages.length - 1 ? prev + 1 : 0
                  );
                }}
                className="absolute right-4 text-white hover:text-gray-300 z-10"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
};

export const PostImages = memo(PostImagesComponent);

PostImages.displayName = 'PostImages';

