import { memo, useCallback } from 'react';

/**
 * ProfileTabs Component
 * Tab navigation for profile pages (Posts, Followers, Followings)
 */
const ProfileTabsComponent = ({ activeTab, onTabChange }) => {
  const handleTabClick = useCallback((tab) => {
    onTabChange(tab);
  }, [onTabChange]);

  const tabs = [
    { id: 'posts', label: 'Posts' },
    { id: 'followers', label: 'Followers' },
    { id: 'followings', label: 'Following' },
  ];

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export const ProfileTabs = memo(ProfileTabsComponent);

ProfileTabs.displayName = 'ProfileTabs';

