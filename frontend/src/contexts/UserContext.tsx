import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, FriendRequest } from '../types/user';
import { userApi, friendApi } from '../api/axios';

interface UserContextType {
  users: User[];
  pendingRequests: FriendRequest[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sendFriendRequest: (userId: string) => Promise<void>;
  handleRequest: (requestId: string, action: 'accept' | 'rejected') => Promise<void>;
  searchUsers: (username: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchPendingRequests();
  }, []);

  const fetchUsers = async () => {
    try {
      const { users: fetchedUsers } = await userApi.getAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const { requests } = await friendApi.getPendingRequests();
      setPendingRequests(requests);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  const searchUsers = async (username: string) => {
    try {
      const { users: searchResults } = await userApi.searchUsers(username);
      setUsers(searchResults);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const sendFriendRequest = async (userId: string) => {
    try {
      await friendApi.sendFriendRequest(userId);
      // Refresh users list after sending request
      fetchUsers();
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const handleRequest = async (requestId: string, action: 'accept' | 'rejected') => {
    try {
      await friendApi.handleFriendRequest(requestId, action);
      // Refresh pending requests after handling
      fetchPendingRequests();
    } catch (error) {
      console.error('Error handling friend request:', error);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      searchUsers(searchQuery);
    } else {
      fetchUsers();
    }
  }, [searchQuery]);

  return (
    <UserContext.Provider value={{
      users,
      pendingRequests,
      searchQuery,
      setSearchQuery,
      sendFriendRequest,
      handleRequest,
      searchUsers
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};