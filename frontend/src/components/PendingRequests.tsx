import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { FriendRequest } from '../types/user';

interface PendingRequestsProps {
  requests: FriendRequest[];
  onHandle: (requestId: string, action: 'accept' | 'rejected') => Promise<void>;
}

const PendingRequests: React.FC<PendingRequestsProps> = ({ requests, onHandle }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold mb-4">Pending Requests ({requests.length})</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {requests.map((request) => (
        <Card key={request._id} className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-4">
              <img
                src={request.from.profilePicture}
                alt={request.from.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-semibold">{request.from.name}</h3>
                <p className="text-sm text-gray-500">@{request.from.username}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex justify-end space-x-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => onHandle(request._id, 'accept')}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="text-red-500"
              onClick={() => onHandle(request._id, 'rejected')}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default PendingRequests;