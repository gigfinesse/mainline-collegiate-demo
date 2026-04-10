import type { FriendRequest } from '@/lib/types';

export const friendRequests: FriendRequest[] = [
  {
    id: 'fr-1',
    fromUserId: 'user-charlotte',
    toUserId: 'user-marcus',
    status: 'pending',
  },
  {
    id: 'fr-2',
    fromUserId: 'user-harper',
    toUserId: 'user-sarah',
    status: 'pending',
  },
  {
    id: 'fr-3',
    fromUserId: 'user-daniel',
    toUserId: 'user-jake',
    status: 'pending',
  },
];
