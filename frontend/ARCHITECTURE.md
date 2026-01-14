# Frontend Architecture Documentation

## Overview

This is a production-ready React frontend for a social network application, built with modern best practices and tightly coupled to the backend API.

## Technology Stack

- **React 18.2** - UI library
- **React Router 6** - Client-side routing
- **TanStack Query (React Query) v5** - Server state management
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library (available, not heavily used)
- **React Hot Toast** - Toast notifications
- **Vite** - Build tool and dev server

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout/          # Layout components (Navbar, Layout)
│   │   ├── Post/            # Post-related components
│   │   ├── Account/         # Account-related components
│   │   ├── ProtectedRoute.jsx
│   │   ├── PublicRoute.jsx
│   │   ├── Search.jsx
│   │   ├── Loading.jsx
│   │   └── Skeleton.jsx
│   ├── contexts/            # React Context providers
│   │   └── AuthContext.jsx  # Authentication state
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.js       # Auth mutations
│   │   ├── useAccount.js    # Account queries & mutations
│   │   └── usePosts.js      # Post queries & mutations
│   ├── services/            # API service layer
│   │   ├── auth.service.js
│   │   ├── account.service.js
│   │   └── post.service.js
│   ├── config/              # Configuration
│   │   └── api.js           # API endpoints
│   ├── lib/                 # Utilities
│   │   ├── axios.js         # Axios instance with interceptors
│   │   └── queryClient.js   # React Query client config
│   ├── pages/               # Page components
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── UserProfilePage.jsx
│   │   ├── SettingsPage.jsx
│   │   └── FollowRequestsPage.jsx
│   ├── styles/
│   │   └── index.css        # Global styles + Tailwind
│   ├── App.jsx               # Root component with routing
│   └── main.jsx              # Entry point
├── package.json
├── vite.config.js
├── tailwind.config.js
└── ARCHITECTURE.md
```

## Architecture Patterns

### 1. Feature-Based Organization

Components, hooks, and services are organized by feature domain:
- **Auth**: Authentication and user management
- **Account**: User profiles, search, follow operations
- **Posts**: Post creation, display, likes, comments

### 2. Separation of Concerns

- **Services Layer**: Pure API calls, no React dependencies
- **Hooks Layer**: React Query hooks wrapping services
- **Components Layer**: UI components using hooks
- **Context Layer**: Global state (auth only)

### 3. State Management Strategy

#### Server State (React Query)
- All API data is managed by React Query
- Automatic caching, refetching, and synchronization
- Optimistic updates for mutations
- Query invalidation for cache updates

#### Client State (React Context)
- Only authentication state is global
- User data fetched via React Query but accessed via context
- Token stored in localStorage

#### Component State (useState)
- Form inputs
- UI state (modals, dropdowns)
- Temporary values

### 4. Data Flow

```
User Action
    ↓
Component (UI)
    ↓
Custom Hook (useMutation/useQuery)
    ↓
Service (API call)
    ↓
Axios Instance (with interceptors)
    ↓
Backend API
    ↓
Response flows back up
    ↓
React Query updates cache
    ↓
Components re-render
```

## Key Features

### Authentication Flow

1. **Login/Signup**
   - User submits credentials
   - Token received from backend
   - Token stored in localStorage
   - AuthContext fetches user data
   - User redirected to home

2. **Token Management**
   - Token added to all requests via Axios interceptor
   - 401 responses trigger logout
   - Token removed on logout

3. **Protected Routes**
   - `ProtectedRoute` checks authentication
   - Redirects to login if not authenticated
   - Preserves intended destination

### Follow System

1. **Follow States**
   - `unfollowed`: Not following
   - `requested`: Follow request sent (private accounts)
   - `followed`: Following (approved)

2. **Private Account Logic**
   - Private accounts require approval
   - Follow button shows "Requested" when pending
   - Posts hidden until approved

3. **Optimistic Updates**
   - UI updates immediately on follow/unfollow
   - Rolls back on error
   - Syncs with server response

### Post System

1. **Post Creation**
   - FormData for multipart upload
   - Image preview before upload
   - Multiple images supported

2. **Like System**
   - Optimistic like/unlike
   - Like count updates immediately
   - Syncs with server

3. **Comments**
   - Inline comment form
   - Real-time updates via query invalidation

### Privacy & Access Control

1. **Backend-Driven**
   - Privacy checks handled by backend
   - Frontend respects 403 responses
   - Private profiles show appropriate UI

2. **UI Indicators**
   - Lock icon for private accounts
   - "Requested" state for pending follows
   - Hidden content messages

## Performance Optimizations

### 1. React.memo
- `PostCard` memoized to prevent unnecessary re-renders
- `LikeButton` memoized

### 2. React Query Caching
- 5-minute stale time for most queries
- 10-minute garbage collection
- Automatic background refetching

### 3. Code Splitting
- Ready for route-based code splitting
- Vite handles automatic chunking

### 4. Image Optimization
- Lazy loading for post images
- Proper image URLs with base URL handling

## Error Handling

### Global Error Handling
- Axios interceptor catches all API errors
- Toast notifications for user feedback
- 401 errors trigger automatic logout

### Component-Level Error Handling
- React Query error states
- Error boundaries (can be added)
- Graceful fallbacks

## Security Considerations

1. **Token Storage**
   - Tokens in localStorage (consider httpOnly cookies for production)
   - Token cleared on logout
   - Token added to requests automatically

2. **XSS Prevention**
   - React's built-in XSS protection
   - No `dangerouslySetInnerHTML` usage

3. **CSRF Protection**
   - Backend handles CSRF (if implemented)
   - Same-origin requests

4. **Input Validation**
   - Client-side validation for UX
   - Backend validation is source of truth

## API Integration

### Endpoint Mapping

All endpoints match backend structure:

- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `GET /auth/user` - Get authenticated user
- `PATCH /auth/user/username` - Change username
- `PATCH /auth/user/privacy` - Change privacy
- `GET /account/search/:text` - Search users
- `GET /account/:id` - Get account by ID
- `GET /account/followers` - Get followers
- `GET /account/followings` - Get followings
- `GET /account/requests` - Get follow requests
- `POST /account/:id/follow` - Follow/unfollow
- `PATCH /account/request/:id/accept` - Accept request
- `PATCH /account/request/:id/decline` - Decline request
- `GET /posts` - Get posts
- `POST /posts` - Create post
- `GET /posts/:id` - Get post by ID
- `POST /posts/:id/like` - Like/unlike post
- `POST /posts/:id/comments` - Add comment

### Request/Response Format

All requests follow backend's expected format:
- Requests: JSON (except multipart for posts)
- Responses: `{ ok: boolean, payload/data: ... }`
- Errors: `{ ok: false, message: string }`

## Styling Approach

### Tailwind CSS
- Utility-first CSS
- Custom color palette (primary-*)
- Responsive design (mobile-first)
- Custom component classes in `index.css`

### Design System
- Consistent spacing (4px grid)
- Primary color: Blue (#0ea5e9)
- Card-based layouts
- Modern, clean aesthetic

## Development Workflow

### Running the App

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

Create `.env` file:
```
VITE_API_URL=http://localhost:5000
```

### Build for Production

```bash
npm run build
```

Output in `dist/` directory.

## Future Enhancements

1. **Pagination**
   - Infinite scroll for posts
   - Cursor-based pagination

2. **Real-time Updates**
   - WebSocket integration
   - Live notifications

3. **Image Optimization**
   - Image compression
   - CDN integration
   - Responsive images

4. **Advanced Features**
   - Post editing
   - Comment editing/deletion
   - User mentions
   - Hashtags

5. **Performance**
   - Virtual scrolling for long lists
   - Service worker for offline support
   - Image lazy loading improvements

## Best Practices Followed

1. ✅ Feature-based folder structure
2. ✅ Separation of concerns (services, hooks, components)
3. ✅ React Query for server state
4. ✅ Optimistic UI updates
5. ✅ Error handling at multiple levels
6. ✅ Loading and skeleton states
7. ✅ Memoization where appropriate
8. ✅ TypeScript-ready structure (can add types)
9. ✅ Accessible HTML
10. ✅ Responsive design

## Notes

- Backend currently only returns user's own posts in `/posts` endpoint
- Follow status determination needs backend support for full implementation
- Some features (like viewing other users' posts) require additional backend endpoints

