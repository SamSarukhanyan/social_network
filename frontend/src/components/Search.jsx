import { useState } from 'react';
import { useSearchUsers } from '@/hooks/useAccount';
import { Link } from 'react-router-dom';
import { Avatar } from '@/components/Account/Avatar';

export const Search = () => {
  const [searchText, setSearchText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { data: users = [], isLoading } = useSearchUsers(searchText, isOpen && searchText.length > 0);

  const handleChange = (e) => {
    setSearchText(e.target.value);
    setIsOpen(true);
  };

  const handleSelect = () => {
    setIsOpen(false);
    setSearchText('');
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search users..."
        value={searchText}
        onChange={handleChange}
        onFocus={() => setIsOpen(true)}
        className="input w-full"
      />
      {isOpen && searchText.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : users.length > 0 ? (
            <ul className="py-1">
              {users.map((user) => (
                <li key={user.id}>
                  <Link
                    to={`/user/${user.id}`}
                    onClick={handleSelect}
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <Avatar user={user} size="medium" className="flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {user.name} {user.surname}
                      </div>
                      <div className="text-sm text-gray-500 truncate">@{user.username}</div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">No users found</div>
          )}
        </div>
      )}
      {isOpen && searchText.length > 0 && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

