import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, UserMinus } from 'lucide-react';
import { User } from '../types/user';

export interface UserCardProps {
  user: User;
  isFriend: boolean;
  onAction: (user: User) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, isFriend, onAction }) => (
  <Card className="w-full max-w-sm">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="flex items-center space-x-4">
        <img
          src={user.profilePicture}
          alt={user.name}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h3 className="font-semibold">{user.name}</h3>
          <p className="text-sm text-gray-500">@{user.username}</p>
        </div>
      </div>
      <Button
        variant={isFriend ? "destructive" : "default"}
        size="icon"
        onClick={() => onAction(user)}
      >
        {isFriend ? (
          <UserMinus className="h-4 w-4" />
        ) : (
          <UserPlus className="h-4 w-4" />
        )}
      </Button>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-600">{user.email}</p>
      {user.bio && <p className="mt-2 text-sm">{user.bio}</p>}
    </CardContent>
  </Card>
);

export default UserCard;