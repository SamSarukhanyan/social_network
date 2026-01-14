import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { queryClient } from '@/lib/queryClient';
import { AuthProvider } from '@/contexts/auth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PublicRoute } from '@/components/PublicRoute';

// Pages
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import HomePage from '@/pages/HomePage';
import ProfilePage from '@/pages/ProfilePage';
import UserProfilePage from '@/pages/UserProfilePage';
import SettingsPage from '@/pages/SettingsPage';
import FollowRequestsPage from '@/pages/FollowRequestsPage';
import FollowersPage from '@/pages/FollowersPage';
import FollowingsPage from '@/pages/FollowingsPage';
import PostDetailPage from '@/pages/PostDetailPage';

import '@/styles/index.css';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            {/* Public routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <SignupPage />
                </PublicRoute>
              }
            />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/:id"
              element={
                <ProtectedRoute>
                  <UserProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/requests"
              element={
                <ProtectedRoute>
                  <FollowRequestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/followers"
              element={
                <ProtectedRoute>
                  <FollowersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/followings"
              element={
                <ProtectedRoute>
                  <FollowingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/post/:id"
              element={
                <ProtectedRoute>
                  <PostDetailPage />
                </ProtectedRoute>
              }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

