import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Search } from '@/components/Search';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="text-xl sm:text-2xl font-bold text-primary-600">Social Network</div>
          </Link>

          {/* Search - Hidden on mobile, visible on tablet+ */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4 lg:mx-8">
            <Search />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary-600 px-2 xl:px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/profile"
              className="text-gray-700 hover:text-primary-600 px-2 xl:px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Profile
            </Link>
            <Link
              to="/settings"
              className="text-gray-700 hover:text-primary-600 px-2 xl:px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Settings
            </Link>
            {user?.isPrivate && (
              <Link
                to="/requests"
                className="text-gray-700 hover:text-primary-600 px-2 xl:px-3 py-2 rounded-md text-sm font-medium transition-colors relative"
              >
                Requests
              </Link>
            )}
            <div className="flex items-center space-x-2 xl:space-x-3 ml-2 xl:ml-0">
              <div className="text-xs xl:text-sm text-gray-700 hidden xl:block">
                <span className="font-medium">{user?.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-outline text-xs xl:text-sm px-3 xl:px-4 py-1.5 xl:py-2"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Mobile Search Icon - Show on tablet */}
            <div className="md:hidden">
              <Search />
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 space-y-2">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors"
            >
              Profile
            </Link>
            <Link
              to="/settings"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors"
            >
              Settings
            </Link>
            {user?.isPrivate && (
              <Link
                to="/requests"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors"
              >
                Requests
              </Link>
            )}
            <div className="px-3 py-2 border-t border-gray-200 mt-2 pt-2">
              <div className="text-xs text-gray-500 mb-2">@{user?.username}</div>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="btn btn-outline w-full text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

