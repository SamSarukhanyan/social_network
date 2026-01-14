# Testing Checklist - Image Rendering & Performance

## Image Rendering Tests

### Single Image Posts
- [ ] Create post with 1 image
- [ ] Verify image displays correctly
- [ ] Verify image is full width
- [ ] Click image → opens modal
- [ ] Verify image URL is correct (check Network tab)

### Multiple Image Posts
- [ ] Create post with 2 images
- [ ] Verify both images display in grid (2 columns)
- [ ] Create post with 3 images
- [ ] Verify all 3 images display in grid (3 columns)
- [ ] Create post with 4+ images
- [ ] Verify grid shows first 4 with "+N" indicator
- [ ] Click any image → opens modal
- [ ] Navigate between images in modal (prev/next buttons)

### Image Path Resolution
- [ ] Check browser Network tab
- [ ] Verify image URLs are: `http://localhost:5000/uploads/posts/...`
- [ ] Verify images return 200 status (not 404)
- [ ] Test with relative paths from backend
- [ ] Test with absolute URLs (if any)

### Image Error Handling
- [ ] Upload image, then delete from server
- [ ] Verify broken image doesn't break UI
- [ ] Verify fallback behavior works
- [ ] Check console for errors

## Post Display Tests

### Post Content
- [ ] Title displays correctly
- [ ] Description displays correctly (preserves line breaks)
- [ ] Author name and username display
- [ ] Author avatar displays (or fallback)
- [ ] Post ID exists (check React DevTools)

### Post Metadata
- [ ] Like count displays
- [ ] Comment count displays
- [ ] Like button works (optimistic update)
- [ ] Comment section works

## Followers/Followings Tests

### Navigation
- [ ] Click "followers" link on profile
- [ ] Verify navigates to `/followers`
- [ ] Verify followers list renders
- [ ] Click "following" link on profile
- [ ] Verify navigates to `/followings`
- [ ] Verify followings list renders

### List Rendering
- [ ] Followers list shows all followers
- [ ] Followings list shows all followings
- [ ] User avatars display correctly
- [ ] User names and usernames display
- [ ] Clicking user navigates to their profile

### Dynamic Updates
- [ ] Follow a user
- [ ] Verify followings count updates immediately
- [ ] Verify followings list updates
- [ ] Unfollow a user
- [ ] Verify followings count updates immediately
- [ ] Verify followings list updates

## Performance Tests

### Re-rendering
- [ ] Open React DevTools Profiler
- [ ] Like a post
- [ ] Verify only PostCard re-renders (not entire list)
- [ ] Follow a user
- [ ] Verify only affected components re-render

### Optimistic Updates
- [ ] Like a post
- [ ] Verify like count updates instantly (before server response)
- [ ] Verify heart icon fills immediately
- [ ] Disconnect network
- [ ] Like a post
- [ ] Verify rollback on error
- [ ] Verify error toast shows

### Query Caching
- [ ] Load posts
- [ ] Navigate away and back
- [ ] Verify posts load from cache (instant)
- [ ] Verify no unnecessary API calls

## Console Checks

- [ ] No React warnings
- [ ] No console errors
- [ ] No 404 errors for images
- [ ] No CORS errors
- [ ] No network errors (when online)

## Edge Cases

### Empty States
- [ ] Post with no images (only text)
- [ ] Post with no title
- [ ] Post with no description
- [ ] User with no followers
- [ ] User with no followings

### Data Validation
- [ ] Post with null/undefined images array
- [ ] Post with empty images array
- [ ] Post with invalid image URLs
- [ ] Post with missing author data

## Browser Compatibility

- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

## Performance Metrics

- [ ] Page load time < 2s
- [ ] Image load time < 1s per image
- [ ] No layout shifts (CLS)
- [ ] Smooth scrolling
- [ ] Fast interactions (< 100ms)

