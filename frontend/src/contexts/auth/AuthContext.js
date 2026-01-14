import { createContext } from 'react';

/**
 * Auth Context
 * Context instance for authentication state
 * 
 * Note: This file only creates the context.
 * Fast Refresh requires stable exports, so we separate:
 * - Context creation (this file)
 * - Provider component (AuthProvider.jsx)
 * - Hook (useAuth.js)
 */
export const AuthContext = createContext(null);

