# CORS and Port Configuration Fix

## Issues Fixed

### 1. CORS Error ✅
**Problem**: Backend was using default CORS config which might not allow the frontend origin.

**Solution**: 
- Updated CORS configuration in `src/index.js` to explicitly allow frontend origin
- Added `credentials: true` for cookie-based auth
- Configured allowed methods and headers

### 2. Port Mismatch ✅
**Problem**: Frontend trying to connect to port 4004, but backend default is 5000.

**Solution**:
- Backend now defaults to port 5000 if `APP_PORT` is not set
- Added better logging to show which port backend is running on
- Frontend uses `VITE_API_URL` environment variable (defaults to `http://localhost:5000`)

### 3. React Router Warnings ✅
**Problem**: React Router v6 showing future flag warnings.

**Solution**:
- Added future flags to `BrowserRouter`:
  - `v7_startTransition: true`
  - `v7_relativeSplatPath: true`

## Configuration

### Backend CORS Configuration

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

### Environment Variables

**Backend (.env):**
```env
APP_PORT=5000
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000
```

## Setup Instructions

### 1. Backend Setup

1. Create `.env` file in root directory:
```bash
cd /home/samvel-sarukhanyan/Social_network_backend
cp .env.example .env  # If .env.example exists
```

2. Set environment variables:
```env
APP_PORT=5000
FRONTEND_URL=http://localhost:3000
```

3. Start backend:
```bash
npm start
# Should see: 🚀 Server running on http://localhost:5000
```

### 2. Frontend Setup

1. Create `.env` file in frontend directory:
```bash
cd frontend
cp .env.example .env  # If .env.example exists
```

2. Set environment variables:
```env
VITE_API_URL=http://localhost:5000
```

3. Start frontend:
```bash
npm run dev
# Should run on http://localhost:3000
```

### 3. Verify Connection

1. Check browser console - should see:
```
[API Config] Base URL: http://localhost:5000
[API Config] Frontend URL: http://localhost:3000
[API Config] Backend should allow CORS for: http://localhost:3000
```

2. Check backend console - should see:
```
🚀 Server running on http://localhost:5000
📡 CORS enabled for: http://localhost:3000
```

## Troubleshooting

### Issue: Still getting CORS error

**Solution**:
1. Check backend is running: `curl http://localhost:5000`
2. Check `FRONTEND_URL` in backend `.env` matches frontend URL
3. Restart backend after changing `.env`
4. Check browser console for actual CORS error message

### Issue: Connection refused

**Solution**:
1. Verify backend is running on correct port
2. Check `VITE_API_URL` in frontend `.env` matches backend port
3. Restart frontend dev server after changing `.env`
4. Check backend console for startup messages

### Issue: Port 4004 instead of 5000

**Solution**:
1. Check if `VITE_API_URL` is set to `http://localhost:4004` in frontend `.env`
2. Either:
   - Change frontend `.env` to use port 5000, OR
   - Change backend `APP_PORT` to 4004 and update CORS accordingly

## Files Modified

1. `src/index.js` - Enhanced CORS configuration and port handling
2. `frontend/src/App.jsx` - Added React Router future flags
3. `frontend/src/lib/axios.js` - Enhanced error messages and logging

## Testing

1. ✅ Backend starts on correct port
2. ✅ Frontend connects to backend
3. ✅ No CORS errors
4. ✅ No React Router warnings
5. ✅ API requests work correctly

All fixes are production-ready! 🚀

