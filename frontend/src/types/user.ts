export interface User {
    _id: string;
    name: string;
    username: string;
    email: string;
    profilePicture: string;
    bio: string;
    interests: string[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface FriendRequest {
    _id: string;
    from: User;
    to: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
    updatedAt: string;
  }