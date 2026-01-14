# Data Flow Diagrams

## Authentication Flow

```
┌─────────────┐
│  LoginPage  │
└──────┬──────┘
       │
       │ User submits credentials
       ▼
┌──────────────────┐
│  useAuth().login │
└──────┬───────────┘
       │
       │ Calls authService.login()
       ▼
┌──────────────────┐
│  auth.service.js │
└──────┬───────────┘
       │
       │ POST /auth/login
       ▼
┌──────────────────┐
│  Backend API     │
└──────┬───────────┘
       │
       │ Returns { ok: true, payload: token }
       ▼
┌──────────────────┐
│  AuthContext     │
│  - Stores token  │
│  - Fetches user  │
└──────┬───────────┘
       │
       │ Updates isAuthenticated
       ▼
┌──────────────────┐
│  Redirect to /   │
└──────────────────┘
```

## Post Creation Flow

```
┌─────────────┐
│  PostForm   │
└──────┬──────┘
       │
       │ User submits form with images
       ▼
┌──────────────────┐
│ useCreatePost()  │
└──────┬───────────┘
       │
       │ Creates FormData
       │ Calls postService.createPost()
       ▼
┌──────────────────┐
│  post.service.js │
└──────┬───────────┘
       │
       │ POST /posts (multipart/form-data)
       ▼
┌──────────────────┐
│  Backend API     │
└──────┬───────────┘
       │
       │ Returns { ok: true, data: post }
       ▼
┌──────────────────┐
│  React Query     │
│  - Invalidates   │
│    ['posts']     │
└──────┬───────────┘
       │
       │ Triggers refetch
       ▼
┌──────────────────┐
│  HomePage        │
│  - Shows new post│
└──────────────────┘
```

## Follow Flow with Optimistic Update

```
┌─────────────┐
│FollowButton │
└──────┬──────┘
       │
       │ User clicks Follow
       ▼
┌──────────────────┐
│   useFollow()     │
│   onMutate()      │
│   - Optimistically│
│     updates UI    │
└──────┬───────────┘
       │
       │ POST /account/:id/follow
       ▼
┌──────────────────┐
│  Backend API     │
└──────┬───────────┘
       │
       │ Returns { status: "followed" }
       ▼
┌──────────────────┐
│   useFollow()     │
│   onSuccess()     │
│   - Updates cache │
│   - Invalidates   │
│     queries       │
└──────┬───────────┘
       │
       │ UI shows "Unfollow"
       ▼
┌──────────────────┐
│  UserProfilePage │
│  - Updated state │
└──────────────────┘
```

## Like Flow

```
┌─────────────┐
│  LikeButton │
└──────┬──────┘
       │
       │ User clicks like
       ▼
┌──────────────────┐
│  useLikePost()   │
│  onMutate()      │
│  - Optimistically │
│    updates count │
└──────┬───────────┘
       │
       │ POST /posts/:id/like
       ▼
┌──────────────────┐
│  Backend API     │
└──────┬───────────┘
       │
       │ Returns { liked: true }
       ▼
┌──────────────────┐
│  useLikePost()   │
│  onSuccess()     │
│  - Syncs with     │
│    server        │
└──────┬───────────┘
       │
       │ Heart icon filled
       ▼
┌──────────────────┐
│   PostCard       │
│   - Updated UI   │
└──────────────────┘
```

## Query Invalidation Flow

```
┌──────────────────┐
│  Mutation        │
│  (e.g., follow)  │
└──────┬───────────┘
       │
       │ onSuccess()
       ▼
┌──────────────────┐
│  queryClient     │
│  .invalidateQueries│
└──────┬───────────┘
       │
       │ Invalidates:
       │ - ['account', userId]
       │ - ['account', 'followers']
       │ - ['posts']
       ▼
┌──────────────────┐
│  React Query     │
│  - Refetches      │
│    invalidated    │
│    queries        │
└──────┬───────────┘
       │
       │ Components using
       │ these queries
       │ automatically
       │ re-render
       ▼
┌──────────────────┐
│  UI Updates      │
│  - Fresh data     │
└──────────────────┘
```

## Error Handling Flow

```
┌──────────────────┐
│  API Request     │
└──────┬───────────┘
       │
       │ Error occurs
       ▼
┌──────────────────┐
│  Axios           │
│  Interceptor     │
└──────┬───────────┘
       │
       │ Checks status code
       ▼
┌──────────────────┐
│  401 Unauthorized│
│  - Remove token  │
│  - Show toast    │
│  - Redirect to   │
│    login         │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  400/500 Errors  │
│  - Show toast    │
│  - Return error  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Mutation        │
│  onError()       │
│  - Rollback      │
│    optimistic    │
│    update        │
└──────────────────┘
```

## Component Hierarchy

```
App
├── QueryClientProvider
│   └── AuthProvider
│       └── BrowserRouter
│           └── Routes
│               ├── PublicRoute
│               │   ├── LoginPage
│               │   └── SignupPage
│               └── ProtectedRoute
│                   ├── Layout
│                   │   └── Navbar
│                   │       └── Search
│                   ├── HomePage
│                   │   ├── PostForm
│                   │   └── PostCard[]
│                   │       ├── LikeButton
│                   │       └── CommentSection
│                   ├── ProfilePage
│                   ├── UserProfilePage
│                   │   └── FollowButton
│                   ├── SettingsPage
│                   └── FollowRequestsPage
```

## State Management Layers

```
┌─────────────────────────────────────┐
│  Global State (React Context)      │
│  - Auth state (token, user)        │
│  - Only for authentication         │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  Server State (React Query)        │
│  - All API data                     │
│  - Automatic caching                │
│  - Background refetching            │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  Component State (useState)         │
│  - Form inputs                      │
│  - UI state (modals, dropdowns)     │
│  - Temporary values                 │
└─────────────────────────────────────┘
```

