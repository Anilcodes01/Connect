import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus } from "lucide-react";
import { User } from "../types/user";

export interface UserCardProps {
  user: User;
  isFriend: boolean;
  onAction: (user: User) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, isFriend, onAction }) => (
  <Card className="hover:shadow-lg transition-all duration-300 border border-indigo-50">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img
            src={user.profilePicture}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
          />
     
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{user.name}</h3>
          <p className="text-sm text-gray-500">@{user.username}</p>
        </div>
      </div>
      <Button
        variant={isFriend ? "destructive" : "default"}
        size="icon"
        onClick={() => onAction(user)}
        className={`${
          isFriend 
            ? "bg-red-50 hover:bg-red-100 text-red-600" 
            : "bg-indigo-50 hover:bg-indigo-100 text-indigo-600"
        } transition-colors duration-200`}
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
      {user.bio && (
        <p className="mt-2 text-sm text-gray-700 line-clamp-2">{user.bio}</p>
      )}
      {user.interests && user.interests.length > 0 && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {user.interests.map((interest, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}
    </CardContent>
  </Card>
);

export default UserCard;
