# Social Network Frontend

Production-ready React frontend for the social network backend.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Features

- ✅ User authentication (login/signup)
- ✅ User profiles with privacy settings
- ✅ Follow/unfollow system
- ✅ Follow requests for private accounts
- ✅ Post creation with images
- ✅ Like/unlike posts
- ✅ Comments on posts
- ✅ User search
- ✅ Responsive design
- ✅ Optimistic UI updates
- ✅ Error handling
- ✅ Loading states

## Tech Stack

- React 18
- React Router 6
- TanStack Query (React Query)
- Axios
- Tailwind CSS
- Vite

## Project Structure

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## Environment Variables

Create a `.env` file:

```
VITE_API_URL=http://localhost:5000
```

## Development

The app runs on `http://localhost:3000` by default.

The Vite dev server proxies API requests to the backend:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000` (configured in `vite.config.js`)

## Backend Integration

This frontend is tightly coupled to the backend API. Ensure the backend is running and accessible at the configured URL.

## License

ISC

