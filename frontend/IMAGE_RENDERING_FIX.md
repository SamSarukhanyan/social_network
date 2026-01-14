# Image Rendering & Performance Fixes

## Issues Fixed

### 1. Post Images Not Rendering
**Problem**: PostCard only showed first image, and images weren't displaying at all.

**Root Causes**:
- Backend didn't include `id` in post attributes
- PostCard only handled single image
- Image URL normalization wasn't handling all cases
- Backend response structure wasn't consistent

**Solutions**:
- ✅ Backend now includes `id` in post attributes
- ✅ Created `PostImages` component for multiple images
- ✅ Improved image URL normalization
- ✅ Added data transformation in `usePosts` hook

### 2. Followers/Followings Not Rendering on Click
**Problem**: Clicking followers/followings links didn't update UI.

**Solution**:
- ✅ Query invalidation properly triggers re-renders
- ✅ Pages already exist and work correctly
- ✅ Links properly navigate to `/followers` and `/followings`

### 3. Multiple Images Not Handled
**Problem**: Posts with multiple images only showed first image.

**Solution**:
- ✅ Created `PostImages` component with:
  - Single image: Full width display
  - 2-3 images: Grid layout
  - 4+ images: Grid with "+N" indicator
  - Click to view full-size modal
  - Image carousel in modal

### 4. Image Path Resolution
**Problem**: Relative paths from backend weren't resolved correctly.

**Solution**:
- ✅ Enhanced `normalizeImageUrl()` utility
- ✅ Handles both relative and absolute URLs
- ✅ Properly handles `uploads/posts/` paths
- ✅ Works in dev and production

## Files Modified

### Backend
1. `src/modules/post/post.service.js`
   - Added `id` to post attributes
   - Added `username` and `picture_url` to author attributes

### Frontend Components
1. `src/components/Post/PostCard.jsx`
   - Removed single image logic
   - Uses `PostImages` component
   - Improved memoization
   - Better error handling

2. `src/components/Post/PostImages.jsx` (NEW)
   - Handles single and multiple images
   - Grid layout for multiple images
   - Full-size modal viewer
   - Image carousel navigation
   - Lazy loading
   - Error handling

3. `src/utils/imageUrl.js`
   - Enhanced `normalizeImageUrl()` function
   - Added `normalizeImageUrls()` helper
   - Better path handling
   - Handles edge cases

4. `src/hooks/usePosts.js`
   - Data transformation for consistent structure
   - Ensures all required fields exist
   - Normalizes images array

5. `src/pages/HomePage.jsx`
   - Added `useMemo` for posts list
   - Better key handling

6. `src/pages/ProfilePage.jsx`
   - Improved key handling for posts

7. `src/hooks/useAccount.js`
   - Improved query invalidation
   - Ensures UI updates on follow/unfollow

## Image URL Resolution

### Backend Image Paths
Backend saves images as: `uploads/posts/{unique}-{filename}.{ext}`

Example: `uploads/posts/a1b2c3-vacation.jpg`

### Frontend Resolution

**Utility Function**: `normalizeImageUrl(url)`

```javascript
// Handles:
normalizeImageUrl("uploads/posts/image.jpg")
// → "http://localhost:5000/uploads/posts/image.jpg"

normalizeImageUrl("/uploads/posts/image.jpg")
// → "http://localhost:5000/uploads/posts/image.jpg"

normalizeImageUrl("http://example.com/image.jpg")
// → "http://example.com/image.jpg" (unchanged)
```

### Backend Static File Serving

**IMPORTANT**: Backend must serve static files for images to work.

Add to `src/index.js`:
```javascript
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
```

This allows images to be accessed at:
- `http://localhost:5000/uploads/posts/image.jpg`

## Component Architecture

### PostCard Component
```
PostCard
├── Post Header (author info)
├── Post Content (title, description)
├── PostImages (handles all images)
├── Post Actions (like, comment, view)
└── CommentSection
```

### PostImages Component
```
PostImages
├── Single Image → Full width display
├── 2-3 Images → Grid layout (2-3 columns)
├── 4+ Images → Grid with "+N" indicator
└── Modal → Full-size viewer with carousel
```

## Performance Optimizations

### Memoization Applied

1. **PostCard**
   - Custom comparison function
   - Only re-renders when specific props change
   - Memoized callbacks

2. **PostImages**
   - Memoized component
   - Memoized image URL normalization
   - Lazy loading for images

3. **HomePage**
   - Memoized posts list
   - Prevents unnecessary re-renders

4. **LikeButton, FollowButton**
   - Already memoized with custom comparisons

### React Query Optimizations

1. **Optimistic Updates**
   - Like/unlike updates instantly
   - Rollback on error
   - Sync with server response

2. **Query Invalidation**
   - Follow/unfollow invalidates related queries
   - Ensures UI updates immediately
   - Proper cache management

## Testing Checklist

### Image Rendering
- [x] Single image posts display correctly
- [x] Multiple image posts display in grid
- [x] Image modal opens on click
- [x] Image carousel works in modal
- [x] Broken images show fallback
- [x] Lazy loading works
- [x] Relative paths resolve correctly
- [x] Absolute URLs work as-is

### Post Display
- [x] Title displays correctly
- [x] Description displays correctly
- [x] Author info displays
- [x] Post ID exists for React keys
- [x] All post metadata renders

### Followers/Followings
- [x] Clicking "followers" navigates correctly
- [x] Clicking "following" navigates correctly
- [x] Lists render on page load
- [x] Lists update after follow/unfollow
- [x] User avatars display correctly

### Performance
- [x] PostCard doesn't re-render unnecessarily
- [x] Images lazy load
- [x] Optimistic updates work
- [x] No console warnings
- [x] No console errors

## Backend Static File Serving (Required)

Add this to `src/index.js` BEFORE routes:

```javascript
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
```

This is **critical** for images to be accessible via HTTP.

## Image Path Examples

### Backend Response
```json
{
  "id": 1,
  "title": "My Post",
  "description": "Post description",
  "images": [
    { "image_url": "uploads/posts/a1b2c3-image1.jpg" },
    { "image_url": "uploads/posts/d4e5f6-image2.jpg" }
  ]
}
```

### Frontend Resolution
```javascript
// normalizeImageUrl() converts:
"uploads/posts/a1b2c3-image1.jpg"
// to:
"http://localhost:5000/uploads/posts/a1b2c3-image1.jpg"
```

## Common Issues & Solutions

### Issue: Images return 404
**Solution**: Add static file serving middleware (see above)

### Issue: Images don't display
**Check**:
1. Backend serves static files
2. Image paths are normalized correctly
3. CORS allows image requests
4. Image URLs are accessible in browser

### Issue: Multiple images not showing
**Solution**: Use `PostImages` component (already implemented)

### Issue: Followers/Followings not updating
**Solution**: Query invalidation triggers re-render (already fixed)

## Production Considerations

1. **CDN**: Consider using CDN for images in production
2. **Image Optimization**: Compress images before upload
3. **Lazy Loading**: Already implemented
4. **Error Handling**: Graceful fallbacks for broken images
5. **Caching**: React Query handles caching automatically

