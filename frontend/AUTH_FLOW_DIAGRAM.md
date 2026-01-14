# Authentication Flow Diagram

## Complete Authentication Flow (Fixed)

```
┌─────────────────────────────────────────────────────────────┐
│                    USER LOGIN REQUEST                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  LoginPage: handleSubmit()                                  │
│  - Validates form                                           │
│  - Calls useAuth().login(credentials)                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  AuthContext: login()                                       │
│  - Calls authService.login(credentials)                     │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  auth.service.js: login()                                    │
│  - POST /auth/login                                          │
│  - Axios interceptor adds: Authorization: Bearer <token>     │
│    (reads from localStorage - might be empty on first call)   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  Backend: /auth/login                                        │
│  - Validates credentials                                    │
│  - Generates JWT: jwt.sign({ id: user.id }, secret, 20d)   │
│  - Returns: { ok: true, payload: "<token>" }                │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  AuthContext: login() - SUCCESS                             │
│  ✅ localStorage.setItem('auth_token', token)  // IMMEDIATE  │
│  ✅ setToken(token)  // Update React state                   │
│  ✅ await refetch()  // Fetch user data                      │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  React Query: refetch()                                      │
│  - Calls authService.getAuthUser()                           │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  auth.service.js: getAuthUser()                              │
│  - GET /auth/user                                            │
│  - Axios interceptor reads token from localStorage           │
│  - Adds: Authorization: Bearer <token>                      │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  Backend: isAuthenticated middleware                         │
│  - Reads: Authorization header                               │
│  - Extracts: Bearer <token>                                  │
│  - Verifies: jwt.verify(token, JWT_SECRET)                  │
│  - Finds user by decoded.id                                  │
│  - Sets: req.user = { id: user.id }                         │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  Backend: /auth/user                                         │
│  - Returns: { ok: true, payload: { user data } }            │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  AuthContext: React Query                                    │
│  ✅ userData = response.payload                              │
│  ✅ isAuthenticated = !!token && !!userData  // TRUE         │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  ProtectedRoute                                              │
│  - Checks: isAuthenticated = true                            │
│  - Checks: isLoading = false                                │
│  ✅ Renders protected content                                │
└─────────────────────────────────────────────────────────────┘
```

## Error Scenarios

### Scenario 1: Invalid Token After Login

```
┌─────────────────────────────────────────────────────────────┐
│  AuthContext: refetch() → GET /auth/user                   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  Backend: isAuthenticated middleware                        │
│  - jwt.verify() fails → TokenExpiredError or JsonWebTokenError│
│  - Returns: 401 { ok: false, message: "Token expired" }     │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  Axios Interceptor                                           │
│  - Detects: 401 on /auth/user                                │
│  - isGetUserRequest = true                                  │
│  - Does NOT show toast (handled by AuthContext)             │
│  - Rejects promise                                           │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  AuthContext: React Query onError                           │
│  ✅ setToken(null)                                           │
│  ✅ localStorage.removeItem('auth_token')                    │
│  ✅ queryClient.clear()                                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  ProtectedRoute                                              │
│  - Checks: token = null                                       │
│  - Checks: isAuthenticated = false                           │
│  ✅ Redirects to /login                                       │
└─────────────────────────────────────────────────────────────┘
```

### Scenario 2: 401 on Protected Endpoint

```
┌─────────────────────────────────────────────────────────────┐
│  User Action: Like post, follow user, etc.                   │
│  - Calls API endpoint (e.g., POST /posts/:id/like)          │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  Axios Interceptor                                           │
│  - Reads token from localStorage                             │
│  - Adds: Authorization: Bearer <expired_token>              │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  Backend: isAuthenticated middleware                         │
│  - jwt.verify() fails → 401                                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  Axios Interceptor                                           │
│  - Detects: 401 on /posts/:id/like                           │
│  - isGetUserRequest = false                                 │
│  - isAuthRequest = false                                    │
│  ✅ Shows toast: "Session expired. Please login again."     │
│  ✅ localStorage.removeItem('auth_token')                   │
│  - Rejects promise                                           │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  AuthContext: React Query                                    │
│  - /auth/user query fails (if running)                      │
│  - onError handler clears token                              │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  ProtectedRoute                                              │
│  - Checks: token = null                                       │
│  ✅ Redirects to /login                                       │
└─────────────────────────────────────────────────────────────┘
```

## Page Refresh Flow

```
┌─────────────────────────────────────────────────────────────┐
│  User refreshes page (F5)                                    │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  AuthContext: Initialization                                 │
│  - useState(() => localStorage.getItem('auth_token'))        │
│  - token = "<existing_token>"                                │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  React Query: useQuery(['authUser'])                         │
│  - enabled: !!token = true                                   │
│  - Calls: authService.getAuthUser()                          │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  Axios Interceptor                                           │
│  - Reads token from localStorage                             │
│  - Adds: Authorization: Bearer <token>                      │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  Backend: Validates token → Returns user data                │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  AuthContext: userData loaded                                │
│  ✅ isAuthenticated = true                                   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  ProtectedRoute                                              │
│  ✅ Renders protected content                                │
└─────────────────────────────────────────────────────────────┘
```

## Logout Flow

```
┌─────────────────────────────────────────────────────────────┐
│  User clicks logout                                          │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  AuthContext: logout()                                       │
│  ✅ setToken(null)                                           │
│  ✅ queryClient.clear()                                      │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  useEffect: Token changed                                    │
│  ✅ localStorage.removeItem('auth_token')                   │
│  ✅ queryClient.clear()                                      │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  AuthContext: isAuthenticated                                │
│  - token = null                                              │
│  - userData = null                                           │
│  ✅ isAuthenticated = false                                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  ProtectedRoute                                              │
│  ✅ Redirects to /login                                       │
└─────────────────────────────────────────────────────────────┘
```

## Key Fixes Applied

1. **Token Storage Order**: localStorage → state → refetch
2. **401 Handling**: Silent for `/auth/user`, visible for other endpoints
3. **Loading States**: ProtectedRoute waits for user data when token exists
4. **Error Recovery**: Automatic token cleanup on 401
5. **Race Condition**: Eliminated by proper token storage order

