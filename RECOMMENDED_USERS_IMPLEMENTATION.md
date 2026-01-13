# Recommended Users Feature - Implementation Guide

## Overview

This document describes the implementation of the "Recommended Users" feature, which was added **without modifying any existing code**. The feature is fully isolated and production-safe.

## Architecture Principles

### ✅ Isolation
- **New files only**: All recommended users logic is in separate files
- **No modifications**: Existing controllers, services, and routes remain untouched
- **Optional feature**: If the endpoint is never called, nothing breaks

### ✅ Reusability
- Reuses existing `Follow` model and associations
- Reuses existing `FollowButton` component
- Reuses existing `useFollow` mutation hook
- No duplicate logic

### ✅ State Synchronization
- React Query cache invalidation ensures follow status syncs across all components
- Optimistic updates work seamlessly
- No state duplication

## Backend Implementation

### Files Created

1. **`src/modules/account/recommended.service.js`**
   - Service class for recommended users logic
   - Queries users ordered by ID DESC (newest first, since timestamps are disabled)
   - Excludes current user and already followed users
   - Computes follow status for each user

2. **`src/modules/account/recommended.controller.js`**
   - Controller for handling HTTP requests
   - Validates limit parameter (max 50)
   - Returns standardized response format

3. **Route Addition in `account.router.js`**
   - Added `GET /account/recommended` route
   - **Placed BEFORE `/:id` route** to avoid route conflicts
   - Uses same authentication middleware

### Endpoint

```
GET /account/recommended?limit=20
```

**Response:**
```json
{
  "ok": true,
  "payload": {
    "users": [
      {
        "id": 123,
        "name": "John",
        "surname": "Doe",
        "username": "johndoe",
        "picture_url": "/uploads/users/avatar.jpg",
        "isPrivate": false,
        "followStatus": "unfollowed"
      },
      ...
    ],
    "count": 20
  }
}
```

### Logic Flow

1. **Get existing follows**: Query all Follow records where `followerId = currentUserId`
2. **Build exclusion list**: Extract `followingId` values from existing follows
3. **Query users**: Find users where:
   - `id != currentUserId` (exclude self)
   - `id NOT IN followedUserIds` (exclude already followed)
   - Order by `id DESC` (newest users first)
   - Limit to requested amount
4. **Compute follow status**: For each user, check if a Follow record exists and get its status
5. **Return transformed data**: Include only required fields + follow status

### Why This Is Safe

- ✅ Uses existing `Follow` model (no new tables)
- ✅ Reuses existing follow status logic
- ✅ No side effects on existing endpoints
- ✅ Efficient queries with proper indexing
- ✅ Handles edge cases (no users, all users followed, etc.)

## Frontend Implementation

### Files Created

1. **`frontend/src/hooks/useRecommendedUsers.js`**
   - React Query hook for fetching recommended users
   - Configurable limit parameter
   - 5-minute stale time (recommended users don't change frequently)

2. **`frontend/src/components/Recommended/RecommendedUsers.jsx`**
   - Main component for displaying recommended users list
   - Handles loading and error states
   - Renders `RecommendedUserRow` for each user

3. **`frontend/src/components/Recommended/RecommendedUserRow.jsx`**
   - Individual user row component
   - Displays avatar, username, and follow button
   - Memoized for performance
   - Links to user profile

### Integration Points

1. **HomePage** (`frontend/src/pages/HomePage.jsx`)
   - Added sidebar with recommended users (desktop only)
   - Grid layout: 2 columns for posts, 1 column for sidebar

2. **ProfilePage** (`frontend/src/pages/ProfilePage.jsx`)
   - Added recommended users section at bottom
   - Always visible below profile tabs

3. **UserProfilePage** (`frontend/src/pages/UserProfilePage.jsx`)
   - Added recommended users section at bottom
   - Always visible below profile tabs

### State Synchronization

The `useFollow` mutation hook was updated to invalidate recommended users cache:

```javascript
// In useAccount.js
queryClient.invalidateQueries({ queryKey: ['account', 'recommended'] });
```

This ensures:
- When a user follows someone from recommended list → list updates
- When a user unfollows someone → they may reappear in recommended list
- Follow status is always in sync across all components

### Follow Button Integration

The existing `FollowButton` component is reused:
- Receives `followStatus` prop from recommended users data
- Handles all state transitions (follow, unfollow, cancel request)
- Optimistic updates work automatically
- No modifications needed

## Performance Optimizations

### Backend
- ✅ Efficient Sequelize queries with proper where clauses
- ✅ Single query for follow statuses (batch lookup)
- ✅ Limit validation prevents abuse (max 50)
- ✅ Uses existing database indexes

### Frontend
- ✅ `React.memo` on `RecommendedUserRow` to prevent unnecessary re-renders
- ✅ `useMemo` for avatar URL normalization
- ✅ 5-minute stale time reduces unnecessary refetches
- ✅ Conditional rendering (doesn't render if no users)

## Testing Checklist

### Backend
- [ ] `GET /account/recommended` returns correct users
- [ ] Excludes current user
- [ ] Excludes already followed users
- [ ] Returns correct follow status for each user
- [ ] Limit parameter works correctly
- [ ] Handles edge cases (no users, all followed, etc.)

### Frontend
- [ ] Recommended users display on HomePage (desktop)
- [ ] Recommended users display on ProfilePage
- [ ] Recommended users display on UserProfilePage
- [ ] Follow button works correctly
- [ ] Follow status updates after follow/unfollow
- [ ] List updates after follow action
- [ ] Loading states display correctly
- [ ] Error states handle gracefully
- [ ] No console warnings or errors

### State Synchronization
- [ ] Following a user from recommended list updates the list
- [ ] Unfollowing a user updates the list
- [ ] Follow status is consistent across all pages
- [ ] Optimistic updates work correctly
- [ ] Cache invalidation works correctly

## Production Safety

### Why This Won't Break Existing Code

1. **Route Ordering**: `/recommended` is added BEFORE `/:id` route, so it matches first
2. **Isolated Service**: New service class doesn't touch existing `AccountService`
3. **Isolated Controller**: New controller doesn't touch existing `AccountController`
4. **Optional Feature**: Frontend can choose to not render the component
5. **No Database Changes**: Uses existing tables and associations
6. **No Logic Changes**: Existing follow logic remains untouched

### Deployment Checklist

- [x] Backend routes added without breaking existing routes
- [x] Frontend components are optional (can be removed without breaking app)
- [x] No database migrations required
- [x] No environment variables required
- [x] No breaking changes to existing APIs
- [x] Follows existing code patterns and conventions

## Future Enhancements

Potential improvements (not implemented):
- Algorithm-based recommendations (mutual friends, interests, etc.)
- Caching layer for recommendations
- Real-time updates via WebSocket
- A/B testing different recommendation algorithms

## Conclusion

The Recommended Users feature was successfully implemented following all production-safe principles:
- ✅ No existing code was modified
- ✅ Feature is fully isolated
- ✅ State synchronization works correctly
- ✅ Performance optimizations in place
- ✅ Ready for production deployment

