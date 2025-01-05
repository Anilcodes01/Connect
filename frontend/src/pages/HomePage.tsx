import React from 'react';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';
import SearchBar from '../components/SearchBar';
import UserList from '../components/UserList';
import PendingRequests from '../components/PendingRequests';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const HomePage: React.FC = () => {
  const {
    users,
    pendingRequests,
    searchQuery,
    setSearchQuery,
    sendFriendRequest,
    handleRequest
  } = useUser();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <h1 className="text-xl font-bold">Connect</h1>
          <Button variant="ghost" size="icon" onClick={logout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </nav>

      <main className="container mx-auto p-8">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        
        {pendingRequests.length > 0 && (
          <PendingRequests
            requests={pendingRequests}
            onHandle={handleRequest}
          />
        )}

        {users.length > 0 && (
          <UserList
            title="Users"
            users={users}
            isFriendList={false}
            onUserAction={(user) => sendFriendRequest(user._id)}
          />
        )}
      </main>
    </div>
  );
};

export default HomePage;