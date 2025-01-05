import React from 'react';
import UserCard from './UserCard';
import { User } from '../types/user';

export interface UserListProps {
  title: string;
  users: User[];
  isFriendList: boolean;
  onUserAction: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({ title, users, isFriendList, onUserAction }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold mb-4">{title} ({users.length})</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map(user => (
        <UserCard
          key={user._id}
          user={user}
          isFriend={isFriendList}
          onAction={onUserAction}
        />
      ))}
    </div>
  </div>
);

export default UserList;