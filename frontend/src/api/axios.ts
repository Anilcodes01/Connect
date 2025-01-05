import axios from 'axios';
import { User } from '@/types/user';
import { FriendRequest } from '@/types/user';

const api = axios.create({
  baseURL: 'http://localhost:6001/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    if (config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const userApi = {
  getAllUsers: async () => {
    const response = await api.get<{ users: User[] }>('/getAllUsers');
    return response.data;
  },
  searchUsers: async (username: string) => {
    const response = await api.get<{ users: User[] }>(`/search?username=${username}`);
    return response.data;
  },
};

export const friendApi = {
  sendFriendRequest: async (to: string) => {
    const response = await api.post('/friend/send', { to });
    return response.data;
  },
  getPendingRequests: async () => {
    const response = await api.get<{ requests: FriendRequest[] }>('/friend/pending');
    return response.data;
  },
  handleFriendRequest: async (requestId: string, action: 'accept' | 'rejected') => {
    const response = await api.put(`/friend/${requestId}/handle`, { action });
    return response.data;
  },
};