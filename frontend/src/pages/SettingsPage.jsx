import { useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { useChangeUsername, useChangePrivacy } from '@/hooks/useAuth';
import { Layout } from '@/components/Layout/Layout';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { user } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const changeUsernameMutation = useChangeUsername();
  const changePrivacyMutation = useChangePrivacy();

  const handleUsernameChange = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    changeUsernameMutation.mutate({ username: username.trim(), password });
  };

  const handlePrivacyToggle = () => {
    changePrivacyMutation.mutate(!user?.isPrivate);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

        {/* Change Username */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Change Username</h2>
          <form onSubmit={handleUsernameChange} className="space-y-4">
            <div>
              <label htmlFor="new-username" className="block text-sm font-medium text-gray-700 mb-2">
                New Username
              </label>
              <input
                id="new-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                placeholder="Enter new username"
                minLength={3}
                required
                disabled={changeUsernameMutation.isPending}
              />
            </div>
            <div>
              <label htmlFor="password-username" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="password-username"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Enter your password"
                required
                disabled={changeUsernameMutation.isPending}
              />
            </div>
            <button
              type="submit"
              disabled={changeUsernameMutation.isPending}
              className="btn btn-primary disabled:opacity-50"
            >
              {changeUsernameMutation.isPending ? 'Updating...' : 'Update Username'}
            </button>
          </form>
        </div>

        {/* Privacy Settings */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Privacy Settings</h2>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Private Account</h3>
              <p className="text-sm text-gray-600">
                When your account is private, only approved followers can see your posts
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={user?.isPrivate || false}
                onChange={handlePrivacyToggle}
                disabled={changePrivacyMutation.isPending}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;

