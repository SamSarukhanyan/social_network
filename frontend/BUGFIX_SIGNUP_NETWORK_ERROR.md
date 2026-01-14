# Bug Fix: Signup Network Error

## Problem
During signup, users received a generic "Network error. Please check your connection." toast even when the backend was running and internet connection was stable.

## Root Causes Identified

### 1. **Generic Error Handling** (`src/lib/axios.js:38-40`)
- **Issue**: Axios interceptor showed "Network error" for ALL errors without a response object
- **Problem**: Could not distinguish between:
  - CORS errors
  - Connection refused (backend not running)
  - Actual network failures
  - Timeout errors

### 2. **Poor Error Diagnostics**
- **Issue**: No specific error messages to help debug the issue
- **Problem**: Users couldn't tell if backend was down, CORS was blocking, or port was wrong

### 3. **Duplicate Toast Messages**
- **Issue**: Both axios interceptor and component showed error toasts
- **Problem**: Users saw duplicate error messages

### 4. **Error Message Extraction**
- **Issue**: Error handling didn't properly extract backend error messages
- **Problem**: Backend validation errors (400) showed generic messages instead of specific ones

## Fixes Applied

### 1. Enhanced Error Detection (`src/lib/axios.js`)
```javascript
// Before: Generic "Network error" for all no-response errors
if (!response) {
  toast.error('Network error. Please check your connection.');
}

// After: Specific error messages based on error type
if (!response) {
  if (code === 'ECONNREFUSED' || code === 'ERR_NETWORK') {
    if (isCorsError) {
      toast.error('CORS error: Backend may not be configured to allow this origin.');
    } else if (code === 'ECONNREFUSED') {
      toast.error('Cannot connect to server. Is the backend running on port 5000?');
    } else {
      toast.error('Network error. Please check your connection and ensure the backend is running.');
    }
  } else if (code === 'ETIMEDOUT' || code === 'ECONNABORTED') {
    toast.error('Request timeout. The server is taking too long to respond.');
  }
}
```

### 2. Better Backend Error Extraction (`src/lib/axios.js:73`)
```javascript
// Extract error message from backend response
// Backend returns { ok: false, message: "..." }
const errorMessage = data?.message || 'An error occurred';
```

### 3. Improved Auth Error Handling (`src/lib/axios.js:77-85`)
- Only show 401 toast for non-auth requests
- Let login/signup components handle their own 401 errors

### 4. Removed Duplicate Toasts (`src/pages/SignupPage.jsx`)
- Removed duplicate toast in component
- Axios interceptor handles all error toasts

### 5. Enhanced Error Context (`src/contexts/AuthContext.jsx`)
- Better error message extraction in signup/login functions
- Handles both response errors and network errors

### 6. Debug Logging (`src/lib/axios.js:6-8`)
- Added console log for API base URL in development
- Helps verify environment variable is loaded correctly

## Files Modified

1. `src/lib/axios.js` - Enhanced error handling and diagnostics
2. `src/contexts/AuthContext.jsx` - Improved error message extraction
3. `src/pages/SignupPage.jsx` - Removed duplicate toast handling

## Verification Checklist

- [x] Network errors show specific messages (CORS, connection refused, timeout)
- [x] Backend validation errors (400) show backend message
- [x] No duplicate toasts
- [x] 401 errors handled correctly for auth vs non-auth requests
- [x] API base URL logged in development mode

## Testing Steps

1. **Backend Not Running**
   - Stop backend server
   - Try to signup
   - Should see: "Cannot connect to server. Is the backend running on port 5000?"

2. **CORS Error** (if backend CORS misconfigured)
   - Should see: "CORS error: Backend may not be configured to allow this origin."

3. **Backend Validation Error**
   - Try signup with existing username
   - Should see: "Username already taken" (from backend)

4. **Network Timeout**
   - Should see: "Request timeout. The server is taking too long to respond."

5. **Successful Signup**
   - Valid credentials
   - Should redirect to home page
   - No error toasts

## Environment Variables

Ensure `.env` file exists in `frontend/` directory:
```
VITE_API_URL=http://localhost:5000
```

**Note**: After changing `.env`, restart the Vite dev server.

## Backend CORS Configuration

The backend uses `cors()` which allows all origins by default. If you need to restrict it:

```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

## Additional Notes

- The axios interceptor now provides detailed error messages
- All network errors are properly categorized
- Backend error messages are properly extracted and displayed
- No duplicate toasts are shown
- Debug logging helps identify configuration issues

