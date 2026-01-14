# Implementation Notes

## Backend Integration Status

### ✅ Fully Implemented
- Authentication (login, signup, token management)
- User profile viewing
- Post creation with images
- Post listing (own posts)
- Like/unlike posts
- Add comments
- User search
- Follow/unfollow
- Follow requests (accept/decline)
- Privacy settings
- Username change

### ⚠️ Partial Implementation
- **Follow Status Detection**: The `FollowButton` component needs to know the current follow status. Currently hardcoded to check this. You may need to:
  - Add a query to check follow relationship
  - Or modify backend to include follow status in account response

- **User Posts Viewing**: The `UserProfilePage` shows a placeholder for viewing other users' posts. The backend's `/posts` endpoint only returns the current user's posts. To view other users' posts, you would need:
  - A new endpoint: `GET /posts/user/:id` 
  - Or modify existing endpoint to accept a user ID parameter

- **Post Liked Status**: The posts list doesn't include whether the current user has liked each post. You may need to:
  - Modify backend to include liked status in posts list
  - Or fetch liked status separately

### 📝 Backend Response Format Notes

1. **Posts List Response**
   ```json
   {
     "ok": true,
     "data": [
       {
         "id": 1,
         "title": "...",
         "description": "...",
         "images": [{"image_url": "..."}],
         "author": {"name": "...", "surname": "..."}
       }
     ]
   }
   ```
   Note: Does not include `likesCount` or `liked` status.

2. **Post Detail Response**
   ```json
   {
     "ok": true,
     "data": {
       "id": 1,
       "title": "...",
       "description": "...",
       "images": [...],
       "author": {...},
       "likesCount": 5,
       "commentsCount": 3
     }
   }
   ```
   Note: Does not include `liked` status.

3. **Follow Response**
   ```json
   {
     "ok": true,
     "payload": {
       "status": "followed" | "requested" | "unfollowed",
       "targetUser": {...}
     }
   }
   ```

## Image URL Handling

The frontend handles image URLs in two ways:
1. Absolute URLs (starting with `http`) - used as-is
2. Relative URLs - prepended with `API_BASE_URL`

This matches the backend's file upload structure where images are stored in `uploads/posts/`.

## Follow Status Logic

The follow system has three states:
- `unfollowed`: Not following
- `requested`: Follow request sent (for private accounts)
- `followed`: Following (approved)

The frontend handles this, but you may need to:
1. Query the current follow status when viewing a user profile
2. Update the status after follow/unfollow actions

## Environment Setup

1. Copy `.env.example` to `.env`
2. Set `VITE_API_URL` to your backend URL
3. Ensure backend CORS is configured to allow frontend origin

## Testing Checklist

- [ ] Login with valid credentials
- [ ] Signup with new account
- [ ] Create a post with images
- [ ] Like/unlike a post
- [ ] Add a comment
- [ ] Search for users
- [ ] View user profile
- [ ] Follow/unfollow a user
- [ ] Change privacy settings
- [ ] Accept/decline follow requests
- [ ] Change username

## Known Limitations

1. Posts list only shows current user's posts (backend limitation)
2. Follow status not included in account response (needs separate query)
3. Liked status not included in posts list (needs backend modification)
4. No pagination (backend doesn't support it yet)

## Future Backend Enhancements Needed

1. **Posts Endpoint Enhancement**
   ```javascript
   GET /posts?userId=123  // Get posts for specific user
   GET /posts?page=1&limit=10  // Pagination
   ```

2. **Account Response Enhancement**
   ```javascript
   GET /account/:id
   // Include: followStatus, isFollowing, etc.
   ```

3. **Posts List Enhancement**
   ```javascript
   GET /posts
   // Include: likesCount, liked (boolean), commentsCount
   ```

4. **Follow Status Endpoint**
   ```javascript
   GET /account/:id/follow-status
   // Returns: { status: "followed" | "requested" | "unfollowed" }
   ```

## Performance Considerations

- React Query caches all API responses
- Optimistic updates for likes and follows
- Skeleton loaders for better UX
- Memoized components to prevent re-renders
- Image lazy loading

## Security Notes

- Tokens stored in localStorage (consider httpOnly cookies for production)
- All API requests include Authorization header
- 401 responses trigger automatic logout
- Input validation on frontend (backend is source of truth)

